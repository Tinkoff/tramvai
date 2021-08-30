# CookieModule

Модуль для получения и изменения cookie, который поставляется с common module.

## Features

- Изоморфный код, работает на сервере и в браузере
- На сервере происходит дедубликация одинаковых кук и при добавлении куки, кука будет доступна в методе get
- По дефолту мы проставляем secure параметр

## Установка

Уже поставляется внутри @tramvai/module-common и не нужно устанавливать, если подключен module-common.

Иначе, нужно подключить `@tramvai/module-cookie`

## Использование

```tsx
import { COOKIE_MANAGER, Module, provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      // Управление куками в приложении
      provide: 'my_module',
      useFactory: ({ cookie }) => {
        cookie.get('sid'); // > ads.api3
      },
      deps: {
        cookie: COOKIE_MANAGER, // добавляем в зависимость
      },
    }),
  ],
})
class MyModule {}
```

## Интерфейс

Реализует интерфейс CookieManager и добавляет в di провайдер `COOKIE_MANAGER`. @tinkoff/core

## Экспортируемые токены

#### COOKIE_MANAGER_TOKEN

Сущность для работы с куками

```tsx
interface CookieSetOptions {
  name: string;
  value: string;
  expires?: number | Date | string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

interface CookieManager {
  get(name: any): string;
  all(): Record<string, string>;
  set({ name, value, ...options }: CookieSetOptions): void;
  remove(name: string): void;
}
```
