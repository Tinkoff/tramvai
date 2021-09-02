# eslint-plugin-tramvai

Набор eslint правил, специфичный для tramvai приложений, предназначен для дополнения конфигураций из `@tinkoff/eslint-config`

## Подключение

Устанавливаем через npm

```bash
npm i --save-dev @tinkoff/eslint-config @tinkoff/eslint-config-react @tinkoff/eslint-plugin-tramvai
```

Подключаем в `.eslintrc` рекомендованные настройки:

```bash
{
  "extends": [
    "@tinkoff/eslint-config/app",
    "@tinkoff/eslint-config-react",
    "plugin:@tinkoff/tramvai/recommended"
  ]
}
```

Либо подключаем и конфигурируем плагин вручную:

```bash
{
  "extends": [
    "@tinkoff/eslint-config/app",
    "@tinkoff/eslint-config-react"
  ],
  "plugins": [
    "@tinkoff/tramvai"
  ],
  "rules": {
    "@tinkoff/tramvai/bundle-chunk-name": "warn"
  }
}
```

## Внутренние правила

### bundle-chunk-name

В tramvai приложении для правильной работы системы бандлов, необходимо для импортов указывать [специальные комментарии для динамических импортов](https://tramvai.devdocs/modules/render#%D0%BE%D1%81%D0%BE%D0%B1%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8).
Это правило позволяет проверить, что для динамических импортов бандлов правильно указан управляющий комментарий `webpackChunkName: [name]`.
Также правило позволяет применить автофикс в большинстве случае.

Пример неправильно кода:
```typescript
createApp({
  bundles: {
    'tramvai/bundle-1': () => import("./bundles/bundle1"),
    'tramvai/bundle-2': () => import(/* webpackChunkName: "randomValue" */ "./bundles/bundle2")
  }
})
```

Пример правильно кода, после автофикса версии выше:
```typescript
createApp({
  bundles: {
  'tramvai/bundle-1': () => import(/* webpackChunkName: "bundle-1" */ "./bundles/bundle1"),
  'tramvai/bundle-2': () => import(/* webpackChunkName: "bundle-2" */ "./bundles/bundle2")
  }
})
```

Опции:
- `propertyNames`: задает массив названий свойств объекта, для которых будет производиться анализ. По умолчанию работает для свойств с именем `bundles`. 
