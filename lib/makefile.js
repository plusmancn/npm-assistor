'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.21 13:08:49
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
const fs = require('fs');
const request = require('request');
const GithubFetch = require('./base/github_fetch.js');
const config = require('../config.js');

// 文件写入
function write(url){
    return new Promise(function(resolve, reject){
        request
         .get(url)
         .on('error', function(err){
             console.error('npm-begin error: ', err);
             reject(err);
         })
         .on('end', function(){
             console.info('🎉  ' + '>>> '.green + 'Makefile has been generated under current folder successfully!'.grey);
             resolve('success');
         })
         .pipe(fs.createWriteStream('.Makefile'));
    });
}

function list(){
    let githubFetch = new GithubFetch(config.templates.github);
    return githubFetch.list('template-makefile');
}

module.exports = {
    write: write,
    list: list
};
