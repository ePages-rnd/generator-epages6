/*eslint-env node*/
'use strict';

var path = require('path'),
    SimpleSSH = require('simple-ssh');

module.exports = function (config, done) {
    var ignoredStores = ['Site', 'StoreCatalog', 'Storelib'],

        ssh = new SimpleSSH({
            host: config['vm-domain'],
            user: config['vm-usr'],
            pass: config['vm-pwd']
        }),

        input = {
            type: 'list',
            name: 'store',
            message: 'Store'
        };

    ssh.exec('ls -d ' + config.webroot + '/StoreTypes/' + config.version + '/*/', {
        out: function (response) {
            var stores = [],
                storePaths = response.split('\n');

            storePaths.pop();

            storePaths.forEach(function (storePath) {
                var storeName = path.basename(storePath);

                if (ignoredStores.indexOf(storeName) > -1) {
                    return;
                }

                stores.push(storeName);
            });

            input.choices = stores;

            if (config.store !== undefined) {
                input.default = config.store;
            }

            done(input);
        }
    }).start();
}
