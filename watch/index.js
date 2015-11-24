/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    config = require('../config'),
    tasksPrompt = require('./prompts');

module.exports = generator.Base.extend({

    prompting: function () {
        var done = this.async();

        this.prompt(tasksPrompt(config.data['watch-tasks']), function (input) {
            config.update(input).write();
            done();
        });
    }

});
