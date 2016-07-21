'use strict';
/**
 * <plusmancn@gmail.com> created at 2016.07.20 14:15:10
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */

const os = require('os');
const fs = require('fs');
const YAML = require('yamljs');

let config;

function main(){
    let configString = '';
    try{
        configString = fs.readFileSync(os.homedir()+ '/.npm_assistor.yml', 'utf8');
    }catch(e){
        configString = fs.readFileSync(__dirname + '/npm_assistor.yml', 'utf8');
    }

    config = YAML.parse(configString);
    return config;
}

main();

module.exports = config;
