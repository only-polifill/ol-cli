'use strict';

module.exports = core;

const path = require('path')
const pathExists = require('path-exists').sync
const userHome = require('user-home')
const semver = require('semver')
const colors = require('colors')
const Pkg = require('../package.json')
const log = require("@ol-cli/log")
const constant = require('./constant')

let argv;

async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkInputArgv()
        log.verbose('debug', 'debug log')
        checkEnv()
        await checkUpdate()
    }catch (e) {
        console.log(e.message)
    }
}

function checkPkgVersion() {
    log.notice('cli', Pkg.version)
}

//检查node版本
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

//检查环境变量
function checkEnv() {
    const dotEnv = require('dotenv')
    const dotEnvPath = path.resolve(userHome, '.env')
    console.log(dotEnvPath)
    if (pathExists(dotEnvPath)) {
        dotEnv.config({
            path: dotEnvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

//创建默认配置
function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

async function checkUpdate() {
    //获取当前版本号
    const currentVersion = Pkg.version
    //调用npm registry比对版本号获取最新版本
    const npmName = Pkg.name
    const { getNewestVersion } = require('@ol-cli/get-npm-info')
    const newestVersion = await getNewestVersion(currentVersion, npmName)
    if (newestVersion) {
        log.warn('更新提示',colors.yellow(`已有新版本请手动更新 当前版本${currentVersion} 最新版本${newestVersion}
更新命令：npm install -g ${npmName}`))
    }
}