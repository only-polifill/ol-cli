'use strict';

const fs = require('fs')
const inquirer = require('inquirer')
const semver = require('semver')

async function init () {
    const projectInfo = {}
    await getProjectInfo(projectInfo)
    createFolder(projectInfo)
}

async function getProjectInfo (projectInfo) {
    Object.assign(projectInfo, await getProjectName())
    Object.assign(projectInfo, await getProjectVersion())
    console.log(projectInfo)
}

async function getProjectName () {
    return await inquirer.prompt({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称',
        default: '',
        validate: function (v) {
            const done = this.async()
            setTimeout(() => {
                if (!/^[a-zA-Z]+[-][a-zA-Z0-9]*|[_][a-zA-Z0-9]*$/.test(v)) {
                    done('请输入正确的项目名称')
                    return
                }
                done(null, true)
            }, 0)
        },
        filter: function (v) {
            return v
        }
    })
}

async function getProjectVersion () {
    return await inquirer.prompt({
        type: 'input',
        name: 'projectVersion',
        message: '请输入项目版本号',
        default: '1.0.0',
        validate: function (v) {
            const done = this.async()
            setTimeout(() => {
                if (!(!!semver.valid(v))) {
                    done('请输入正确的版本号 如：1.0.0 v1.0.0')
                    return
                }
                done(null, true)
            }, 0)
        },
        filter: function (v) {
            if (!!semver.valid(v)) {
                return semver.valid(v);
            } else {
                return v;
            }
        }
    })
}

//创建项目文件夹
function createFolder(projectInfo) {
    fs.mkdirSync(`./${projectInfo.projectName}`)
}

module.exports = init