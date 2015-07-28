/*eslint-env node*/
'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    GulpSSH = require('gulp-ssh'),
    path = require('path'),
    config = require('../config');

var buildPath = [config.webroot, 'StoreTypes', config.version, config.store].join('/');

var sshConfig = {
        host: config['vm-domain'],
        port: 22,
        username: config['vm-usr'],
        password: config['vm-pwd']
    },

    ssh = new GulpSSH({
        ignoreErrors: true,
        sshConfig: sshConfig
    });

module.exports = function (pattern, cb) {
    if (typeof pattern === 'string') {
        pattern = pattern.split('my-fake-split');
    }

    pattern = _.map(pattern, function (element) {
        return config['cartridges-local'] + element;
    });

    return gulp.watch(pattern, function (file) {
        var relativeFilePath,
            dist;

        file.path.replace(path.sep, '/');
        relativeFilePath = file.path.replace(/^.*?\/Data\/Public/, '');

        dist = buildPath + path.dirname(relativeFilePath);

        cb(file.path, dist, ssh.dest(dist));
    });
};
