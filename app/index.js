/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs-extra'),
    prompt = require('../prompts');

var config = {
        'cartridges-remote': '/srv/epages/eproot/Cartridges',
        'webroot': '/srv/epages/eproot/Shared/WebRoot',
        'perl-exec': '/srv/epages/eproot/Perl/bin/perl'
    },

    versions;

    // Cartridges repo


module.exports = generator.Base.extend({
    prompting: function () {
        var self = this,
            done = this.async();

        this.prompt([
                prompt.domain(config['vm-domain']),
                prompt.user(config['vm-user']),
                prompt.password(config['vm-pwd']),
                prompt.cartridges(config['cartridges-local'])], function (input) {
            _.assign(config, input);
            done();
        }.bind(this));
    },

    getVersion: function () {
        var self = this,
            done = this.async();

        prompt.version(config, function (inputElement) {
            self.prompt(inputElement, function (input) {
                _.assign(config, input);
                done();
            }.bind(self));
        });
    },

    getStore: function () {
        var self = this,
            done = this.async();

        prompt.store(config, function (inputElement) {
            self.prompt(inputElement, function (input) {
                _.assign(config, input);
                done();
            }.bind(self));
        });
    },

    copyFiles: function () {
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


    install: function () {
        this.npmInstall();
    }
});
