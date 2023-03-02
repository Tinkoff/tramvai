#!/usr/bin/env node

process.title = 'tramvai-debug';

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const debugPath = path.join(__dirname, '..', 'debug-path');
const setPathToDebug = process.argv.slice(2)[0];

if (setPathToDebug) {
  const [debugIdent, debugValue] = setPathToDebug.split('=');
  if (debugIdent === 'debugPath') {
    console.log(chalk.blue('Recording the path to local version of @tramvai/cli:', debugValue));
    fs.writeFileSync(debugPath, debugValue);
    console.log(
      chalk.green(
        'The path has recorded. Now you can use tramvai-debug without passing debugPath parameter'
      )
    );
    process.exit(0);
  }
}

const debugPathExists = fs.existsSync(debugPath);
if (!debugPathExists) {
  console.log(
    chalk.red(
      `Haven't found path to local version of @tramvai/cli. Call the command tramvai-debug and pass the full path to local version, e.g. tramvai-debug debugPath=/Users/User/job/platform-cli/packages/cli`
    )
  );
  throw new Error('Config not found');
}
const debugPathData = fs.readFileSync(debugPath, 'utf8');

console.log(chalk.blue('Using local version of @tramvai/cli that resides in:', debugPathData));

require('./spawn')(path.join(debugPathData, 'lib/cli/bin-local'));
