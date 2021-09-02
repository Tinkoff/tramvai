const util = require('util');
const childProcess = require('child_process');

const exec = util.promisify(childProcess.exec);

const publicPackages = require('./public-packages-list');

async function publishPublicPackages() {
  const paths = publicPackages.map((packageName) =>
    require.resolve(`${packageName}/package.json`).replace('/package.json', '')
  );

  for (let i = 0; i < paths.length; i++) {
    const pkgPath = paths[i];
    let channel;

    try {
      channel = await exec(`npm publish --access public --registry https://registry.npmjs.org/`, {
        cwd: pkgPath,
      });
    } catch (e) {
      console.log('npm publish error', e);
    }
    if (channel && channel.stderr) {
      console.log('npm publish problem', channel.stderr);
    }
    if (channel && channel.stdout) {
      console.log('npm publish finish', channel.stdout);
    }
  }
}

publishPublicPackages();
