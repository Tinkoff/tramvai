/* eslint-disable no-param-reassign */
const path = require('path');

const updatePublicPackages = require('./update-public-packages');

async function updatePublicPackagesVersions() {
  const packagesVersions = require(path.resolve(process.cwd(), 'packages-versions.json'));

  await updatePublicPackages((packageJson) => {
    if (packageJson.version === '0.0.0-stub') {
      packageJson.version = packagesVersions[packageJson.name];
    }

    for (const depsField of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!packageJson[depsField]) {
        continue;
      }

      for (const pkgName in packageJson[depsField]) {
        const isStub = packageJson[depsField][pkgName] === '0.0.0-stub';
        const hasRealVersion = pkgName in packagesVersions;

        if (isStub) {
          if (hasRealVersion) {
            packageJson[depsField][pkgName] = packagesVersions[pkgName];
          } else {
            throw Error(`Version for ${pkgName} not found in packages-versions.json!`);
          }
        }
      }
    }
  });
}

updatePublicPackagesVersions();
/* eslint-enable no-param-reassign */
