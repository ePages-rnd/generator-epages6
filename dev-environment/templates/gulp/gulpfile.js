/*eslint-env node*/
'use strict';

// Gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    ping = require('ping'),

    watcher = require('./lib/file-watch'),
    perl = require('./lib/perl'),
    config = require('./config');

/**
 * File watch and trigger build of:
 * 		* JavaScript
 * 		* CSS/LESS
 * 		* Perl
 * 		* HTML
 */
gulp.task('watch', config['watch-tasks']);

/**
 * CSS/LESS
 */
gulp.task('styles', ['is-online'], function () {
    return watcher(['/**/Data/Public/**/*.css', '/**/Data/Public/**/*.less'], function (file, copyToShared) {
        copyToShared();
    }, function (file, removeFromShared) {
        removeFromShared();
    }, function (file, addToShared) {
        addToShared();
    });
});

/**
 * Javascript
 */
gulp.task('scripts', ['is-online'], function () {
    return watcher('/**/Data/Public/**/*.js', function (file, copyToShared) {
        copyToShared();
    }, function (file, removeFromShared) {
        removeFromShared();
    }, function (file, addToShared) {
        addToShared();
    });
});

/**
 * Perl
 */
gulp.task('perl', ['is-online'], function () {
    return watcher(['/**/*.pm', '/**/*.pl', '/**/*.t'], function (source) {
        return perl.lint(source.replace(config['cartridges-local'], config['cartridges-remote']));
    });
});

/**
 * Html
 */
gulp.task('html', ['is-online'], function () {
    return watcher('/**/*.html', function (source) {
        return perl.tle(source.replace(config['cartridges-local'], config['cartridges-remote']));
    });
});

/**
 * epages 6 controls
 */
gulp.task('is-online', function (done) {
    ping.sys.probe(config['vm-domain'], function (isAlive) {
        if (isAlive) {
            gutil.log(gutil.colors.green('VM ' + config['vm-domain'] + ' is online'));
            return done();
        }
        gutil.log(gutil.colors.red('VM ' + config['vm-domain'] + ' seems to be offline'));
    });
});

gulp.task('reinstall', ['is-online'], function (done) {
    perl.reinstall(function () {
        done();
        process.exit(0);
    });
});

gulp.task('build', ['is-online'], function (done) {
    perl.build(function () {
        done();
        process.exit(0);
    });
});

/**
 * Default task including:
 * 		* build
 * 		* watch
 */
gulp.task('default', ['watch']);
