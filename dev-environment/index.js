/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    logo = require('../logo'),
    prompt = require('./prompts'),
    installCliTools = require('./cli-tools');

var config = {
        'cartridges-remote': '/srv/epages/eproot/Cartridges',
        'webroot': '/srv/epages/eproot/Shared/WebRoot',
        'perl-exec': '/srv/epages/eproot/Perl/bin/perl'
    };

module.exports = generator.Base.extend({
    initializing: function () {
        this.log(chalk.red(logo));
        this.log(chalk.bold.yellow('Please start your ePages 6 Virtual Machine before you continue'));
        // Try to load a existing config
        try {
            _.assign(config, require(this.destinationPath('config.json')));
            this.log(chalk.green('Loading existing config parameters'));
        } catch (e) {
            this.log('Couldn\'t find a existing config parameters');
        }
    },

    prompting: function () {
        var self = this,
            done = this.async();

        this.prompt([
                prompt.domain(config['vm-domain']),
                prompt.user(config['vm-user']),
                prompt.password(config['vm-pwd']),
                prompt.cartridges(config['cartridges-local']),
                prompt.watch(config['watch-tasks'])], function (input) {
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

    cleanUp: function () {
        fs.removeSync(this.destinationPath('gulpfile.js'));
        fs.removeSync(this.destinationPath('package.json'));
        fs.removeSync(this.destinationPath('lib/perl.js'));
        fs.removeSync(this.destinationPath('lib/file-watch.js'));
        fs.removeSync(this.destinationPath('node_modules'));
        fs.removeSync(path.resolve(path.dirname(config['cartridges-local']), '.editorconfig'));
        fs.removeSync(path.resolve(path.dirname(config['cartridges-local']), '.eslintrc'));
    },

    copyFiles: function () {
        // Gulp
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

        // Dotfiles
        this.fs.copyTpl(
            this.templatePath('dotfiles/.editorconfig'),
            path.resolve(path.dirname(config['cartridges-local']), '.editorconfig')
        );

        this.fs.copyTpl(
            this.templatePath('dotfiles/.eslintrc'),
            path.resolve(path.dirname(config['cartridges-local']), '.eslintrc')
        );
    },

    writing: function () {
        fs.writeJSONSync(this.destinationPath('config.json'), config);
    },

    install: function () {
        installCliTools(config, this.log);
        this.npmInstall();
    }
});
