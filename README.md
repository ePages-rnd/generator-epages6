# ePages 6 Yeoman Generator
Generator for tools and automation for ePages 6 development.

![Preview](https://raw.githubusercontent.com/ePages-rnd/generator-epages6/master/demo-data/demo-generator.gif)

## Installation

1. Configure your ePages 6 VM properly, enable authorization via ssh-key

2. Install [NodeJS](https://nodejs.org/)

3. Install Yeoman ``npm install -g yo``

4. Install the ePages 6 generator ``npm install -g generator-epages6``

5. Go to a directory of your choice (except the ``ePages 6 cartridges`` folder) and run ``yo epages6``

6. Follow the instructions

## Available Actions

``yo epages6:vm``
Set the VM configuration

``yo epages6:cartridges``
Set the cartridges folder path

``yo epages6:store``
Select a store

``yo epages6:version``
Select a ePages6 version

``yo epages6:devtools``
Installs the [ePages6 Devtools](https://github.com/ePages-rnd/devtools)

``yo epages6:dotfiles``
Installs the [ePages6 dotfiles](https://github.com/ePages-rnd/dotfiles)

``yo epages6:cli-tools``
Installs the [epages6 cli tools](https://github.com/ePages-rnd/epages6-cli) on the VM
