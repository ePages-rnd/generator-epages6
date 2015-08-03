/*eslint-env node*/
'use strict';

module.exports = function (config) {
    var input = {
        type: 'input',
        name: 'vm-domain',
        message: 'Public VM Address'
    };

    if (config !== undefined) {
        input.default = config;
    }

    return input;
};
