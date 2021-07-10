'use strict';

const envInfo = require('envinfo')

function info() {
    console.log('环境信息:')
    envInfo.run({
        System: ['OS', 'CPU', 'Memory', 'Shell'],
        Binaries: ['Node', 'Yarn', 'npm'],
        Browsers: ['Chrome', 'Firefox', 'Safari'],
        Utilities: ['Git'],
        Servers: ['Apache', 'Nginx']
    }).then(env => {
        console.log(env)
    })
}

module.exports = info
