'use strict';

var _ = require('lodash');

module.exports = function (config) {
    var input = {
        type: 'checkbox',
        name: 'watch-tasks',
        message: 'Select your watch tasks:',
        choices: [
            {value: 'scripts'},
            {value: 'styles'},
            {value: 'perl'},
            {value: 'html'}
        ]
    };

    if (config !== undefined) {
        input.choices = _.map(input.choices, function (choice) {
            if (config.indexOf(choice.value) > -1) {
                choice.checked = true;
            }

            return choice;
        });
    }

    return input
};
