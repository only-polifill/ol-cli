'use strict';

module.exports = core;

const commander = require('commander')
const path = require('path')
const pathExists = require('path-exists').sync
const userHome = require('user-home')
const semver = require('semver')
const colors = require('colors')
const Pkg = require('../package.json')
const log = require("@ol-cli/log")
const constant = require('./constant')
const clear = require('@ol-cli/clear')
const init = require('@ol-cli/init')
const clone = require('@ol-cli/clone')
const info = require('@ol-cli/info')

let argv;

async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        // checkInputArgv()
        log.verbose('debug', 'debug log')
        await checkUpdate()
        registerCommand()
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
    //获取最低版本
    const lowestVersion = constant.LOWEST_NODE_VERSION
    //进行版本比对
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`ol-cli需要安装${lowestVersion}版本以上的 node.js`))
    }
}

function checkRoot() {
    const rootCheck = require('root-check')
    //降级root操作权限
    rootCheck()
    // console.log(process.getuid())
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

//注册命令
function registerCommand() {
    const program = new commander.Command()

    program
        .usage('<command> [option]')
        .version(Pkg.version)
        .name(Object.keys(Pkg.bin)[0])
        .option('-d, --debug', '是否开启debug模式', false)

    program
        .command('init')
        // .option('-f --force', '是否强制初始化项目')
        .action(init)

    program
        .command('clone <cloneAddress> [branch]')
        .action(clone)

    program
        .command('clear')
        .action(clear)

    program
        .command('info')
        .action(info)

    //调试模式
    program.on('option:debug', function (e) {
        process.env.LOG_LEVEL = 'verbose'
        log.level = process.env.LOG_LEVEL
        log.verbose("debug开启")
    })

    //未知命令监听
    program.on('command:*', function (obj) {
        const availableCommand = program.commands.map(cmd => cmd.name())
        console.log(colors.red(`未知的命令:${obj}`))
        if (availableCommand.length > 0) console.log(`可用命令: ${availableCommand.join(',')}`)
    })

    //命令提示
    if (process.argv.length < 3) {
        program.outputHelp()
        console.log(' ')
    }

    program.parse(process.argv)
}