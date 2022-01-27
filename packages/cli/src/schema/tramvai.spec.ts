import Ajv from 'ajv';
import clone from '@tinkoff/utils/clone';
import { resolve } from 'path';
import { sync as requireResolve } from 'resolve';
import { schema } from './tramvai';

jest.mock('path');
jest.mock('resolve');

describe('JSON schema для tramvai.json', () => {
  it('Схема успешно компилируется', () => {
    const ajv = new Ajv();

    expect(() => ajv.compile(schema)).not.toThrow();
  });

  it('Базовая конфигурация проходит валидацию схемы', () => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);

    const baseConfig = {
      projects: {
        app: {
          name: 'test-app',
          root: 'src/app',
          type: 'application',
          commands: {
            build: {
              options: {},
              configurations: {},
            },
            serve: {
              configurations: {},
              notifications: {},
            },
          },
        },
        module: {
          name: 'test-module',
          root: 'src/module',
          type: 'module',
          commands: {
            build: {
              options: {},
              configurations: {},
            },
            serve: {
              configurations: {},
              notifications: {},
            },
          },
        },
      },
    };

    const valid = validate(baseConfig);

    expect(valid).toBe(true);
    expect(validate.errors).toBe(null);
  });

  it('Применяет значения по умолчанию', () => {
    (resolve as any).mockReturnValue('mock');
    (requireResolve as any).mockReturnValue('mock');

    const config = {
      projects: {
        app: {
          name: 'test-app',
          root: 'src/app',
          type: 'application' as const,
        },
        module: {
          name: 'test-module',
          root: 'src/module',
          type: 'module' as const,
        },
      },
    };

    const originalConfig = clone(config);

    const ajv = new Ajv({ allErrors: true, useDefaults: true, strictDefaults: 'log' });
    const validate = ajv.compile(schema);
    const valid = validate(config);

    expect(valid).toBe(true);
    expect(config).not.toEqual(originalConfig);

    expect(config).toEqual({
      projects: {
        app: {
          name: 'test-app',
          root: 'src/app',
          type: 'application',
          commands: {
            build: {
              options: {
                outputClient: 'dist/client',
                outputServer: 'dist/server',
                outputStatic: 'dist/static',
                server: 'src/server',
                serverApiDir: 'src/api',
                polyfill: '',
                vendor: '',
              },
              configurations: {
                terserParallel: true,
                checkAsyncTs: false,
                commonChunk: true,
                commonChunkSplitNumber: 3,
                dedupe: false,
                generateDataQaTag: false,
                granularChunks: false,
                granularChunksSplitNumber: 2,
                granularChunksMinSize: 20000,
                modern: false,
                removeTypeofWindow: true,
                sourceMap: false,
                sourceMapServer: false,
                definePlugin: {
                  dev: {},
                  prod: {},
                },
                enableFillActionNamePlugin: false,
                externals: [],
                postcss: {
                  config: 'postcss.config',
                },
                transpileOnlyModernLibs: true,
                experiments: {
                  webpack: {
                    cacheUnaffected: true,
                    backCompat: false,
                  },
                  minicss: {
                    useImportModule: true,
                  },
                  fileSystemPages: {
                    enable: false,
                    routesDir: 'routes',
                    pagesDir: 'pages',
                  },
                  transpilation: {
                    loader: 'babel',
                  },
                },
              },
            },
            serve: {
              configurations: {
                hotRefresh: false,
                modern: false,
                sourceMap: false,
                externals: ['react$', 'react-dom', 'prop-types', 'express', 'core-js'],
                experiments: {
                  webpack: {
                    cacheUnaffected: true,
                    backCompat: false,
                  },
                  minicss: {
                    useImportModule: true,
                  },
                  fileSystemPages: {
                    enable: false,
                    routesDir: 'routes',
                    pagesDir: 'pages',
                  },
                  transpilation: {
                    loader: 'babel',
                  },
                },
              },
              notifications: {},
            },
          },
        },
        module: {
          name: 'test-module',
          root: 'src/module',
          type: 'module',
          commands: {
            build: {
              configurations: {
                terserParallel: true,
                enableFillActionNamePlugin: false,
                generateDataQaTag: false,
                modern: false,
                removeTypeofWindow: true,
                sourceMap: false,
                sourceMapServer: false,
                dedupe: false,
                definePlugin: {
                  dev: {},
                  prod: {},
                },
                postcss: {
                  config: 'postcss.config',
                  cssLocalIdentName: '[hash:base64:5]',
                },
                transpileOnlyModernLibs: true,
                experiments: {
                  webpack: {
                    cacheUnaffected: true,
                    backCompat: false,
                  },
                  minicss: {
                    useImportModule: true,
                  },
                  fileSystemPages: {
                    enable: false,
                    routesDir: 'routes',
                    pagesDir: 'pages',
                  },
                  transpilation: {
                    loader: 'babel',
                  },
                },
              },
              options: {
                output: 'dist/modules',
              },
            },
            serve: {
              configurations: {
                hotRefresh: false,
                modern: false,
                sourceMap: false,
                experiments: {
                  webpack: {
                    cacheUnaffected: true,
                    backCompat: false,
                  },
                  minicss: {
                    useImportModule: true,
                  },
                  fileSystemPages: {
                    enable: false,
                    routesDir: 'routes',
                    pagesDir: 'pages',
                  },
                  transpilation: {
                    loader: 'babel',
                  },
                },
              },
              notifications: {},
            },
          },
        },
      },
    });
  });
});
