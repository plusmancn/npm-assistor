#!/usr/bin/env node
'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.20 13:34:55
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */

const co = require('co');
const inquirer = require('inquirer');

const commandInit = require('./command_init.js');
const commandTag = require('./command_tag.js');

function main(){
    let schema = [{
        type: 'list',
        name: 'command',
        message: '选择要执行的命令',
        choices: [
            {
                name: 'init (用于 npm 包初始化，请在 npm init 后执行)',
                value: 'init',
                short: 'init'
            },
            {
                name: 'tag (用于发布前 master 分支的 tag 标记)',
                value: 'tag',
                short: 'tag'
            }
        ]
    }];

    co(function *(){
        let result = yield inquirer.prompt(schema);

        switch (result.command) {
        case 'init':
            commandInit();
            break;
        case 'tag':
            commandTag();
            break;
        }
    });
}

main();
