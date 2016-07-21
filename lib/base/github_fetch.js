'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.21 14:23:18
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 *
 * Github Api 资源获取类
 */

const request = require('request');
const inquirer = require('inquirer');
const co = require('co');

function GithubFetch(repos){
    this.repos = repos;
}

// 获取可用选项
GithubFetch.prototype.getAvailableOptions = function getAvailableOptions(user, repo, part){
    return new Promise(function(resolve, reject){
        let url = `https://api.github.com/repos/${user}/${repo}/contents/${part}`;
        request({
            url: url,
            headers: {
                'User-Agent':'Npm-assistor/0.1.0 (contact to plusmancn@gmail.com)'
            },
            json: true
        }, function(err, resp, body){
            if(err){
                return reject(err);
            }
            resolve(body);
        });
    });
};

// repo 解析
GithubFetch.prototype.parseGithubUrl = function parseGithubUrl(url){
    let matchRes = url.match(/http[s]?:\/\/github.com\/([\w\-]+)\/([\w\-]+)/);
    return {
        owner: matchRes[1],
        repo: matchRes[2]
    };
};

// 获取配置列表
GithubFetch.prototype.list = function list(part){
    let self = this;

    return co(function *(){
        let choices = [];
        for(let i = 0, l = self.repos.length; i < l; i++){
            let repoInfo = self.parseGithubUrl(self.repos[i]);
            let body = yield self.getAvailableOptions(repoInfo.owner, repoInfo.repo, part);
            choices.push(new inquirer.Separator(`------ ${repoInfo.owner}/${repoInfo.repo} ------`));
            body.forEach(function(item){
                choices.push({
                    name: item.name,
                    value: item.download_url
                });
            });
        }

        return choices;
    });
};

module.exports = GithubFetch;
