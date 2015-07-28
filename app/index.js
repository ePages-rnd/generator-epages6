/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    _ = require('lodash');

module.exports = generator.Base.extend({
    constructor: function () {
        generator.Base.apply(this, arguments);
        this.argument('action', {type: String, required: false});
    },

    init: function () {
        switch (this.action) {
            default:
                this.composeWith('epages6:install');
        }
    }
});
