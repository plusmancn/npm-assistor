'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.14 19:23:03
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */

const co = require('co');
const colors = require('colors');
const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

// libs
const libGitignore = require('./lib/gitignore.js');
const libEslintrc  = require('./lib/eslintrc.js');
const libMakefile = require('./lib/makefile.js');

// Choose .gitignore
function gitignore(){
    let schema = [{
        type: 'autocomplete',
        name: 'gitignore',
        message: '.gitignore'.green + ' (多个配置用英文逗号分隔)',
        source: libGitignore.searcher
    }];

    co(function *(){
        let supportSystemList = yield libGitignore.getSupportSystem();
        let tips = '.gitignore Hosting '.blue + colors.green(supportSystemList.length) + ' Operating System, IDE, and Programming Language .gitignore templates'.blue;
        console.log(tips);

        let result = yield inquirer.prompt(schema);
        return libGitignore.generate(result.gitignore.split(' + '));
    })
    .then(function(){
        eslintrc();
    })
    .catch(function(err){
        console.error(err);
    });
}

// Choose .eslintrc
function eslintrc(){
    let schema = [{
        type: 'list',
        name: 'eslintrc',
        message: 'eslint 校验规则模板'
    }];

    co(function *(){
        schema[0].choices = yield libEslintrc.list();
        let result = yield inquirer.prompt(schema);
        return libEslintrc.write(result.eslintrc);
    }).then(function(){
        makefile();
    }).catch(function(err){
        console.error(err);
    });
}

// Choose makefile
function makefile(){
    let schema = [{
        type: 'list',
        name: 'makefile',
        message:  'Makefile 模板'
    }];

    co(function *(){
        schema[0].choices = yield libMakefile.list();
        let result = yield inquirer.prompt(schema);
        return libMakefile.write(result.makefile);
    }).then(function(){
        console.log('------------------------------------------'.white + '\n🙂 ' + ' >>> '.green + ' Well begun is half done!'.rainbow);
    }).catch(function(err){
        console.error(err);
    });
}

// main
module.exports = gitignore;
