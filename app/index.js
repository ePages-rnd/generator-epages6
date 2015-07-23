/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs-extra'),
    SimpleSSH = require('simple-ssh');

var workingPath = process.cwd(),

    config = {
        'cartridges-remote': '/srv/epages/eproot/Cartridges',
        'webroot': '/srv/epages/eproot/Shared/WebRoot',
        'perl-exec': '/srv/epages/eproot/Perl/bin/perl'
    },

    // VM Configuration
    vmDomain = {
        type: 'input',
        name: 'vm-domain',
        message: 'Public VM Address'
    },

    user = {
        type: 'input',
        name: 'vm-usr',
        message: 'VM Username',
        default: 'root'
    },

    password = {
        type: 'input',
        name: 'vm-pwd',
        message: 'VM Password',
        default: 'qwert6'
    },

    // Cartridges repo
    cartridges = (function () {
        var directories = [],
            input = {
                type: 'input',
                name: 'cartridges-folder',
                message: 'Cartridges Folder'
            };

        _.forEach(fs.readdirSync(workingPath), function (folderName) {
            var folderPath = path.resolve(workingPath, folderName);

            if (folderName[0] === '.') return;

            if (fs.lstatSync(folderPath).isDirectory() === false) return;

            directories.push(folderName);
        });

        if (directories.length > 0) {
            input.type = 'list';
            input.choices = directories;
        }

        return input;
    }());

module.exports = generator.Base.extend({
    copyGulp: function () {
        this.fs.copyTpl(
            this.templatePath('gulp/gulpfile.js'),
            this.destinationPath('gulpfile.js')
        );

        this.fs.copyTpl(
            this.templatePath('gulp/package.json'),
            this.destinationPath('package.json')
        );

        this.fs.copyTpl(
            this.templatePath('gulp/lib/file-watch.js'),
            this.destinationPath('lib/file-watch.js')
        );

        this.fs.copyTpl(
            this.templatePath('gulp/lib/perl.js'),
            this.destinationPath('lib/perl.js')
        );
    },

    prompting: function () {
        var self = this,
            done = this.async();

        this.prompt([vmDomain, user, password, cartridges], function (input) {
            _.assign(config, input);
            done();
        }.bind(this));
    },

    configuring: function () {
        var done = this.async();

        var ssh = new SimpleSSH({
            host: config['vm-domain'],
            user: config['vm-usr'],
            pass: config['vm-pwd']
        });

        ssh.exec('ls -d ' + config.webroot + ' /StoreTypes/*/', {
            exit: function () {
                console.log(arguments);
                done();
            }
        }).start();
    },

    install: function () {
        this.npmInstall();
    }
});
