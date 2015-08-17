/*eslint-env node*/
'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    GulpSSH = require('gulp-ssh'),
    watch = require('gulp-watch'),
    path = require('path'),
    config = require('../config');

var buildPath = [config.webroot, 'StoreTypes', config.version, config.store].join('/'),

    sshConfig = {
        host: config['vm-domain'],
        port: 22,
        username: config['vm-usr'],
        password: config['vm-pwd']
    },

    ssh = new GulpSSH({
        ignoreErrors: true,
        sshConfig: sshConfig
    });

module.exports = function (pattern, onChange, onDelete) {
    if (typeof pattern === 'string') {
        pattern = pattern.split();
    }

    _.forEach(pattern, function (filePattern) {
        gutil.log(gutil.colors.blue('Watching: ' + filePattern));
    });

    pattern = _.map(pattern, function (element) {
        return config['cartridges-local'] + element;
    });

    return gulp.src(pattern).pipe(
        watch(pattern, function (file) {
            var dest;

            file.path.replace(path.sep, '/');

            if (file.event === 'unlink' && onDelete !== undefined) {
                dest = buildPath + file.path.replace(/^.*?\/Data\/Public/, '');
                onDelete(file.path, ssh.shell('rm ' + dest));
            }

            if (file.event === 'change' && onChange !== undefined) {
                dest = buildPath + path.dirname(file.path.replace(/^.*?\/Data\/Public/, ''));
                onChange(file.path, dest, function () {
                    return ssh.dest(dest)
                        .pipe(ssh.exec(['chown eprunapp:apache'));
                });
            }
        })
    );
};
