'use strict';

const path = require('path')
const downloadGit = require('download-git-repo')

//下载模版
function downloadTemplate(projectInfo) {
    const downloadPath = path.join(process.cwd(), `/${projectInfo.projectName}`)
    const template = `github:only-polifill/template#${projectInfo.template}`
    downloadGit(template, downloadPath, {clone: true}, function (err) {
        console.log(err ? `err:${err}`: 'success')
    })
}

module.exports = downloadTemplate