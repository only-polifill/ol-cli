'use strict';

const downloadGit = require('@ol-cli/download-git')

function clone(address, branch=null) {
    const params = address.split("/")
    const projectInfo = {}
    if (address.startsWith('https://github.com') && address.endsWith('.git')) {
        projectInfo.projectName = params[params.length - 1].replace('.git', '')
        projectInfo.author = params[params.length - 2]
        projectInfo.branch = branch
        projectInfo.type = 'clone'
    } else {
        console.log('git地址格式错误')
        return
    }

    downloadGit(projectInfo)

}

module.exports = clone
