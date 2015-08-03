/*eslint-env node*/
'use strict';

// Gulp plugins
var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    gutil = require('gulp-util'),
    livereload = require('gulp-livereload'),

    path = require('path'),

    ping = require('ping'),
    watcher = require('./lib/file-watch'),
    perl = require('./lib/perl'),

    config = require('./config');

livereload.listen();

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
    return watcher(['/**/Data/Public/**/*.css', '/**/Data/Public/**/*.less'], function (source, dist, copyToShared) {
        gulp.src(source)
            .pipe(copyToShared)
            .pipe(livereload());
    }, function (source, removeFromShared) {
        gulp.src(source)
            .pipe(removeFromShared);
    });
});

/**
 * Javascript
 */
gulp.task('scripts', ['is-online'], function () {
    return watcher('/**/Data/Public/**/*.js', function (source, dist, copyToShared) {
        gulp.src(source)
            // Linting
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(copyToShared)
            .pipe(livereload());
    }, function (source, removeFromShared) {
        gulp.src(source)
            .pipe(removeFromShared);
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
        return perl.tle(source.replace(config['cartridges-local'], config['cartridges-remote']))
            .pipe(livereload());
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

gulp.task('init', ['is-online'], perl.reinstall);

gulp.task('build', ['is-online'], perl.build);

/**
 * Default task including:
 * 		* build
 * 		* watch
 */
gulp.task('default', ['watch']);
