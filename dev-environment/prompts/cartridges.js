/*eslint-env node*/
'use strict';

var path = require('path');

module.exports = function (config) {
    var input = {
            type: 'input',
            name: 'cartridges-local',
            message: 'Local Cartridges Folder',
            filter: function (dir) {
                return path.resolve(dir);
            }
        };

    if (config !== undefined) {
        input.default = config;
    }

    return input;
};
