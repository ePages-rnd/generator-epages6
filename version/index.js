/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    chalk = require('chalk'),
    config = require('../config'),
    versionPrompt = require('./prompts');

module.exports = generator.Base.extend({

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

        versionPrompt(config.data, function (versions) {
            self.prompt(versions, function (input) {
                config.update(input).write();
                done();
            });
        });
    }

});
