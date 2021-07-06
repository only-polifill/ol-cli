'use strict';

//清空控制台
function clearConsole () {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
}

module.exports = clearConsole