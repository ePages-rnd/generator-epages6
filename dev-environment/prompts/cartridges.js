'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

module.exports = function (config) {
    var workingPath = process.cwd(),
        directories = [],
        input = {
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
