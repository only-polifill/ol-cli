'use strict';

function prompt(template, tempName) {
    console.log(`cd ${tempName}`)
    console.log('npm install')
    switch (template) {
        case 'vue':
            console.log('npm run serve')
            break;
        case 'vue-admin':
            console.log('npm run dev')
            break;
        case 'react':
            console.log('npm run start')
            break;
        default:
            break;
    }
}

module.exports = prompt