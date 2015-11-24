/*eslint-env node*/
'use strict';

var generator = require('yeoman-generator'),
    chalk = require('chalk'),
    config = require('../config'),
    SimpleSSH = require('simple-ssh');

module.exports = generator.Base.extend({

    install: function () {
        var self = this,
            done = this.async(),
            ssh = new SimpleSSH({
                host: config.data['vm-domain'],
                user: config.data['vm-usr'],
                pass: config.data['vm-pwd']
            });

        if (config.data['vm-usr'] === undefined ||
            config.data['vm-domain'] === undefined ||
            config.data['vm-usr'] === undefined) {
            this.log(chalk.bold.red('Configuration Information for your VM are missing, run'));
            this.log(chalk.inverse('yo epages6:vm'));
            return done();
        }

        ssh.exec('curl https://raw.githubusercontent.com/ePages-rnd/epages6-cli/master/install.pl | $PERL', {
            out: function (response) {
                self.log(response);
                done();
            }
        }).start();
    }
});
