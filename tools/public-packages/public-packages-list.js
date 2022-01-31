const path = require('path');
const glob = require('fast-glob');

const cwd = path.resolve(__dirname, '..', '..');
const packagesConfigurations = glob.sync(['packages/**/package.json', 'tools/**/package.json'], {
  cwd,
  ignore: ['**/__fixtures__/**', '**/__integrations/**', '**/node_modules/**', 'tools/docSite/**'],
});
const publicPackages = packagesConfigurations
  .map((packageJsonPath) => {
    const packageJsonSource = require(path.join(cwd, packageJsonPath));
    if (packageJsonSource.private) {
      return null;
    }
    return packageJsonSource.name;
  })
  .filter(Boolean);

module.exports = publicPackages;
