'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.21 09:37:01
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
const should = require('should');
const rewire = require('rewire');
const eslintrc = rewire('../lib/eslintrc.js');
const GithubFetch = require('../lib/base/github_fetch.js');

describe('npm-assistor#init', function(){
    describe('#eslintrc', function(){

        describe('#parseGithubUrl', function(){
            let parseGithubUrl = GithubFetch.prototype.parseGithubUrl;
            describe('#input https://github.com/plusmancn/npm-assistor-template.git', function(){
                it('should return { owner: \'plusmancn\', repo: \'npm-assistor-template\' }', function(){
                    let actual = parseGithubUrl('https://github.com/plusmancn/npm-assistor-template.git');
                    let expected = {
                        owner: 'plusmancn', 
                        repo: 'npm-assistor-template' 
                    };
                    should.deepEqual(actual, expected);
                });
            });
        });

        describe('#list', function(){
            this.timeout(15e3);
            describe('#读取配置文件，npm_assistor.yml', function(){
                it('should 结果集长度大于1', function(done){
                    eslintrc.list()
                        .then(function(result){
                            (result.length).should.be.above(1);
                            done();
                        });
                });
            });
        });
    });
});
