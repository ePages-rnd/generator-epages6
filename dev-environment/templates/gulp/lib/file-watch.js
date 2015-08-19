/*eslint-env node*/
'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    GulpSSH = require('gulp-ssh'),
    watch = require('gulp-watch'),
    path = require('path'),
    config = require('../config'),
    figures = require('figures'),
    Spinner = require('cli-spinner').Spinner;

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
    var activitySpinner,
        spinnerTimeout,
        searchPatterns = '';

    if (typeof pattern === 'string') {
        pattern = pattern.split();
    }

    _.forEach(pattern, function (filePattern) {
        searchPatterns += ' ' + filePattern;
    });

    pattern = _.map(pattern, function (element) {
        return config['cartridges-local'] + element;
    });

    activitySpinner = new Spinner(gutil.colors.blue('           %s processing' + searchPatterns));
    activitySpinner.setSpinnerString(figures.bullet + ' ');
    activitySpinner.setSpinnerDelay(10);
    activitySpinner.start();

    return gulp.src(pattern).pipe(
        watch(pattern, function (file) {
            var relativePath = file.path.replace(/^.*?\/Data\/Public/, ''),
                destinationFilePath = buildPath + relativePath,
                destinationDirectoryPath = buildPath + path.dirname(relativePath);

            file.path.replace(path.sep, '/');

            if (file.event === 'unlink' && onDelete !== undefined) {
                onDelete(file.path, ssh.shell('rm ' + destinationFilePath));
            }

            if (file.event === 'change' && onChange !== undefined) {
                onChange(file.path, ssh.dest(destinationDirectoryPath), ssh.exec(['chown eprunapp:apache ' + destinationFilePath]));
            }

            if (file.event === undefined) {
                clearTimeout(spinnerTimeout);
                spinnerTimeout = setTimeout(function () {
                    activitySpinner.stop(true);
                }, 10000);
            }
        })
    );
};
