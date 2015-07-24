'use strict';

module.exports = function (config) {
    return {
        type: 'input',
        name: 'vm-pwd',
        message: 'VM Password',
        default: config || 'qwert6'
    }
};
