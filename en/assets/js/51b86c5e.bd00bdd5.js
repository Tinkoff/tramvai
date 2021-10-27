(self.webpackChunk=self.webpackChunk||[]).push([[1452],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>l,kt:()=>m});var o=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=o.createContext({}),p=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},l=function(e){var t=p(e.components);return o.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,g=d["".concat(c,".").concat(m)]||d[m]||u[m]||r;return n?o.createElement(g,s(s({ref:t},l),{},{components:n})):o.createElement(g,s({ref:t},l))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,s=new Array(r);s[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var p=2;p<r;p++)s[p]=n[p];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6598:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>i,contentTitle:()=>c,metadata:()=>p,toc:()=>l,default:()=>d});var o=n(2122),a=n(9756),r=(n(7294),n(3905)),s=["components"],i={id:"test-unit",title:"Unit tests"},c=void 0,p={unversionedId:"references/test/test-unit",id:"references/test/test-unit",isDocsHomePage:!1,title:"Unit tests",description:"Helpers library for writing tramvai specific unit-tests",source:"@site/tmp-docs/references/test/test-unit.md",sourceDirName:"references/test",slug:"/references/test/test-unit",permalink:"/en/docs/references/test/test-unit",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/test/test-unit.md",version:"current",frontMatter:{id:"test-unit",title:"Unit tests"},sidebar:"docs",previous:{title:"Experimental settings",permalink:"/en/docs/references/cli/experiments"},next:{title:"Integration tests",permalink:"/en/docs/references/test/test-integration"}},l=[{value:"Installation",id:"installation",children:[]},{value:"How to",id:"how-to",children:[{value:"Testing reducers",id:"testing-reducers",children:[]},{value:"Testing actions",id:"testing-actions",children:[]},{value:"Testing tramvai module",id:"testing-tramvai-module",children:[]},{value:"Testing app",id:"testing-app",children:[]},{value:"Adding providers to DI",id:"adding-providers-to-di",children:[]},{value:"Create app only for testing",id:"create-app-only-for-testing",children:[]}]}],u={toc:l};function d(e){var t=e.components,n=(0,a.Z)(e,s);return(0,r.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Helpers library for writing tramvai specific unit-tests"),(0,r.kt)("p",null,"It might be even more useful when used with ",(0,r.kt)("a",{parentName:"p",href:"/en/docs/references/test/test-mocks"},(0,r.kt)("inlineCode",{parentName:"a"},"@tramvai/test-mocks"))),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save-dev @tramvai/test-unit\n")),(0,r.kt)("h2",{id:"how-to"},"How to"),(0,r.kt)("h3",{id:"testing-reducers"},"Testing reducers"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { testReducer } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { dispatch, getState } = testReducer(reducer);\n\n  expect(getState()).toEqual([]);\n\n  dispatch(event(1));\n\n  expect(getState()).toEqual([1]);\n});\n")),(0,r.kt)("p",null,(0,r.kt)("details",null,(0,r.kt)("summary",null,"More examples"),(0,r.kt)("p",null,(0,r.kt)("pre",{parentName:"p"},(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createEvent, createReducer } from '@tramvai/state';\nimport { testReducer } from './testReducer';\n\ndescribe('test/unit/testReducer', () => {\n  it('should handle state change', () => {\n    const handle = jest.fn((state: number[], payload: number) => {\n      return [...state, payload];\n    });\n    const event = createEvent<number>('push');\n    const reducer = createReducer('test', [] as number[]).on(event, handle);\n\n    const { dispatch, getState } = testReducer(reducer);\n\n    expect(getState()).toEqual([]);\n    expect(handle).not.toHaveBeenCalled();\n\n    dispatch(event(1));\n\n    expect(getState()).toEqual([1]);\n    expect(handle).toHaveBeenCalledWith([], 1);\n\n    dispatch(event(3));\n\n    expect(getState()).toEqual([1, 3]);\n    expect(handle).toHaveBeenCalledWith([1], 3);\n  });\n\n  it('should handle several tests reducers at separate', () => {\n    const event = createEvent<number>('push');\n    const reducer = createReducer('test', [] as number[]).on(event, (state, payload) => {\n      return [...state, payload];\n    });\n\n    const test1 = testReducer(reducer);\n    const test2 = testReducer(reducer);\n\n    expect(test1.getState()).toEqual([]);\n    expect(test2.getState()).toEqual([]);\n\n    test1.dispatch(event(1));\n\n    expect(test1.getState()).toEqual([1]);\n    expect(test2.getState()).toEqual([]);\n\n    test2.dispatch(event(2));\n\n    expect(test1.getState()).toEqual([1]);\n    expect(test2.getState()).toEqual([2]);\n  });\n});\n\n"))))),(0,r.kt)("h3",{id:"testing-actions"},"Testing actions"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { testAction } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { run } = testAction(action);\n\n  expect(await run(true)).toBe('hello');\n  expect(await run(false)).toBe('world');\n});\n")),(0,r.kt)("p",null,(0,r.kt)("details",null,(0,r.kt)("summary",null,"More examples"),(0,r.kt)("p",null,(0,r.kt)("pre",{parentName:"p"},(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createAction } from '@tramvai/core';\nimport { createEvent } from '@tramvai/state';\nimport { createMockContext } from '@tramvai/test-mocks';\nimport { testAction } from './testAction';\n\ndescribe('test/unit/state/testAction', () => {\n  it('should call action', async () => {\n    const action = createAction({\n      name: 'test',\n      fn: (context, payload: boolean) => {\n        if (payload) {\n          return 'hello';\n        }\n\n        return 'world';\n      },\n    });\n\n    const { run } = testAction(action);\n\n    expect(await run(true)).toBe('hello');\n    expect(await run(false)).toBe('world');\n  });\n\n  it('should call action with custom context', async () => {\n    const context = createMockContext();\n    const event = createEvent<string>('test');\n\n    const action = createAction({\n      name: 'dispatch',\n      fn: (ctx, payload: string) => {\n        return ctx.dispatch(event(`action${payload}`));\n      },\n    });\n\n    const spyDispatch = jest.spyOn(context, 'dispatch');\n\n    const { run } = testAction(action, { context });\n\n    await run('ping');\n\n    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionping', type: 'test' });\n\n    await run('pong');\n\n    expect(spyDispatch).toHaveBeenCalledWith({ payload: 'actionpong', type: 'test' });\n  });\n\n  it('should not require payload', async () => {\n    const action = createAction({\n      name: 'no-payload',\n      fn: () => {\n        return 'empty';\n      },\n    });\n\n    const { run } = testAction(action);\n\n    await expect(run()).resolves.toBe('empty');\n  });\n});\n\n"))))),(0,r.kt)("h3",{id:"testing-tramvai-module"},"Testing tramvai module"),(0,r.kt)("h4",{id:"testing-module-in-isolation"},"Testing module in isolation"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { testModule } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { di, module, runLine } = testModule(TestModule);\n\n  expect(module).toBeInstanceOf(TestModule);\n  expect(di.get('testToken')).toEqual({ a: 1 });\n\n  // Run only specific command line in order to execute handlers for this line inside module\n  await runLine(commandLineListTokens.generatePage);\n});\n")),(0,r.kt)("h4",{id:"testing-module-in-conjunction-with-other-modules"},"Testing module in conjunction with other modules"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { createTestApp } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { app } = await createTestApp({ modules: [TestModule, DependentModule] });\n\n  // get tokens from di implemented by module\n  expect(app.di.get('testToken')).toEqual({ a: 1 });\n});\n")),(0,r.kt)("p",null,(0,r.kt)("details",null,(0,r.kt)("summary",null,"More examples"),(0,r.kt)("p",null,(0,r.kt)("pre",{parentName:"p"},(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { commandLineListTokens, DI_TOKEN, Module } from '@tramvai/core';\nimport { Container } from '@tinkoff/dippy';\nimport { testModule } from './testModule';\n\ndescribe('test/unit/module/testModule`', () => {\n  it('should test module', () => {\n    const mockConstructor = jest.fn();\n\n    @Module({\n      providers: [\n        {\n          provide: 'testToken',\n          useFactory: () => {\n            return { a: 1 };\n          },\n        },\n      ],\n      deps: {\n        di: DI_TOKEN,\n        optToken: { token: 'optional_token', optional: true },\n      },\n    })\n    class TestModule {\n      constructor(deps: any) {\n        mockConstructor(deps);\n      }\n    }\n\n    const { di, module } = testModule(TestModule);\n\n    expect(module).toBeInstanceOf(TestModule);\n    expect(mockConstructor).toHaveBeenCalledWith({ di: expect.any(Container), optToken: null });\n    expect(di.get('testToken')).toEqual({ a: 1 });\n  });\n\n  it('should test command line', async () => {\n    const mock = jest.fn();\n\n    @Module({\n      providers: [\n        {\n          provide: commandLineListTokens.generatePage,\n          multi: true,\n          useFactory: () => {\n            return mock;\n          },\n        },\n      ],\n    })\n    class TestModule {}\n\n    const { runLine } = testModule(TestModule);\n\n    expect(() => runLine(commandLineListTokens.customerStart)).toThrow();\n    expect(mock).not.toHaveBeenCalled();\n\n    await runLine(commandLineListTokens.generatePage);\n\n    expect(mock).toHaveBeenCalledWith();\n  });\n});\n\n"))))),(0,r.kt)("h3",{id:"testing-app"},"Testing app"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Testing app works only in node-environment. See ",(0,r.kt)("a",{parentName:"p",href:"https://jestjs.io/docs/27.0/configuration#testenvironment-string"},"jest docs"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { testApp } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { request, render } = await testApp(app);\n\n  const response = await request('/').expect(200).expect('X-App-Id', 'unit-app');\n\n  expect(response.text).toMatch('<html class=\"no-js\" lang=\"ru\">');\n  expect(response.text).toMatch('<div class=\"application\">rootPage</div>');\n  expect(response.text).toMatch('<script>var initialState =');\n\n  const rootPage = await render('/');\n\n  expect(rootPage.application).toEqual('rootPage');\n\n  const secondPage = await render('/second/');\n\n  expect(secondPage.application).toEqual('secondPage');\n  expect(secondPage.initialState).toEqual({\n    stores: expect.objectContaining({\n      environment: {\n        FRONT_LOG_API: 'test',\n      },\n      router: expect.objectContaining({\n        currentUrl: expect.objectContaining({\n          path: '\\\\u002Fsecond\\\\u002F',\n        }),\n      }),\n    }),\n  });\n});\n")),(0,r.kt)("p",null,(0,r.kt)("details",null,(0,r.kt)("summary",null,"More examples"),(0,r.kt)("p",null,(0,r.kt)("pre",{parentName:"p"},(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import { NoSpaRouterModule } from '@tramvai/module-router';\nimport { commandLineListTokens, createApp, createBundle } from '@tramvai/core';\nimport { CommonModule, ENV_USED_TOKEN } from '@tramvai/module-common';\nimport { LogModule } from '@tramvai/module-log';\nimport { RenderModule } from '@tramvai/module-render';\nimport { ServerModule } from '@tramvai/module-server';\nimport { testApp } from './testApp';\n\ntype ThenArg<T> = T extends PromiseLike<infer U> ? U : T;\n\nconst bundle = createBundle({\n  name: 'mainDefault',\n  components: {\n    pageDefault: () => 'rootPage',\n    pageSecond: () => 'secondPage',\n  },\n});\n\ndescribe('test/unit/app/testApp', () => {\n  let testEnv: ThenArg<ReturnType<typeof testApp>>;\n  describe('normal', () => {\n    beforeAll(async () => {\n      const app = createApp({\n        name: 'unit-app',\n        bundles: {\n          mainDefault: () => Promise.resolve({ default: bundle }),\n        },\n        modules: [\n          CommonModule,\n          LogModule,\n          RenderModule,\n          ServerModule,\n          NoSpaRouterModule.forRoot([\n            {\n              name: 'root',\n              path: '/',\n            },\n            {\n              name: 'other',\n              path: '/second/',\n              config: {\n                pageComponent: 'pageSecond',\n              },\n            },\n          ]),\n        ],\n        providers: [\n          {\n            provide: ENV_USED_TOKEN,\n            multi: true,\n            useValue: { key: 'FRONT_LOG_API', value: 'test' },\n          },\n        ],\n      });\n\n      testEnv = await testApp(app);\n    });\n\n    afterAll(() => {\n      return testEnv.close();\n    });\n\n    it('should request to server', async () => {\n      const { request } = testEnv;\n\n      const response = await request('/').expect(200).expect('X-App-Id', 'unit-app');\n\n      expect(response.text).toMatch('<html class=\"no-js\" lang=\"ru\">');\n      expect(response.text).toMatch('<div class=\"application\">rootPage</div>');\n      expect(response.text).toMatch('<script>var initialState =');\n    });\n\n    it('should return render of page', async () => {\n      const { render } = testEnv;\n\n      const rootPage = await render('/');\n\n      expect(rootPage.application).toEqual('rootPage');\n\n      const secondPage = await render('/second/');\n\n      expect(secondPage.application).toEqual('secondPage');\n      expect(secondPage.initialState).toEqual({\n        stores: expect.objectContaining({\n          environment: {\n            FRONT_LOG_API: 'test',\n          },\n          router: expect.objectContaining({\n            currentUrl: expect.objectContaining({\n              path: '/second/',\n            }),\n          }),\n        }),\n      });\n    });\n\n    it('should return mocker instance', async () => {\n      const { mocker } = testEnv;\n\n      expect(mocker).toBeDefined();\n    });\n  });\n\n  describe('fail', () => {\n    beforeAll(async () => {\n      const app = createApp({\n        name: 'unit-app',\n        bundles: {\n          mainDefault: () => Promise.resolve({ default: bundle }),\n        },\n        modules: [CommonModule, LogModule, RenderModule, ServerModule],\n        providers: [\n          {\n            provide: commandLineListTokens.resolvePage,\n            multi: true,\n            useFactory: ({ wrong }) => {\n              return wrong.test();\n            },\n            deps: {\n              wrong: '_unknown_provider',\n            },\n          },\n        ],\n      });\n\n      testEnv = await testApp(app);\n    });\n\n    afterAll(() => {\n      return testEnv.close();\n    });\n\n    it('render with 500 status should fail', async () => {\n      const { render } = testEnv;\n\n      await expect(render('/')).rejects.toThrowError(\n        'Error: Token not found _unknown_provider at resolve_page'\n      );\n    });\n  });\n});\n\n"))))),(0,r.kt)("h3",{id:"adding-providers-to-di"},"Adding providers to DI"),(0,r.kt)("p",null,"Most of the helpers accepts option ",(0,r.kt)("inlineCode",{parentName:"p"},"providers")," which allows to redefine already existing providers or add new."),(0,r.kt)("p",null,"For example, passing ",(0,r.kt)("inlineCode",{parentName:"p"},"providers")," to helper ",(0,r.kt)("inlineCode",{parentName:"p"},"testAction")," allows to access this provider inside action itself:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createAction } from '@tramvai/core';\nimport { testAction } from '@tramvai/test-unit';\n\nconst action = createAction({\n  name: 'action',\n  fn: (_, __, { test }) => {\n    console.log(test); // token value\n  },\n  deps: {\n    test: 'token name',\n  },\n});\n\nit('test', async () => {\n  const { run } = testAction(action, {\n    providers: [\n      {\n        provide: 'token name',\n        useValue: 'token value',\n      },\n    ],\n  });\n});\n")),(0,r.kt)("h3",{id:"create-app-only-for-testing"},"Create app only for testing"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { createTestApp } from '@tramvai/test-unit';\n\nit('test', async () => {\n  const { app } = await createTestApp({ modules: [TestModule, DependentModule] });\n\n  // get tokens from di implemented by module\n  expect(app.di.get('testToken')).toEqual({ a: 1 });\n});\n")),(0,r.kt)("p",null,(0,r.kt)("details",null,(0,r.kt)("summary",null,"More examples"),(0,r.kt)("p",null,(0,r.kt)("pre",{parentName:"p"},(0,r.kt)("code",{parentName:"pre",className:"language-typescript"},"import http from 'http';\nimport { ENV_MANAGER_TOKEN } from '@tramvai/tokens-common';\nimport { SERVER_TOKEN } from '@tramvai/tokens-server';\nimport { CommonModule } from '@tramvai/module-common';\nimport { createTestApp } from './createTestApp';\n\ndescribe('test/unit/app/createTestApp', () => {\n  it('should return app', async () => {\n    const { app, close } = await createTestApp();\n    const envManager = app.di.get(ENV_MANAGER_TOKEN);\n\n    expect(envManager.get('FRONT_LOG_API')).toBe('test');\n    expect(envManager.get('TEST_ENV')).toBeUndefined();\n    expect(app.di.get(SERVER_TOKEN)).toBeInstanceOf(http.Server);\n\n    return close();\n  });\n\n  it('should specify env', async () => {\n    const { app, close } = await createTestApp({\n      env: {\n        TEST_ENV: '1234',\n      },\n    });\n\n    const envManager = app.di.get(ENV_MANAGER_TOKEN);\n\n    expect(envManager.get('FRONT_LOG_API')).toBe('test');\n    expect(envManager.get('TEST_ENV')).toBe('1234');\n\n    return close();\n  });\n\n  it('should ignore default modules', async () => {\n    const { app } = await createTestApp({\n      excludeDefaultModules: true,\n      modules: [CommonModule],\n    });\n\n    expect(() => app.di.get(SERVER_TOKEN)).toThrow('Token not found');\n  });\n\n  it('should return mocker instance', async () => {\n    const { mocker, close } = await createTestApp();\n\n    expect(mocker).toBeDefined();\n\n    return close();\n  });\n});\n\n"))))))}d.isMDXComponent=!0}}]);