const fs = require('fs');

const publicPackages = require('./public-packages-list');

async function updatePublicPackages(callback) {
  const paths = publicPackages.map((packageName) => require.resolve(`${packageName}/package.json`));

  await Promise.all(
    paths.map(async (packageJsonPath) => {
      const packageJson = require(packageJsonPath);

      callback(packageJson);

      const content = `${JSON.stringify(packageJson, null, 2)}\n`;

      await fs.promises.writeFile(packageJsonPath, content, 'utf-8');
    })
  );
}

module.exports = updatePublicPackages;
