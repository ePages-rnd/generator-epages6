/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    config = require('../config'),
    cartridgesPrompt = require('./prompts');

module.exports = generator.Base.extend({

    prompting: function () {
        var done = this.async();

        this.prompt([
            cartridgesPrompt(config.data['cartridges-local'])
        ], function (input) {
            config.update(input).write();
            done();
        });
    }

});
