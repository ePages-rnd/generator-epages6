/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator');

module.exports = generator.Base.extend({
    constructor: function () {
        generator.Base.apply(this, arguments);
        this.argument('action', {type: String, required: false});
    },

    brand: function () {
        var done = this.async;
        this.composeWith('epages6:brand').on('end', done);
    },

    setVM: function () {
        var done = this.async;
        this.composeWith('epages6:vm').on('end', done);
    },

    installCliTools: function () {
        var done = this.async;
        this.composeWith('epages6:cli-tools').on('end', done);
    },

    setCartridges: function () {
        var done = this.async;
        this.composeWith('epages6:cartridges').on('end', done);
    },

    setVersion: function () {
        var done = this.async;
        this.composeWith('epages6:version').on('end', done);
    },

    setStore: function () {
        var done = this.async;
        this.composeWith('epages6:store').on('end', done);
    },

    installDevtools: function () {
        var done = this.async;
        this.composeWith('epages6:devtools').on('end', done);
    },

    installDotfiles: function () {
        var done = this.async;
        this.composeWith('epages6:dotfiles').on('end', done);
    }
});
