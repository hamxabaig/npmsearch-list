#!/usr/bin/env node

const inquirer = require('inquirer');
const search = require('./search');
const getPackagesList = require('./packagesList');
const autocomplete = require('inquirer-autocomplete-prompt');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora()
spinner.color = 'yellow';
spinner.text = 'Getting packages list...';
spinner.start();

getPackagesList().then((list) => {
  spinner.succeed();

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
})
.catch(err => {
  spinner.fail();
  console.log('\n' + chalk.red(err))
  process.exit(1);
});
