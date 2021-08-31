/* eslint-disable no-param-reassign */
const path = require('path');

const updatePublicPackages = require('./update-public-packages');

async function updatePublicPackagesVersions() {
  const packagesVersions = require(path.resolve(process.cwd(), 'packages-versions.json'));

  await updatePublicPackages((packageJson) => {
    if (packagesVersions[packageJson.name]) {
      packageJson.version = packagesVersions[packageJson.name];
    }
  });
}

updatePublicPackagesVersions();
/* eslint-enable no-param-reassign */
