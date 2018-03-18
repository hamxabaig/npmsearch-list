#!/usr/bin/env node

const inquirer = require('inquirer');
const search = require('./core');
const getPackagesList = require('./core/packagesList');
const autocomplete = require('inquirer-autocomplete-prompt');
const chalk = require('chalk');

getPackagesList().then((list) => {
  const options = {
    type: 'autocomplete',
    name: 'command',
    message: '>',
    source: (_, input) => {
      return search(input || '', list)
     }
  }
  
  inquirer.registerPrompt('autocomplete', autocomplete);
  inquirer.prompt(options).then(({ command }) => {
    console.log(chalk.blue.underline.bold('Selected package: ' + command));
  });
});
