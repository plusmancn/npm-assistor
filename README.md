# npm-assistor
> npm 包初始化和 git tag 辅助工具。源于搜车前端内部规范化改造，具体指内部功能模块 SDK 化和 GitFlow 流程规范化。

## Usage
全局安装
```shell
npm install -g npm-assistor
```
在项目根目录（package.json 所在文件夹）执行 
```shell
npm-assistor
```
弹出如下选择界面  
```shell
? 选择要执行的命令 (Use arrow keys)
  ❯ init (用于 npm 包初始化，请在 npm init 后执行) 
    tag (用于发布前 master 分支的 tag 标记)
```
选择 init 后的交互（Gif）：  

选择 tag 后的交互（Gif）：


## Config（Important!!）
**config 读取规则**  
优先读取用户目录下的 `~/.npm_assistor.yml` 文件，如果不存在，则使用项目默认配置。  
默认配置如下：  
```yaml
################### npm-assistor Configuration Example #########################

################## 公共模版库配置 #########################
templates:
    # github 远端配置库，会调用 api.github.com 相关 Api 进行内容获取
    # 支持多仓库
    github:
        # 可以 fork 示例模板，添加自己的配置
        - https://github.com/plusmancn/npm-assistor-template.git
        # - https://github.com/yourname/yourself-tempalte.git
    # Todo 最好支持下 gitlab，实现内网服务
    # gitlab:
        # - 
################## gitignore 服务器地址 #########################
#  项目地址: https://github.com/joeblau/gitignore.io
#  土豪大大们，可以选择在国内部署一份，屌丝只用得起国外便宜货
gitignore_server: http://gitignore.plusman.cn:8000
```

## Init 说明
**eslintrc**  
具体 IDE 集成参考：[eslint.org](http://eslint.org/)

**LICENSE（未做集成）**  
(licenses list by name)[https://opensource.org/licenses/alphabetical]  
并未做成命令行，具体可以参考，源码 `licenses-files` 文件夹，内含思维导图 xmind 格式  

