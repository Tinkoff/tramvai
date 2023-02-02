import { createApi } from '@tramvai/tools-migrate/lib/testUtils';

import migration from './d2023-02-01b-tramvai-config-refactoring';

describe('empty config', () => {
  const api = createApi({
    packageJSON: { source: {}, path: '/package.json' },
    tramvaiJSON: { source: {}, path: '/tramvai.json' },
    transformTests: {},
  });

  it('should convert config', async () => {
    await migration(api);

    expect(JSON.stringify(api.tramvaiJSON.source, null, 2)).toMatchInlineSnapshot(`
      "{
        "projects": {}
      }"
    `);
  });
});

describe('projectsConfig', () => {
  const api = createApi({
    packageJSON: { source: {}, path: '/package.json' },
    tramvaiJSON: {
      source: {
        projectsConfig: {
          commands: {
            build: {
              configurations: {
                modern: true,
                sourceMap: false,
                generateDataQaTag: true,
                removeTypeofWindow: true,
                definePlugin: {
                  prod: {
                    'process.env.NEW_ARCH': false,
                  },
                  dev: {
                    'process.env.NEW_ARCH': false,
                  },
                },
                externals: ['babel-runtime', 'final-form'],
              },
            },
          },
        },
        projects: {
          app1: {
            type: 'application',
            name: 'app1',
            root: 'src/app1',
            commands: {
              build: {
                options: {
                  outputServer: 'server/compiled',
                  outputClient: 'assets/compiled',
                },
              },
            },
          },
        },
      },
      path: '/tramvai.json',
    },
    transformTests: {},
  });

  it('should convert config', async () => {
    await migration(api);

    expect(JSON.stringify(api.tramvaiJSON.source, null, 2)).toMatchInlineSnapshot(`
      "{
        "projectsConfig": {
          "modern": true,
          "externals": {
            "production": [
              "babel-runtime",
              "final-form"
            ],
            "development": [
              "babel-runtime",
              "final-form"
            ]
          },
          "sourceMap": false,
          "define": {
            "development": {
              "process.env.NEW_ARCH": false
            },
            "production": {
              "process.env.NEW_ARCH": false
            }
          },
          "generateDataQaTag": true
        },
        "projects": {
          "app1": {
            "type": "application",
            "name": "app1",
            "root": "src/app1",
            "output": {
              "server": "server/compiled",
              "client": "assets/compiled"
            }
          }
        }
      }"
    `);
  });
});

describe('configs', () => {
  const api = createApi({
    packageJSON: { source: {}, path: '/package.json' },
    tramvaiJSON: {
      source: {
        projects: {
          app1: {
            type: 'application',
            name: 'app1',
            root: 'src/app1',
            commands: {
              build: {
                options: {
                  polyfill: 'src/polyfill',
                  outputServer: 'server/compiled',
                  outputClient: 'assets/compiled',
                },
              },
            },
          },
          app2: {
            type: 'application',
            name: 'app2',
            root: 'src/app2',
            commands: {
              build: {
                options: {
                  vendor: 'src/app2/vendor.ts',
                  server: 'src/app2/index.ts',
                },
                configurations: {
                  modern: false,
                  excludePresetEnv: ['@babel/preset-env'],
                  enableFillActionNamePlugin: true,
                  definePlugin: {
                    dev: {
                      'process.env.TEST': 'true',
                    },
                  },
                  postcss: {
                    config: 'src/postcss.config.js',
                    cssLocalIdentNameProd: '[minicss]',
                    cssModulePattern: '/^(?!.global.css$).$/',
                  },
                },
              },
              serve: {
                configurations: {
                  sourceMap: true,
                  hotRefresh: true,
                  experiments: {
                    transpilation: {
                      loader: 'swc',
                    },
                  },
                },
              },
            },
          },
          app3: {
            type: 'application',
            name: 'app3',
            root: 'src/app3',
            commands: {
              build: {
                configurations: {
                  enableFillActionNamePlugin: true,
                  alias: {
                    '@test/utils': 'src/test/utils.ts',
                  },
                  transpileOnlyModernLibs: false,
                  fileSystemPages: {
                    enable: true,
                  },
                  checkAsyncTs: {
                    failOnBuild: true,
                  },
                  commonChunkSplitNumber: 6,
                  experiments: {
                    minicss: {
                      useImportModule: true,
                    },
                  },
                },
              },
            },
          },
          childApp1: {
            type: 'child-app',
            name: 'childApp1',
            root: 'src/childApp3',
            commands: {
              build: {
                configurations: {
                  webpackResolveAlias: {
                    stream: 'browser-stream',
                  },
                },
              },
              serve: {
                configurations: {
                  sourceMap: true,
                  hotRefresh: true,
                },
              },
            },
          },
          module1: {
            type: 'module',
            name: 'module1',
            root: 'src/modules/module1',
            commands: {
              build: {
                options: {
                  output: 'assets/modules',
                },
                configurations: {
                  dedupeIgnore: ['test-package'],
                  transpileOnlyModernLibs: false,
                  sourceMap: true,
                },
              },
            },
          },
        },
      },
      path: '/tramvai.json',
    },
    transformTests: {},
  });

  it('should convert config', async () => {
    await migration(api);

    expect(JSON.stringify(api.tramvaiJSON.source, null, 2)).toMatchInlineSnapshot(`
      "{
        "projects": {
          "app1": {
            "type": "application",
            "name": "app1",
            "root": "src/app1",
            "polyfill": "src/polyfill",
            "output": {
              "server": "server/compiled",
              "client": "assets/compiled"
            }
          },
          "app2": {
            "type": "application",
            "name": "app2",
            "root": "src/app2",
            "modern": false,
            "experiments": {
              "minicss": {
                "useImportModule": {}
              },
              "transpilation": {
                "loader": {
                  "development": "swc"
                }
              }
            },
            "sourceMap": {
              "development": true
            },
            "define": {
              "development": {
                "process.env.TEST": "true"
              }
            },
            "enableFillActionNamePlugin": true,
            "postcss": {
              "config": "src/postcss.config.js",
              "cssLocalIdentName": {
                "production": "[minicss]"
              },
              "cssModulePattern": "/^(?!.global.css$).$/"
            },
            "hotRefresh": {
              "enabled": true
            }
          },
          "app3": {
            "type": "application",
            "name": "app3",
            "root": "src/app3",
            "fileSystemPages": {
              "enabled": true
            },
            "checkAsyncTs": {
              "failOnBuild": true
            },
            "experiments": {
              "minicss": {
                "useImportModule": {
                  "production": true
                }
              },
              "transpilation": {
                "loader": {}
              }
            },
            "enableFillActionNamePlugin": true,
            "alias": {
              "@test/utils": "src/test/utils.ts"
            },
            "transpileOnlyModernLibs": false
          },
          "childApp1": {
            "type": "child-app",
            "name": "childApp1",
            "root": "src/childApp3",
            "sourceMap": {
              "development": true
            },
            "webpack": {
              "resolveAlias": {
                "stream": "browser-stream"
              }
            },
            "hotRefresh": {
              "enabled": true
            }
          },
          "module1": {
            "type": "module",
            "name": "module1",
            "root": "src/modules/module1",
            "output": "assets/modules",
            "sourceMap": true,
            "transpileOnlyModernLibs": false,
            "dedupe": {
              "ignore": [
                "test-package"
              ]
            }
          }
        }
      }"
    `);
  });
});
