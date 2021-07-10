'use strict';

const path = require('path')
const downloadGit = require('download-git-repo')
const ora = require('ora')

function download(projectInfo) {
    projectInfo.type === 'template' ? downloadTemplate(projectInfo) : cloneCode(projectInfo)
}

//clone代码
function cloneCode(projectInfo) {
    console.log(projectInfo)
    let branch = projectInfo.branch ? `#${projectInfo.branch}` : ''
    const downloadPath = path.join(process.cwd(), `/${projectInfo.projectName}`)
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
    const template = `github:only-polifill/template#${projectInfo.template}`
    const spinner = ora('模版下载中...').start();
    downloadGit(template, downloadPath, {clone: true}, function (err) {
        spinner.stop()
        console.log(err ? `err:${err}`: '模版下载完成')
    })
}

module.exports = download