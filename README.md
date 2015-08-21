# ePages 6 Yeoman Generator
Tools and automation for ePages 6 development.

![Preview](https://raw.githubusercontent.com/ePages-rnd/generator-epages6/master/demo-data/demo-generator.gif)

## Installation

1. Configure your ePages 6 VM properly, enable authorization via ssh-key

2. Install [NodeJS](https://nodejs.org/)

3. Install Yeoman ``npm install -g yo``

4. Install the ePages 6 generator ``npm install -g generator-epages6``

5. Go one level above your local ``ePages 6 cartridges`` folder and run ``yo epages6``

6. Follow the instructions

## Available gulp tasks

``default``: Triggers ``watch``

``build``: Runs ``make build_ui``

``watch``: Runs file watchers for ``scripts``, ``styles``, ``perl`` and ``html``, based on your settings

``scripts``: Copies modified and new JavaScripts to the webroot via scp

``styles``: Copies modified and new less and css files to the webroot via scp

``html``: Runs remote tle linting on the vm

``perl``: Runs remote perl linting on the vm
