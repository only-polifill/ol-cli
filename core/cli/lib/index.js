'use strict';

module.exports = core;

const pathExists = require('path-exists').sync
const userHome = require('user-home')
const semver = require('semver')
const colors = require('colors')
const Pkg = require('../package.json')
const log = require("@ol-cli/log")
const constant = require('./constant')

let argv;

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgv()
        log.verbose('debug', 'debug log')
    }catch (e) {
        console.log(e.message)
    }
}

function checkPkgVersion() {
    log.notice('cli', Pkg.version)
}

function checkNodeVersion() {
    //获取当前版本
    const currentVersion = process.version
    console.log(currentVersion)
    //获取最低版本
    const lowestVersion = constant.LOWEST_NODE_VERSION
    console.log(lowestVersion)
    //进行版本比对
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`ol-cli需要安装${lowestVersion}版本以上的 node.js`))
    }
}

function checkRoot() {
    //使用1.0.0版本root-check 2.0.0版本需要适配import
    const rootCheck = require('root-check')
    rootCheck()
    console.log(process.getuid())
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('用户主目录不存在'))
    }
}

function checkInputArgv() {
    argv = require('minimist')(process.argv.slice(2))
    console.log(argv)
    checkArgv()
}

function checkArgv() {
    if (argv.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}