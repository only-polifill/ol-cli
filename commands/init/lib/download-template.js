'use strict';

const path = require('path')
const downloadGit = require('download-git-repo')
const ora = require('ora')

//下载模版
function downloadTemplate(projectInfo) {
    const downloadPath = path.join(process.cwd(), `/${projectInfo.projectName}`)
    const template = `github:only-polifill/template#${projectInfo.template}`
    const spinner = ora('模版下载中...').start();
    downloadGit(template, downloadPath, {clone: true}, function (err) {
        spinner.stop()
        console.log(err ? `err:${err}`: '下载完成')
    })
}

module.exports = downloadTemplate