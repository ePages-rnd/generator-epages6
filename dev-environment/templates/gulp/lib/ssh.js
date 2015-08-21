'use strict';

var path = require('path'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    gutil = require('gulp-util'),
    config = require('../config');

var machine = config['vm-usr'] + '@' + config['vm-domain'];

module.exports = {
    copy: function (src, dest, done) {
        var fileName = path.basename(src);

        return function () {
            gutil.log(gutil.colors.yellow('Starting to write ' + fileName + ' ...'));
            exec('scp ' + src + ' ' + machine + ':' + dest, function (error, stdout, stderr) {

                if (error !== null || stderr !== '') {
                    gutil.log(gutil.colors.red('Failed to write ' + fileName));
                    return;
                }

                gutil.log(gutil.colors.green('Finished writing ' + fileName));
                if (typeof done === 'function') {
                    done();
                }
            });
        };
    },

    remove: function (file, done) {
        var fileName = path.basename(file);

        return function () {
            gutil.log(gutil.colors.yellow('Starting to remove ' + fileName + ' ...'));

            exec('ssh ' + machine + ' "rm ' + file + '"', function (error, stdout, stderr) {

                if (error !== null || stderr !== '') {
                    gutil.log(gutil.colors.red('Failed to remove ' + fileName));
                    return;
                }

                gutil.log(gutil.colors.green('Finished removing ' + fileName));
                if (typeof done === 'function') {
                    done();
                }
            });
        };
    },

    chown: function (file, done) {
        var fileName = path.basename(file);

        return function () {
            gutil.log(gutil.colors.yellow('Starting to adjust permissions ' + fileName + ' ...'));

            exec('ssh ' + machine + ' "chown eprunapp:apache ' + file + '"', function (error, stdout, stderr) {

                if (error !== null || stderr !== '') {
                    gutil.log(gutil.colors.red('Failed to adjust permissions ' + fileName));
                    return;
                }

                gutil.log(gutil.colors.green('Finished adjusting permissions ' + fileName));
                if (typeof done === 'function') {
                    done();
                }
            });
        };
    },

    exec: function (command, onSuccess, onError, done) {
        onSuccess = onSuccess || function () {};
        onError = onError || function () {};
        done = done || function () {};

        return function () {
            exec('ssh ' + machine + ' "' + command + '"', function (error, stdout, stderr) {
                if (error !== null || stderr !== '') {
                    onError(stderr);
                } else {
                    onSuccess(stdout);
                }

                done();
            });
        };
    },

    spawn: function (command, onSuccess, onError, done) {
        return function () {
            var sshSpawn = spawn('ssh', [machine, '"' + command + '"']);
            sshSpawn.stdout.on('data', onSuccess);
            sshSpawn.stderr.on('data', onError);
            sshSpawn.on('exit', done);
        };
    }
};
