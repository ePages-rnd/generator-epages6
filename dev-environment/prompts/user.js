/*eslint-env node*/
'use strict';

module.exports = function (config) {
    return {
        type: 'input',
        name: 'vm-usr',
        message: 'VM Username',
        default: config || 'root'
    };
};
