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

var parseStream = function (onSuccess, onError) {
        return function (stream) {
            stream = stream.toString();

            if (onSuccess !== undefined && onSuccess(stream)) {
                return gutil.log(gutil.colors.green(stream));
            }

            if (onError !== undefined && onError(stream)) {
                process.stdout.write('\x07');
                return gutil.log(gutil.colors.red(stream));
            }
        };
    },

    lint = function (remoteFile) {
        var outputEval = parseStream(function (stream) {
            return stream.indexOf('syntax OK') > -1;
        }, function (stream) {
            return stream.indexOf('syntax error') > -1 || stream.indexOf('Failed test') > -1;
        });

        remoteFile = slash(remoteFile);

        gutil.log(gutil.colors.blue('Linting: ' + remoteFile));

        return ssh
            .exec([config['perl-exec'] + ' -cw ' + remoteFile, 'ep6-perlcritic ' + remoteFile])
            .on('ssh2Data', outputEval)
            .on('error', outputEval);
    },

    tle = function (remoteFile) {
        var outputEval = parseStream(function (stream) {
            return stream.indexOf('syntax ok') > -1;
        }, function (stream) {
            return stream.indexOf('syntax error') > -1;
        });

        remoteFile = slash(remoteFile);

        gutil.log(gutil.colors.blue('Analysing TLE: ' + remoteFile));

        return ssh
            .exec('ep6-tlec -file ' + remoteFile)
            .on('ssh2Data', outputEval)
            .on('error', outputEval);
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
