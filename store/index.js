/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    configInterface = require('../config'),
    storePrompt = require('./prompts');

var config;

module.exports = generator.Base.extend({

    initializing: function () {
        config = configInterface(this.destinationPath('config.json'));
    },

    prompting: function () {
        var self = this,
            done = this.async();

        if (config.data['vm-usr'] === undefined ||
            config.data['vm-domain'] === undefined ||
            config.data['vm-usr'] === undefined) {
            this.log(chalk.bold.red('Configuration Information for your VM are missing, run'));
            this.log(chalk.inverse('yo epages6:vm'));
            return done();
        }

        if (config.data['version'] === undefined) {
            this.log(chalk.bold.red('Version Information for your ePages installation is missing, run'));
            this.log(chalk.inverse('yo epages6:version'));
            return done();
        }

        storePrompt(config.data, function (stores) {
            self.prompt(stores, function (input) {
                config.update(input).write();
                done();
            });
        });
    }

});
