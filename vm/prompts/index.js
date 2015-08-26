/*eslint-env node*/
'use strict';

var fs = require('fs-extra'),
    path = require('path');

var modules = {};

fs.readdirSync(__dirname).forEach(function (file) {
    if (fs.lstatSync(path.resolve(__dirname, file)).isDirectory()) {
        return;
    }

    if (path.extname(file) !== '.js') {
        return;
    }

    if (file === 'index.js') {
        return;
    }

    modules[path.basename(file, '.js')] = require('./' + file);
});

module.exports = modules;
