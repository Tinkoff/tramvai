import type { Validator } from './validator.h';

export const checkConfigExists: Validator = ({ config }) => {
  const configParameters = config.get();

  if (!configParameters) {
    throw new Error(
      `[checkConfigExists] Не создан tramvai.json в корне проекта. Для продолжения работы необходимо создать tramvai.json или запустить команду tramvai new myAwesomeApp`
    );
  }

  return Promise.resolve({ name: 'checkConfigExists', status: 'ok' });
};
