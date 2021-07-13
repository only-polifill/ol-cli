#!/usr/bin/env node

const importLocal = require('import-local')

if (importLocal(__filename)) {
    console.log('正在使用ol-cli本地版本')
} else {
    require('../lib')(process.argv)
}