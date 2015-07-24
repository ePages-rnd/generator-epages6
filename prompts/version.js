'use strict';

var SimpleSSH = require('simple-ssh');

module.exports = function (config, done) {
    var ssh = new SimpleSSH({
        host: config['vm-domain'],
        user: config['vm-usr'],
        pass: config['vm-pwd']
    });

    ssh.exec('ls -d ' + config.webroot + '/StoreTypes/*/', {
        out: function (response) {
            done({type: 'list',
                name: 'version',
                message: 'Version',
                choices: response.match(/(?:\d{1,2}\.){2}\d{1,3}/g)
            });
        }
    }).start();
}
