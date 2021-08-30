import NodeEnvironment from 'jest-environment-node';

module.exports = class CustomEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();

    // пробрасываем дальше глобальные переменные в сами тесты, т.к. global в окружении изолировано от global в тестах
    this.global.__tramvai_cli_mock = global.__tramvai_cli_mock;
    this.global.app = global.app;
  }
};
