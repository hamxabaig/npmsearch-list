const execa = require('execa')
const path = require('path');
const fs = require('fs');
const sh = require('shelljs');
const chalk = require('chalk')

const parse = ({ code, stdout, stderr }, resolve, reject) => {
  let installedPackages = [];
  // If nothing is in stderr, that means its npm deps error. Ignore it
  if (code !== 1 || !stderr) {
    try {
      const project = JSON.parse(stdout);
      installedPackages = Object.keys(project.dependencies).reduce((list, package) => {
        const packageInfo = project.dependencies[package];
        if (!packageInfo.extraneous) {
          list.push(package + '@' + packageInfo.version)
        }
        return list;
      }, []);

      return resolve(installedPackages);
    } catch (e) {
      return reject(e.message);
    }
  }

  return reject(stderr);
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    const output = sh.pwd();
    if (fs.existsSync(path.join(output.stdout, 'package.json')) && output.code !== 1) {
      return execa
        .shell('npm list --depth=0 --json --silent', {detached: true})
        .then(result => parse(result, resolve, reject))
        .catch(result => parse(result, resolve, reject));
    }
    return reject('Err: You\'re not in npm project folder.');
  });
}
