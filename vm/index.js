/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    configInterface = require('../config'),
    prompt = require('./prompts');

var config;

module.exports = generator.Base.extend({

    initializing: function () {
        config = configInterface(this.destinationPath('config.json'));
    },

    prompting: function () {
        var done = this.async();

        this.prompt([
            prompt.domain(config.data['vm-domain']),
            prompt.user(config.data['vm-user']),
            prompt.password(config.data['vm-pwd'])
        ], function (input) {
            config.update(input).write();
            done();
        });
    }

});
