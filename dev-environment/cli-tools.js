/*eslint-env node*/
'use strict';

var SimpleSSH = require('simple-ssh');

module.exports = function (config, done) {
    var ssh = new SimpleSSH({
            host: config['vm-domain'],
            user: config['vm-usr'],
            pass: config['vm-pwd']
        });

    ssh.exec('curl https://raw.githubusercontent.com/ePages-rnd/epages6-cli/master/install.pl | $PERL', {
        out: function (response) {
            done(response);
        }
    }).start();
};
