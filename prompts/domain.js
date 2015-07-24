'use strict';

module.exports = function (config) {
    return {
        type: 'input',
        name: 'vm-domain',
        message: 'Public VM Address',
        default: config || ''
    }
};
