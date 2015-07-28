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
            message: 'Local Cartridges Folder'
        };

    if (config !== undefined) {
        input.default = path.basename(config);
    }

    _.forEach(fs.readdirSync(workingPath), function (folderName) {
        var folderPath = path.resolve(workingPath, folderName);

        if (folderName[0] === '.') return;

        if (fs.lstatSync(folderPath).isDirectory() === false) return;

        directories.push(folderName);
    });

    if (directories.length > 0) {
        input.type = 'list';
        input.choices = directories;
        input.filter = function (directory) {
            return workingPath + path.sep + directory;
        }
    }

    return input;
};
