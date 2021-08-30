import type { Context } from '../../models/context';

export function checkConfigExists({ config }: Context) {
  const configParameters = config.get();

  if (!configParameters) {
    throw new Error(
      `[checkConfigExists] Не создан tramvai.json в корне проекта. Для продолжения работы необходимо создать tramvai.json или запустить команду tramvai new myAwesomeApp`
    );
  }

  return Promise.resolve({ name: 'checkConfigExists', status: 'ok' });
}
