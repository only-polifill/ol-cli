'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null
    }
    registry = registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registry, npmName)
    // console.log(npmInfoUrl)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        }
        return null
    }).catch(error => {
        console.log(error)
    })
}

function getDefaultRegistry(original = false) {
    return original ? 'https://registry.npmjs.org/' : 'https://registry.npm.taobao.org'
}

async function getNpmVersion(npmName, registry) {
    let data = await getNpmInfo(npmName, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

//获取最新的版本号
async function getNewestVersion(currentVersion, npmName, registry) {
    let versions = await getNpmVersion(npmName, registry)
    const validVersions = versions.filter(version => {
        if (semver.lt(currentVersion, version)) {
            return version
        }
    })
    if (validVersions && validVersions.length > 0) {
        return validVersions[0]
    }
    return null
}

module.exports = {
    getNewestVersion
}