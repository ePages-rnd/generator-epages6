/* eslint-env node*/
'use strict';

var _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    osenv = require('osenv'),
    configFile = path.resolve(osenv.home(), '.epages-config');

module.exports = (function () {

    var config = {};

    var load = function () {
            var existingConfig = {};

            try {
                existingConfig = fs.readJsonSync(configFile);
            } catch (e) {

            } finally {
                _.assign(config.data, existingConfig);
            }

            return config;
        },

        update = function (data) {
            _.assign(config.data, data);
            return config;
        },

        write = function () {
            fs.writeJSONSync(configFile, config.data);
            return config;
        };

    config.data = {
        'cartridges-remote': '/srv/epages/eproot/Cartridges',
        'webroot': '/srv/epages/eproot/Shared/WebRoot',
        'perl-exec': '/srv/epages/eproot/Perl/bin/perl'
    };

    config.load = load;
    config.update = update;
    config.write = write;

    return load();
}());
