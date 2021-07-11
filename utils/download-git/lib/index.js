'use strict';

const fs = require('fs')
const path = require('path')
const downloadGit = require('download-git-repo')
const ora = require('ora')
const prompt = require('./templatePrompt')

function download(projectInfo) {
    projectInfo.type === 'template' ? downloadTemplate(projectInfo) : cloneCode(projectInfo)
}

//clone代码
function cloneCode(projectInfo) {
    let branch = projectInfo.branch ? `#${projectInfo.branch}` : ''
    const downloadPath = path.join(process.cwd(), `/${projectInfo.projectName}`)
    if (!existPath(downloadPath, projectInfo.projectName)) return
    const template = `github:${projectInfo.author}/${projectInfo.projectName}${branch}`
    console.log(template)
    const spinner = ora('代码下载中...').start();
    downloadGit(template, downloadPath, {clone: true}, function (err) {
        spinner.stop()
        console.log(err ? `err:${err}`: '代码下载完成')
    })
}

//下载模版
function downloadTemplate(projectInfo) {
    const downloadPath = path.join(process.cwd(), `/${projectInfo.projectName}`)
    if (!existPath(downloadPath, projectInfo.projectName)) return

    const template = `github:only-polifill/template#${projectInfo.template}`
    const spinner = ora('模版下载中...').start();
    downloadGit(template, downloadPath, {clone: true}, function (err) {
        spinner.stop()
        console.log(err ? `err:${err}`: '模版下载完成')
        if (!err) prompt(projectInfo.template, projectInfo.projectName)
    })
}

//路径判断
function existPath(path, projectName) {
    if (fs.existsSync(path)){
        console.log(`${process.cwd()}/路径下${projectName}文件夹已存在`)
    } else {
        return true
    }
}

module.exports = download