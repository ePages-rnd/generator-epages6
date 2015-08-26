/*eslint-env node*/
'use strict';

module.exports = function (config) {
    return {
        type: 'password',
        name: 'vm-pwd',
        message: 'VM Password',
        default: config || 'qwert6'
    };
};
