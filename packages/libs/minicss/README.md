# Minicss class name generator

Библиотека для генерации коротких имён классов. Подробнее про концепцию в [статье](https://dev.to/denisx/reduce-bundle-size-via-one-letter-css-classname-hash-strategy-10g6).

## Установка
Устанавливаем через package manager
```bash
yarn add --dev @tinkoff/minicss-class-generator
```
или
```bash
npm i --save-dev @tinkoff/minicss-class-generator
```

## Подключение
В файле конфига для вебпака для лоадера `css-loader` определяем параметры `localIdentName` и `getLocalIdent`:

```js
({
  loader: 'css-loader',
  options: {
    modules: {
      getLocalIdent: createGenerator(),
      localIdentName: '[minicss]'
    },
  },
})
```

В localIdentName можно передать произвольный шаблон и использовать возможности из css-loader. Например: я хочу добавить название оригинального файла и className, для этого могу прописать `[name]__[local]_[minicss]`

## Принцип работы

Плагин генерирует уникальный хэш ключ для className по формуле - ${порядок}${contentHash} при этом, `contentHash` - хэш от контента файла, `порядок` - инкрементальный ключ порядка внутри файла, каждая генерация ключа увеличивает параметр и тем самым соблюдается уникальность внутри файла. За счет того, что у нас `contentHash` общий для всего файла, мы меньше генерируем уникальных ключей и gzip/brotli лучше сжимает данные

Пример работы:
```
[hash:base64:5]
file: Button.css
 .2hlLi
 .32BZU
```

```
[minicss]
file: Button.css
 .abhUzy
 .bbhUzy
```
