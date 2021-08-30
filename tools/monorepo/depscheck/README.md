# @tinkoff-monorepo/depscheck

Утилита для проверки корректности описания зависимостей

Конфигурируется через .depscheckrc и параметры командной строки

Под капотом использует [depcheck](https://github.com/depcheck/depcheck)

## Параметры конфига для .depscheckrc.yml и cli

Все доступные параметры для `depcheck` можно посмотреть в [доке](https://github.com/depcheck/depcheck/tree/0.9.2), но есть проблема с [недопубликованностью](https://github.com/depcheck/depcheck/issues/537). Поэтому параметры ниже работают, но с оговорками (см `--ignore-patterns`), а остальные нужно проверять.

```
> yarn depscheck -h

 collector
   --collector                  Модуль, отвечающий за сбор пакетов для проверки и
                                реализующий интерфейс
                                @tinkoff-monorepo/pkgs-collector ->
                                CollectorInterface (сейчас используется
                                @tinkoff-monorepo/pkgs-collector-pvm)
     [required] [default: {"name":"@tinkoff-monorepo/pkgs-collector-workspaces"}]
   --collector-config-strategy
                       [string] [choices: "about-to-update", "update", "changed",
     "changed-since-release", "affected", "released", "updated", "all"] [default:
                                                                    ["affected"]]

 depcheck
   --depcheck-ignore-matches      Список паттернов имен модулей отсутствие
                                  которых в зависимостях не должно приводить к
                                  ошибке                    [array] [default: []]
   --depcheck-ignore-dirs         Список имен директорий, которые не нужно
                                  проверять на не описанные зависимости
                                                            [array] [default: []]
   --depcheck-skip-missing        Вообще не проверять на не описанные зависимости
                                                       [boolean] [default: false]
   --depcheck-ignore-bin-package  Не делать проверок в bin файлах пакета
                                                       [boolean] [default: false]

 Options:
   --version                   Show version number                      [boolean]
   --config                    false если конфиг не нужен совсем и можно задать
                               путь до файла конфига. Иначе отработает логика
                               cosmiconfig                      [default: "auto"]
   --fix                       Включает режим исправления ошибок. В данный момент
                               исправляет только unused ошибки.
                                                       [boolean] [default: false]
   --ignore-patterns           Список паттернов файлов, в которых не нужно делать
                               проверку на missing deps     [array] [default: []]
   --ignore-peer-dependencies  Список паттернов модулей из peerDependencies,
                               отсутствие которых в dependencies не должно
                               приводить к ошибке           [array] [default: []]
   -h                          Show help                                [boolean]
```

### Пример конфига

```yaml
ignore-patterns:
  ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}', '**/dynamic-components/*/shared/externals.{js,ts}']
depcheck-ignore-dirs: ['__integration__', 'examples', '__tests__']
depcheck-ignore-matches: ['@platform/cli', '@tramvai/tools-migrate']
```
