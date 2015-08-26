/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    path = require('path'),
    fs = require('fs-extra'),
    chalk = require('chalk'),
    configInterface = require('../config'),
    config = require('../config');

module.exports = generator.Base.extend({
    initializing: function () {
        config = configInterface(this.destinationPath('config.json'));
    },

    clean: function () {
        if (config.data['cartridges-local'] !== undefined) {
            fs.removeSync(path.resolve(config.data['cartridges-local'], '.editorconfig'));
            fs.removeSync(path.resolve(config.data['cartridges-local'], '.eslintrc'));
        }
    },

    copy: function () {
        var self = this,
            done = this.async();

        if (config.data['cartridges-local'] === undefined) {
            this.log(chalk.bold.red('Path for your local cartridges folder is missing, run'));
            this.log(chalk.inverse('yo epages6:cartridges'));
            return done();
        }

        this.remote('epages-rnd', 'dotfiles', 'master', function (err, remote) {
            if (err) {
                throw new Error(err);
            }

            self.fs.copy(path.resolve(remote.cachePath, '.editorconfig'), path.resolve(config.data['cartridges-local'], '.editorconfig'));
            self.fs.copy(path.resolve(remote.cachePath, '.eslintrc'), path.resolve(config.data['cartridges-local'], '.eslintrc'));
            done();
        }, true);
    }
});
