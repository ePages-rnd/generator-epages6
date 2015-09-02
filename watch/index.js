/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    configInterface = require('../config'),
    tasksPrompt = require('./prompts');

var config;

module.exports = generator.Base.extend({

    initializing: function () {
        config = configInterface(this.destinationPath('config.json'));
    },

    prompting: function () {
        var done = this.async();

        this.prompt(tasksPrompt(config.data['watch-tasks']), function (input) {
            config.update(input).write();
            done();
        });
    }

});
