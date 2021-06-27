'use strict';

const inquirer = require('inquirer')

async function init () {
    return await getProjectInfo()
}

async function getProjectInfo () {
    const projectInfo = {}
    Object.assign(projectInfo, await getProjectName())
    Object.assign(projectInfo, await getProjectVersion())
    console.log(projectInfo)
    return projectInfo
}

async function getProjectName () {
    return await inquirer.prompt({
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称'
    })
}

async function getProjectVersion () {
    return await inquirer.prompt({
        type: 'input',
        name: 'projectVersion',
        message: '请输入项目版本号'
    })
}

module.exports = init