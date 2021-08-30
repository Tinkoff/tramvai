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
    console.log(
      chalk.blue('Записываем информацию о пути к локальному инстансу tramvai-cli:', debugValue)
    );
    fs.writeFileSync(debugPath, debugValue);
    console.log(
      chalk.green(
        'Информацию успешно запомнили. Теперь нужно использовать tramvai-debug без передачи параметра debugPath'
      )
    );
    process.exit(0);
  }
}

const debugPathExists = fs.existsSync(debugPath);
if (!debugPathExists) {
  console.log(
    chalk.red(
      'Не нашли информацию о пути до tramvai-cli. Нужно вызывать команду tramvai-debug с передачей полного пути к локальному инстансу. Пример: tramvai-debug debugPath=/Users/User/job/platform-cli/packages/cli'
    )
  );
  throw new Error('Config not found');
}
const debugPathData = fs.readFileSync(debugPath, 'utf8');

console.log(
  chalk.blue('Использует локальная версия tramvai-cli расположенная в директории:', debugPathData)
);

require('./spawn')(path.join(debugPathData, 'lib/cli/bin-local'));
