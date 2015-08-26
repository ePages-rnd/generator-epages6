/* eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    chalk = require('chalk'),
    logo = require('../logo');

module.exports = generator.Base.extend({
    initializing: function () {
        this.log(chalk.red(logo));
        this.log(chalk.bold.yellow('Please start your ePages 6 Virtual Machine before you continue'));
    }
});
