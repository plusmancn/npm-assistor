'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.04 17:57:18
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 *
 * 用于标签创建
 */
const fs = require('fs');
const moment = require('moment');
const childProcess = require('child_process');
const partChoices = ['major', 'feature', 'patch'];

function generateTagHandInput(argv){
    let newTag = argv.version; 
    let currentVersion = _getCurentVersion().split('+');
    if(argv.isNeedPublishTimesTag){
        newTag = argv.version + '+' + _transformDate(currentVersion[1]);
    }
    return newTag;
}

function generateTag(argv){
    let currentVersion = argv.version || _getCurentVersion();
    if(currentVersion){
        currentVersion = currentVersion.split('+');
        let semverVersion = _transformSemver(currentVersion[0], argv.part);

        if(currentVersion[1]){
            semverVersion = semverVersion +  '+' + _transformDate(currentVersion[1]);
        }

        return semverVersion;
    }

    return '';
}

// 读取 packge.json 文件，获取当前版本信息
function _getCurentVersion(){
    let path = process.cwd() +  '/package.json';
    let stats = fs.statSync(path);
    if(stats.isFile()){
        let packageInfo = JSON.parse(fs.readFileSync(path));
        return packageInfo.version;
    }
    return '';
}

// semver
function _transformSemver(semverVersion, part){
    let semverArray = semverVersion.split('.').map(function(val){
        return +val;
    });
    let increasePosition = partChoices.indexOf(part);
    semverArray[increasePosition]++;
    for(let i = increasePosition + 1; i < semverArray.length; i++){
        semverArray[i] = 0;
    }

    return semverArray.join('.');
}

// date tag
function _transformDate(timeTag){
    let m = moment();
    let thisWeek = +m.weeks();
    let thisYear = +m.format('YY');

    if(!timeTag){
        return `${thisYear}w${thisWeek}a`;
    }

    let matches = timeTag.match(/(\d{2})w(\d{1,2})(\w)/i);

    let timesLetter = 'a';
    if(thisYear === +matches[1] && thisWeek === +matches[2]){
        let timesCode = matches[3].charCodeAt(0);
        if(++timesCode <= 112){
            timesLetter = String.fromCharCode(timesCode);
        }else{
            throw new Error('已超过发布次数上限[a-z]');
        }
    }

    return `${thisYear}w${thisWeek}${timesLetter}`;
}

function _gitTagAdd(tag, message, callback){
    let command = `git tag -a '${tag}' -m '${message}'`;
    console.log(`>>> Exec ${command} at ${process.cwd()}`);
    childProcess.exec(command, function(err, stdout, stderr){
        callback(stderr, stdout);
    });

}

function _gitTagPush(tag, callback){
    let command = `git push origin '${tag}'`;
    console.log(`>>> Exec ${command} at ${process.cwd()}`);
    childProcess.exec(command, function(err, stdout, stderr){
        if(!err){
            stdout = stderr;
            stderr = null;
        }
        callback(stderr, stdout);
    });
}

function _changePackage(tag, callback){
    let path = process.cwd() +  '/package.json';
    let stats = fs.statSync(path);
    if(stats.isFile()){
        let packageInfo = JSON.parse(fs.readFileSync(path));
        packageInfo.version = tag;
        fs.writeFileSync(path, JSON.stringify(packageInfo, null, '  '));

        childProcess.execSync('git config --local push.default simple');
        // 过分干涉用户行为了，后来想想又是必须的，╮(╯_╰)╭
        let command = `git add package.json && git commit -m \'chore(package.json): updaten version to ${tag} by npm-assistor\' && git push`;
        console.log(`>>> Exec ${command}`);
        childProcess.exec(command, function(err, stdout, stderr){
            if(!err){
                stderr = null;
            }
            callback(stderr, stdout);
        });
    }
}

function _versionValidate(oldVersion, newVersion){
    if(oldVersion === newVersion){
        return {
            pass: false,
            message: '新老版本号不能相同'
        };
    }

    let regExp = /^(\d+)\.(\d+)\.(\d+)$/;
    let oldVersionArr = regExp.exec(oldVersion).slice(1).map( item => +item );
    let newVersionArr = regExp.exec(newVersion).slice(1).map( item => +item );

    for(let i = 0, length = 3; i < length; i++){
        if(oldVersionArr[i] > newVersionArr[i]){
            return {
                pass: false,
                message: '新版本号不能低于老版本号'
            };
        }
        if(oldVersionArr[i] < newVersionArr[i]){
            for(i++; i < length; i++){
                if(newVersionArr[i] !== 0){
                    return {
                        pass: false,
                        message: '递增位右侧位需要清零'
                    };
                }
            }
            break;
        }
    }

    return {
        pass: true,
        message: 'success'
    };

}

exports.getCurentVersion = _getCurentVersion;
exports.gitTagAdd = _gitTagAdd;
exports.changePackage = _changePackage;
exports.gitTagPush = _gitTagPush;
exports.versionValidate = _versionValidate;
exports.generateTag = generateTag;
exports.generateTagHandInput = generateTagHandInput;
