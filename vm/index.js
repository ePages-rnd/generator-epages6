/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    config = require('../config'),
    prompt = require('./prompts');

module.exports = generator.Base.extend({

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
