# Экспериментальные настройки @tramvai/cli

Экспериментальные настройки позволяют попробовать фичи и опции, которые ещё не являются стабильными, однако могут существенно сказываться на опыте работы с cli в лучшую сторону.

Экспериментальные флаги задаются в `tramvai.json` и могут задаваться отдельно для `serve` или `build` конфигураций.

`tramvai.json`:

```json
{
  "$schema": "./node_modules/@tramvai/cli/schema.json",
  "projects": {
    "app": {
      "name": "app",
      "root": "src",
      "type": "application",
      "commands": {
        "build": {
          "options": {
            "server": "src/index"
          },
          "configurations": {
            "experiments": {
              "minicss": {
                "useImportModule": true
              },
              "webpack": {
                "cacheUnaffected": true
              }
            }
          }
        },
        "serve": {
          "configurations": {
            "experiments": {
              "minicss": {
                "useImportModule": true
              },
              "webpack": {
                "cacheUnaffected": true
              }
            }
          }
        }
      }
    }
  }
}
```

## Настройки Webpack

Сам webpack предоставляет [список экспериментальных опций](https://webpack.js.org/configuration/experiments/#experimentsoutputmodule), которые можно задать как и описано в доке через `experiments.webpack`.

> Обратите особенно внимание на флаг [`futureDefaults`](https://webpack.js.org/configuration/experiments/#experimentsfuturedefaults) который позволяет включить все экспериментальные опции, которые планируются включить в следующий мажорный релиз по умолчанию

### minicss

Задаются через `experiments.minicss` и позволяют включать экспериментальные настройки для [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin)

- `useImportModule` - включает особый способ компиляции модулей css, который должен ускорить время сборки и уменьшить потребление памяти. Подробнее в [оф. доке](https://github.com/webpack-contrib/mini-css-extract-plugin#experimentalUseImportModule)
