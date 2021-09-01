/* eslint-disable no-param-reassign */
const path = require('path');

const updatePublicPackages = require('./update-public-packages');

async function updatePublicPackagesVersions() {
  const packagesVersions = require(path.resolve(process.cwd(), 'packages-versions.json'));

  await updatePublicPackages((packageJson) => {
    if (packageJson.version === '0.0.0-stub') {
      packageJson.version = packagesVersions[packageJson.name];
    }

    for (const pkgName in packagesVersions) {
      if (
        packageJson.dependencies &&
        packageJson.dependencies[pkgName] &&
        packageJson.dependencies[pkgName] === '0.0.0-stub'
      ) {
        packageJson.dependencies[pkgName] = packagesVersions[pkgName];
      }
      if (
        packageJson.devDependencies &&
        packageJson.devDependencies[pkgName] &&
        packageJson.devDependencies[pkgName] === '0.0.0-stub'
      ) {
        packageJson.devDependencies[pkgName] = packagesVersions[pkgName];
      }
      if (
        packageJson.peerDependencies &&
        packageJson.peerDependencies[pkgName] &&
        packageJson.peerDependencies[pkgName] === '0.0.0-stub'
      ) {
        packageJson.peerDependencies[pkgName] = packagesVersions[pkgName];
      }
    }
  });
}

updatePublicPackagesVersions();
/* eslint-enable no-param-reassign */
