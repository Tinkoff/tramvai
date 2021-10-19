# Инструмент миграции кода

Утилита для выполнения миграции для трамвайный модулей.

Принцип работы:

- в опубликованном модуле в папке `__migrations__` находятся файлы миграций для выполнения
- найденные и ранее не исполненные миграции выполняются
- миграции могут изменять файлы 'package.json', 'tramvai.json' и исходный код проекта
- после выполнения миграции информация о выполненной миграции добавится в файл '.tramvai-migrate-applied.json' в корень проекта
- все измененные файлы после миграции добавляются в гит и комитятся как часть обновления пакетов

## Отключение выполнения миграций

Для отключения миграций можно проставить переменную окружения `SKIP_TRAMVAI_MIGRATIONS`.

## Добавление новой миграции

Добавить новую миграцию можно с помощью команды `yarn generate:migration` после чего потребуется указать имя пакета для которого предназначена миграция и имя новой миграции. Также для этого пакета потребуется добавить в `package.json` в поле `files` папку с собранными миграциями, если они не были указаны ранее:

```json
"files": [
    "lib",
    "__migrations__"
],
```

## Реализация миграции

Миграция представляет собой функцию, принимающую специальное апи с помощью которого можно осуществлять изменения кода или конфигов.

```tsx
export interface Api {
  packageJSON: PackageJSON; // объект-представление корневого package.json
  tramvaiJSON: TramvaiJSON; // объект-представление файла tramvai.json или platform.json
  transform: (transformer: Transform, pathTransformer?: PathTransformer) => Promise<void>; // функция принимающая функцию-траснформер для jscodeshift и функцию-трансформер для переименования файлов
}
```

Трансформация кода осуществляется с помощью [jscodeshift](https://github.com/facebook/jscodeshift)

## How to

### Write migration

#### Transformation

Rules:

- Prefer to return `null | undefined` or original source from the transform function in cases when migration doesn't change source code. Otherwise it will lead to unnecessary fs writing.
- Prefer to use embedded methods of collections returned by call `j(source)` to make searches and transforms
