/*eslint-env node*/
'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),
    path = require('path'),
    config = require('../config'),
    ssh = require('./ssh'),
    figures = require('figures'),
    Spinner = require('cli-spinner').Spinner;

var buildPath = [config.webroot, 'StoreTypes', config.version, config.store].join('/');


module.exports = function (pattern, onChange, onDelete, onAdd) {
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
            var relativeFilePath = file.path.replace(/^.*?\/Data\/Public/, ''),
                destinationFilePath = buildPath + relativeFilePath;

            file.path.replace(path.sep, '/');

            if (file.event === 'unlink' && onDelete !== undefined) {
                onDelete(file.path, ssh.remove(destinationFilePath));
            }

            if (file.event === 'change' && onChange !== undefined) {
                onChange(file.path, ssh.copy(file.path, destinationFilePath));
            }

            if (file.event === 'add' && onAdd !== undefined) {
                onAdd(file.path, ssh.copy(file.path, destinationFilePath, ssh.chown(destinationFilePath)));
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
