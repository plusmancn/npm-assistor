'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.14 19:22:47
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */

const _ = require('lodash');
const fs   = require('fs');
const request   = require('request');
const config = require('../config.js');

const HOST = config.gitignore_server;

// 从远端获取支持的 IDE
let _supportSystem;
function _getSupportSystem(){
    return new Promise(function(resolve, reject){
        request({
            url: `${HOST}/api/list`,
            method: 'GET',
            json: true
        }, function(err, resp, body){
            if(err){
                reject(err);
            }else{
                _supportSystem = body.split(/,|\n/).map(item => item.trim());
                resolve(body);
            }
        });
    });
}

function recursion(keywords, searchTree){
    let key = keywords.shift();
    if(key){
        key = key.toLowerCase();
        let matches = _supportSystem.filter(function(state) {
            return ~state.toLowerCase().indexOf(key);
        });

        // 按照匹配度排序，以 xx 开头。。。。,完全匹配优先级最高
        matches.sort(function(a, b){
            if(a.toLowerCase() === key){
                return -1;
            }
            if(b.toLowerCase() === key){
                return 1;
            }
            return a.toLowerCase().indexOf(key) - b.toLowerCase().indexOf(key);
        });

        searchTree.push(matches);
        return recursion(keywords, searchTree);
    }else{
        return flatArr(searchTree);
    }
}

function flatArr(_2wArray){
    let deep = _2wArray.length;
    if(deep <=1){
        return _2wArray[0];
    }

    let flatArray;
    for(let i = 1; i < deep; i++){
        if(!flatArray){
            flatArray = twoToOne(_2wArray[0], _2wArray[1]);
        }else{
            flatArray = twoToOne(flatArray, _2wArray[i]);
        }
    }
    return flatArray;
}

// 二维数组一纬展开
function twoToOne(arr1, arr2){
    let newArr = [];
    for(let i =0; i < arr1.length; i++){
        newArr = newArr.concat(arr2.map(function(item){
            return `${arr1[i]} + ${item}`;
        }));
    }
    return newArr;
}

function searcher(answers, input){
    return new Promise(function(resolve){
        if(input){
            let keywords = input.split(',').map(function(item){
                return _.trim(item);
            });
            let searchTree = [];
            resolve(recursion(keywords, searchTree));
        }else{
            resolve(_supportSystem);
        }
    });
}

function generate(arr){
    return new Promise(function(resolve, reject){
        let url = `${HOST}/api/` + encodeURIComponent(arr.join(','));
        request
         .get(url)
         .on('error', function(err){
             console.error(err);
             reject(err);
         })
         .on('end', function(){
             console.info('🎉  ' + '>>> '.green + '.gitignore has been generated under current folder successfully!'.grey);
             resolve('success');
         })
         .pipe(fs.createWriteStream('.gitignore'));
    });
}

module.exports = {
    generate: generate,
    searcher: searcher,
    getSupportSystem: _getSupportSystem
};
