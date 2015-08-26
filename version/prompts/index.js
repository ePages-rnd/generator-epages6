/*eslint-env node*/
'use strict';

var SimpleSSH = require('simple-ssh');

module.exports = function (config, done) {
    var ssh = new SimpleSSH({
            host: config['vm-domain'],
            user: config['vm-usr'],
            pass: config['vm-pwd']
        }),

        input = {
            type: 'list',
            name: 'version',
            message: 'Version'
        };

    ssh.exec('ls -d ' + config.webroot + '/StoreTypes/*/', {
        out: function (response) {
            input.choices = response.match(/(?:\d{1,2}\.){2}\d{1,3}/g).reverse();

            if (config.version !== undefined) {
                input.default = config.version;
            }

            done(input);
        }
    }).start();
};
