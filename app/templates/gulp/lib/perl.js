/*eslint-env node*/
'use strict';

var config = require('../config'),
    GulpSSH = require('gulp-ssh'),
    gutil = require('gulp-util');

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

var lint = function (remoteFile) {
    return ssh
        .shell(config['perl-exec'] + ' -cw ' + remoteFile)
        .on('ssh2Data', function (stream) {
            stream = stream.toString();

            if (stream.indexOf('syntax error') > -1) {
                return gutil.log(gutil.colors.red(stream));
            }

            if (stream.indexOf('syntax OK') > -1) {
                return gutil.log(gutil.colors.green(stream));
            }
        });
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
    build: build
};
