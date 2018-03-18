const execa = require('execa')
const os = require('os');
const chalk = require('chalk')
const ora = require('ora')

const spinner = ora()
spinner.color = 'yellow'

const parse = ({ code, stdout, stderr }) => {
  let message = stderr;
  let installedPackages = [];

  if (code !== 1) {
    spinner.succeed();
    try {
      const project = JSON.parse(stdout);
      installedPackages = Object.keys(project.dependencies).map(package => {
        const packageInfo = project.dependencies[package];
        return package + '@' + packageInfo.version;
      });
      return installedPackages;
    } catch (e) {
      message = e.message;
    }
  }

  spinner.fail()
  console.log('\n' + chalk.red(stderr))
  return installedPackages;
}

module.exports = () => {
  spinner.text = 'Getting packages list...';
  spinner.start();
  return new Promise((resolve, reject) => {
    execa
      .shell('npm list --depth=0 --json', {detached: true})
      .then(result => resolve(parse(result)))
      .catch(result => reject(parse(result)));
  });
}
