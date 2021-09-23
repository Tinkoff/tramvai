import NodeEnvironment from 'jest-environment-node';
import console from 'console';

const nativeConsole = new console.Console({ stdout: process.stdout, stderr: process.stderr });

module.exports = class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // пробрасываем дальше глобальные переменные в сами тесты, т.к. global в окружении изолировано от global в тестах
    this.global.__tramvai_cli_mock = global.__tramvai_cli_mock;
    this.global.app = global.app;
    this.global.nativeConsole = nativeConsole;
  }
};
