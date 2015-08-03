/*eslint-env node*/
'use strict';

var config = require('../config'),
    GulpSSH = require('gulp-ssh'),
    gutil = require('gulp-util'),
    slash = require('slash');

var sshConfig = {
        host: config['vm-domain'],
        port: 22,
        username: config['vm-usr'],
        password: config['vm-pwd']
    };

var ssh = new GulpSSH({
        ignoreErrors: true,
        sshConfig: sshConfig
    });

var streamWrapper = function (command, onSuccess, onError) {
        var output = '',
            dumper = function (stream) {
                output += stream.toString();
            };

        return ssh.exec(command)
            .on('ssh2Data', dumper)
            .on('error', dumper)
            .on('exit', function () {
                if (onSuccess !== undefined && onSuccess(output)) {
                    gutil.log(gutil.colors.green(output.replace(/^\s+|\s+$/g, '')));
                    output = '';
                    return;
                }

                if (onError !== undefined && onError(output)) {
                    process.stdout.write('\x07');
                    gutil.log(gutil.colors.red(output.replace(/^\s+|\s+$/g, '')));
                    output = '';
                    return;
                }
            });
    },

    lint = function (remoteFile) {
        remoteFile = slash(remoteFile);

        gutil.log(gutil.colors.blue('Linting: ' + remoteFile));

        return streamWrapper([
                config['perl-exec'] + ' -cw ' + remoteFile, 'ep6-perlcritic ' + remoteFile
            ],
            function (stream) {
                return stream.indexOf('syntax OK') > -1;
            },
            function (stream) {
                return stream.indexOf('syntax error') > -1 || stream.indexOf('Failed test') > -1;
            }
        );
    },

    tle = function (remoteFile) {
        remoteFile = slash(remoteFile);

        gutil.log(gutil.colors.blue('Analysing TLE: ' + remoteFile));

        return streamWrapper([
                'ep6-tlec -file ' + remoteFile
            ],
            function (stream) {
                return stream.indexOf('syntax ok') > -1;
            },
            function (stream) {
                return stream.indexOf('syntax error') > -1;
            }
        );
    },

    reinstall = function () {
        gutil.log(gutil.colors.yellow('Starting reinstall, this will take a while ... time to grab a coffee'));
        return ssh.exec([config['perl-exec'] + ' Makefile.PL', 'make reinstall'], {filePath: config['cartridges-remote']})
            .on('ssh2Data', function (stream) {
                gutil.log(stream.toString());
            })
            .on('error', function (stream) {
                gutil.log(gutil.colors.red(stream.toString()));
            });
    },

    build = function () {
        return ssh.exec('make build_ui', {
                filePath: config['cartridges-base']
            })
            .on('ssh2Data', function (stream) {
                gutil.log(stream.toString());
            })
            .on('error', function (stream) {
                gutil.log(gutil.colors.red(stream.toString()));
            });
    };

module.exports = {
    lint: lint,
    reinstall: reinstall,
    build: build,
    tle: tle
};
