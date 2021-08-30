import { createToken } from '@tinkoff/dippy';

export interface EnvironmentManager {
  get(name: string): string;
  getInt(name: string, def: number): number;
  getAll(): Record<string, string>;
  update(result: Record<string, string>): void;
  clientUsed(): Record<string, string>;
  updateClientUsed(result: Record<string, string>): void;
}

/**
 * @description
 * Сущность `environmentManager` c помощью которого можно получить данные env переменных на сервере и клиенте
 */
export const ENV_MANAGER_TOKEN = createToken<EnvironmentManager>('environmentManager');

/**
 * @description
 * Список токенов которые необходимы модулю или приложению.
 * Позднее все токены из этого списка будут доступны через `environmentManager`
 * Формат токена ENV_USED_TOKEN:
    - `key` - идентификатор env переменной. Под этим ключем будет доступно в `environmentManager` и будет получено из внешних источников
    - `value` - предустановленное значение для токена `key` с низким приоритетом
    - `optional` - является ли параметр опциональным для работы приложения. Если `true`, то приложение не будет падать, если не было передано значение
    - `validator` - функция валидации переданного значения. Если функция вернет текст, то выкинется ошибка
    - `dehydrate` - если передано `false`, то env параметр не передастся клиенту и можно будет получить значение только на серверной стороне
 *
 * @example
  ```tsx
  interface EnvParameter {
    key: string;
    value?: string;
    optional?: boolean;
    validator?: (value: string) => boolean | string;
    dehydrate?: boolean;
  }
  ```
 */
export interface EnvParameter {
  key: string;
  value?: string;
  optional?: boolean;
  validator?: (value: string) => boolean | string;
  dehydrate?: boolean;
}

export const ENV_USED_TOKEN = createToken<EnvParameter[]>('envUsed', { multi: true });
