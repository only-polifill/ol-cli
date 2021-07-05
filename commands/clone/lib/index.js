'use strict';

function clone(address) {
    const params = address.split("/")
    const projectInfo = {}
    if (address.startsWith('https://github.com') && address.endsWith('.git')) {
        projectInfo.projectName = params[params.length - 1].replace('.git', '')
        projectInfo.author = params[params.length - 2]
    } else {
        console.log('git格式错误')
    }

    console.log(projectInfo)

}

module.exports = clone
