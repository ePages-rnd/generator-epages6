/*eslint-env node*/
'use strict';

var path = require('path'),
    config = require('../config'),
    ssh = require('./ssh'),
    gutil = require('gulp-util'),
    slash = require('slash');

var parser = function (data, success, error) {
        if (data.indexOf(success) > -1) {
            gutil.log(gutil.colors.green(data.replace(/^\s+|\s+$/g, '')));
            return;
        }

        if (data.indexOf(error) > -1) {
            process.stdout.write('\x07');
            gutil.log(gutil.colors.red(data.replace(/^\s+|\s+$/g, '')));
            return;
        }
    },

    lint = function (file) {
        var remoteFile = slash(file),

            perlCritic = ssh.exec('ep6-perlcritic ' + remoteFile, undefined,
                function (data) {
                    parser(data, undefined, 'Failed test');
                });

        gutil.log(gutil.colors.yellow('Linting ' + path.basename(file)));

        ssh.exec(config['perl-exec'] + ' -cw ' + remoteFile, undefined,
            function (data) {
                parser(data, 'syntax OK', 'syntax error');
            }, perlCritic)();
    },

    tle = function (remoteFile) {
        remoteFile = slash(remoteFile);

        gutil.log(gutil.colors.yellow('Linting ' + path.basename(remoteFile)));

        ssh.exec('ep6-tlec -file ' + remoteFile, function (data) {
            parser(data, 'syntax ok', 'syntax error');
        })();
    },

    reinstall = function (done) {
        gutil.log(gutil.colors.yellow('Starting reinstall, this will take a while ... time to grab a coffee'));

        ssh.spawn('"cd ' + config['cartridges-remote'] + '/DE_EPAGES; ' + config['perl-exec'] + ' Makefile.PL; make reinstall"', function (data) {
            gutil.log(data.toString().replace(/^\s+|\s+$/g, ''));
        }, function (data) {
            gutil.log(gutil.colors.red(data.toString().replace(/^\s+|\s+$/g, '')));
        }, done)();
    },

    build = function (done) {
        ssh.spawn('"cd ' + config['cartridges-remote'] + '/DE_EPAGES; ' + config['perl-exec'] + ' Makefile.PL; make build_ui"', function (data) {
            gutil.log(data.toString().replace(/^\s+|\s+$/g, ''));
        }, function (data) {
            gutil.log(gutil.colors.red(data.toString().replace(/^\s+|\s+$/g, '')));
        }, done)();
    };

module.exports = {
    lint: lint,
    reinstall: reinstall,
    build: build,
    tle: tle
};
