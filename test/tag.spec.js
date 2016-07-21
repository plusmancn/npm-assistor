'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.05 22:10:39
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 *
 * 测试用例
 */

const moment = require('moment');
// 更新 week 设置
moment.locale('zh-cn', {
    // 每年第一周的定义：
    // 国内：包含1月4号的那周为每年第一周
    // 美国：包含1月1号的那周为每年第一周（苹果日历也是如此）
    // 更新了下 moment，现在规则是 包含1月1号的那周为每年第一周，新的一周起始于周一（比较好理解，苹果日历也可设置）
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 7  // The week that contains Jan 1th is the first week of the year.
    }
});
const should = require('should');
const libAdd = require('../lib/command/add.js');

let thisYear = moment().format('YY');
let thisWeek = moment().weeks();

describe('npm-assistor#tag', function(){
    describe('#add', function(){
        describe('#版本递增', function(){
            describe('#递增主版本号，输入1.1.1', function(){
                it('should return 2.0.0', function(){
                    let tag = libAdd.generateTag({
                        version: '1.1.1',
                        part: 'major'
                    });
                    should.equal(tag, '2.0.0', '主版本号递增错误');
                });
            });

            describe('#递增特性号，输入1.1.1', function(){
                it('should return 1.2.0', function(){
                    let tag = libAdd.generateTag({
                        version: '1.1.1',
                        part: 'feature'
                    });
                    should.equal(tag, '1.2.0', '特性号递增错误');
                });
            });

            describe('#递增修订号，输入1.1.1', function(){
                it('should return 1.1.2', function(){
                    let tag = libAdd.generateTag({
                        version: '1.1.1',
                        part: 'patch'
                    });
                    should.equal(tag, '1.1.2', '修订号递增错误');
                });
            });
        });

        describe('#时间 tag 递增，版本号部分递增 major', function(){

            describe('#前一个 tag 在当前周前发布，输入1.1.1+16w0b', function(){
                let equal = `2.0.0+${thisYear}w${thisWeek}a`;
                it(`should return ${equal}`, function(){
                    let tag = libAdd.generateTag({
                        version: '1.1.1+16w0b',
                        part: 'major'
                    });
                    should.equal(tag, equal, '时间 tag 递增错误');
                });
            });

            let input1 = `1.1.1+${thisYear}w${thisWeek}a`;
            describe(`#前一个 tag 在当前周发布，输入${input1}`, function(){
                let equal = `2.0.0+${thisYear}w${thisWeek}b`;
                it(`should return ${equal}`, function(){
                    let tag = libAdd.generateTag({
                        version: input1,
                        part: 'major'
                    });
                    should.equal(tag, equal, '时间 tag 递增错误');
                });
            });

            let input2 = `1.1.1+${thisYear}w${thisWeek}z`;
            describe(`#前一个 tag 在当前周发布，输入${input2}`, function(){
                it('should throw Error 已超过单周发布次数上限[a-z]', function(){
                    (function(){
                        libAdd.generateTag({
                            version: input2,
                            part: 'major'
                        });
                    }).should.throw('已超过发布次数上限[a-z]');
                });
            });

        });
    });

    describe('#versionValidate', function(){
        describe('#输入1.1.1, 1.2.1', function(){
            it('should return 递增位右侧位需要清零', function(){
                let res = libAdd.versionValidate('1.1.1', '1.2.1');
                should.deepEqual(res, {
                    pass: false,
                    message: '递增位右侧位需要清零'
                });
            });
        });

        describe('#输入2.1.1, 1.2.1', function(){
            it('should return 新版本号不能低于老版本号', function(){
                let res = libAdd.versionValidate('2.1.1', '1.2.1');
                should.deepEqual(res, {
                    pass: false,
                    message: '新版本号不能低于老版本号'
                });
            });
        });

        describe('#输入1.2.1, 1.2.1', function(){
            it('should return 新老版本号不能相同', function(){
                let res = libAdd.versionValidate('1.2.1', '1.2.1');
                should.deepEqual(res, {
                    pass: false,
                    message: '新老版本号不能相同'
                });
            });
        });

        describe('#输入1.2.1, 1.3.0', function(){
            it('should return success', function(){
                let res = libAdd.versionValidate('1.2.1', '1.3.0');
                should.deepEqual(res, {
                    pass: true,
                    message: 'success'
                });
            });
        });
    });
});
