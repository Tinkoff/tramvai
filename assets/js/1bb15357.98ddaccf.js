"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7601],{3905:(n,e,t)=>{t.d(e,{Zo:()=>l,kt:()=>m});var o=t(7294);function r(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function a(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function i(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?a(Object(t),!0).forEach((function(e){r(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function s(n,e){if(null==n)return{};var t,o,r=function(n,e){if(null==n)return{};var t,o,r={},a=Object.keys(n);for(o=0;o<a.length;o++)t=a[o],e.indexOf(t)>=0||(r[t]=n[t]);return r}(n,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(o=0;o<a.length;o++)t=a[o],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(r[t]=n[t])}return r}var c=o.createContext({}),p=function(n){var e=o.useContext(c),t=e;return n&&(t="function"==typeof n?n(e):i(i({},e),n)),t},l=function(n){var e=p(n.components);return o.createElement(c.Provider,{value:e},n.children)},d={inlineCode:"code",wrapper:function(n){var e=n.children;return o.createElement(o.Fragment,{},e)}},u=o.forwardRef((function(n,e){var t=n.components,r=n.mdxType,a=n.originalType,c=n.parentName,l=s(n,["components","mdxType","originalType","parentName"]),u=p(t),m=r,g=u["".concat(c,".").concat(m)]||u[m]||d[m]||a;return t?o.createElement(g,i(i({ref:e},l),{},{components:t})):o.createElement(g,i({ref:e},l))}));function m(n,e){var t=arguments,r=e&&e.mdxType;if("string"==typeof n||r){var a=t.length,i=new Array(a);i[0]=u;var s={};for(var c in e)hasOwnProperty.call(e,c)&&(s[c]=e[c]);s.originalType=n,s.mdxType="string"==typeof n?n:r,i[1]=s;for(var p=2;p<a;p++)i[p]=t[p];return o.createElement.apply(null,i)}return o.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3125:(n,e,t)=>{t.r(e),t.d(e,{frontMatter:()=>s,contentTitle:()=>c,metadata:()=>p,toc:()=>l,default:()=>u});var o=t(7462),r=t(3366),a=(t(7294),t(3905)),i=["components"],s={},c=void 0,p={unversionedId:"references/tokens/common",id:"references/tokens/common",title:"common",description:"Tramvai tokens for integration and extension @tramvai/module-common.",source:"@site/tmp-docs/references/tokens/common.md",sourceDirName:"references/tokens",slug:"/references/tokens/common",permalink:"/docs/references/tokens/common",editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/tokens/common.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"child-app",permalink:"/docs/references/tokens/child-app"},next:{title:"cookie",permalink:"/docs/references/tokens/cookie"}},l=[{value:"Action tokens",id:"action-tokens",children:[],level:2},{value:"Bundle tokens",id:"bundle-tokens",children:[],level:2},{value:"ComponentRegistry tokens",id:"componentregistry-tokens",children:[],level:2},{value:"Env tokens",id:"env-tokens",children:[],level:2},{value:"Context tokens",id:"context-tokens",children:[],level:2},{value:"Hook tokens",id:"hook-tokens",children:[],level:2},{value:"Logger tokens",id:"logger-tokens",children:[],level:2},{value:"Pubsub tokens",id:"pubsub-tokens",children:[],level:2},{value:"RequestManager tokens",id:"requestmanager-tokens",children:[],level:2},{value:"ResponseManager tokens",id:"responsemanager-tokens",children:[],level:2},{value:"State tokens",id:"state-tokens",children:[],level:2},{value:"Execution tokens",id:"execution-tokens",children:[],level:2}],d={toc:l};function u(n){var e=n.components,t=(0,r.Z)(n,i);return(0,a.kt)("wrapper",(0,o.Z)({},d,t,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Tramvai tokens for integration and extension ",(0,a.kt)("inlineCode",{parentName:"p"},"@tramvai/module-common"),"."),(0,a.kt)("h2",{id:"action-tokens"},"Action tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { Action } from '@tramvai/tokens-core';\nimport type { TramvaiAction } from '@tramvai/types-actions-state-context';\nimport type { ExecutionContext } from './execution';\n\n/**\n * @description\n * Registry for storing actions based on their type\n */\nexport const ACTION_REGISTRY_TOKEN = createToken<ActionsRegistry>('actionRegistry');\n\n/**\n * @description\n * Instance that executes actions\n */\nexport const ACTION_EXECUTION_TOKEN = createToken<ActionExecution>('actionExecution');\n\n/**\n * @description\n * Instance that executes actions on navigations\n */\nexport const ACTION_PAGE_RUNNER_TOKEN = createToken<ActionPageRunner>('actionPageRunner');\n\n/**\n * @description\n * Conditions that specify should action be executing or not\n */\nexport const ACTION_CONDITIONALS = createToken<ActionCondition | ActionCondition[]>(\n  'actionConditionals',\n  {\n    multi: true,\n  }\n);\n\ntype AnyAction = Action | TramvaiAction<any, any, any>;\n\nexport interface ActionsRegistry {\n  add(\n    type: string,\n    actions:\n      | AnyAction\n      | TramvaiAction<any[], any, any>\n      | (AnyAction | TramvaiAction<any[], any, any>)[]\n  ): void;\n\n  get(\n    type: string,\n    addingActions?: (AnyAction | TramvaiAction<any[], any, any>)[]\n  ): (AnyAction | TramvaiAction<any[], any, any>)[];\n  getGlobal(): (AnyAction | TramvaiAction<any[], any, any>)[];\n\n  remove(\n    type: string,\n    actions?:\n      | AnyAction\n      | TramvaiAction<any[], any, any>\n      | (AnyAction | TramvaiAction<any[], any, any>)[]\n  ): void;\n}\n\nexport interface ActionExecution {\n  run<Params extends any[], Result, Deps>(\n    action: TramvaiAction<Params, Result, Deps>,\n    ...params: Params\n  ): Result extends Promise<any> ? Result : Promise<Result>;\n  run<Payload, Result, Deps>(\n    action: Action<Payload, Result, Deps>,\n    payload: Payload\n  ): Result extends Promise<any> ? Result : Promise<Result>;\n\n  runInContext<Params extends any[], Result, Deps>(\n    context: ExecutionContext | null,\n    action: TramvaiAction<Params, Result, Deps>,\n    ...params: Params\n  ): Result extends Promise<any> ? Result : Promise<Result>;\n  runInContext<Payload, Result, Deps>(\n    context: ExecutionContext | null,\n    action: Action<Payload, Result, Deps>,\n    payload: Payload\n  ): Result extends Promise<any> ? Result : Promise<Result>;\n}\n\nexport interface ActionPageRunner {\n  runActions(\n    actions: (Action | TramvaiAction<any, any, any>)[],\n    stopRunAtError?: (error: Error) => boolean\n  ): Promise<any>;\n}\n\nexport interface ActionConditionChecker<State = any> {\n  payload: any;\n  parameters: any;\n  conditions: Record<string, any>;\n  type: 'global' | 'local';\n  allow(): void;\n  setState(value: State): void;\n  getState(): State;\n  forbid(): void;\n}\n\nexport type ActionCondition = {\n  key: string;\n  fn: (checker: ActionConditionChecker) => void;\n};\n\n"))),(0,a.kt)("h2",{id:"bundle-tokens"},"Bundle tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { Bundle } from '@tramvai/tokens-core';\n\n/**\n * @description\n * Bundle Storage. When getting bundle additionally adds actions and components from bundle to according storages\n */\nexport const BUNDLE_MANAGER_TOKEN = createToken<BundleManager>('bundleManager');\n\n/**\n * @description\n * Provides additional bundles to the app.\n * Important! This token doesn't overrides already existing bundles.\n */\nexport const ADDITIONAL_BUNDLE_TOKEN = createToken<{ [key: string]: Bundle }>('additional bundle', {\n  multi: true,\n});\n\nexport interface BundleManager {\n  bundles: Record<string, any>;\n\n  get(name: string, pageComponent: string): Promise<Bundle>;\n\n  has(name: string, pageComponent: string): boolean;\n}\n\n"))),(0,a.kt)("h2",{id:"componentregistry-tokens"},"ComponentRegistry tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { TramvaiComponentDecl } from '@tramvai/react';\n/**\n * @description\n * React components storage.\n * Components in the repository are divided into groups, e.g. you can specify a bundle or a page component as a group key.\n * The entity also allows you to get static component parameters through the `getComponentParam` method (will not work with `lazy` components)\n */\nexport const COMPONENT_REGISTRY_TOKEN = createToken<ComponentRegistry>('componentRegistry');\n\nexport interface ComponentRegistry {\n  components: Record<string, TramvaiComponentDecl>;\n\n  add(name: string, component: TramvaiComponentDecl, group?: string): void;\n\n  get(name: string, group?: string): TramvaiComponentDecl | undefined;\n\n  getComponentParam<T>(param: string, defaultValue: T, component: string, group?: string): T;\n}\n\n"))),(0,a.kt)("h2",{id:"env-tokens"},"Env tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\n\nexport interface EnvironmentManager {\n  get(name: string): string;\n  getInt(name: string, def: number): number;\n  getAll(): Record<string, string>;\n  update(result: Record<string, string>): void;\n  clientUsed(): Record<string, string>;\n  updateClientUsed(result: Record<string, string>): void;\n}\n\n/**\n * @description\n * Instance that used for managing env data on the server and on the client\n */\nexport const ENV_MANAGER_TOKEN = createToken<EnvironmentManager>('environmentManager');\n\n/**\n * @description\n * List of envs that are used by the module or the app.\n * All of the envs specified by that token will be accessible in the code through `environmentManager`\n * ENV_USED_TOKEN format:\n    - `key` - id of the env. At that id the value of the env will be accessible through `environmentManager` and will be loaded from the external sources.\n    - `value` - default low-priority value for env `key`\n    - `optional` - is current env is optional. If `true` the app can work as usual event if the env value were not provided, if `false` - the app will fail to run without env value\n    - `validator` - validation function for passed env value. In case this function returns string it will be used as error message and validation will fail\n    - `dehydrate` - if `false` then env value will not be passed to client and this env can be used only on server\n *\n * @example\n  ```tsx\n  interface EnvParameter {\n    key: string;\n    value?: string;\n    optional?: boolean;\n    validator?: (value: string) => boolean | string;\n    dehydrate?: boolean;\n  }\n  ```\n */\nexport interface EnvParameter {\n  key: string;\n  value?: string;\n  optional?: boolean;\n  validator?: (value: string) => boolean | string;\n  dehydrate?: boolean;\n}\n\nexport const ENV_USED_TOKEN = createToken<EnvParameter[]>('envUsed', { multi: true });\n\n"))),(0,a.kt)("h2",{id:"context-tokens"},"Context tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import type { Container } from '@tinkoff/dippy';\nimport { createToken } from '@tinkoff/dippy';\nimport type { ConsumerContext as BaseConsumerContext } from '@tramvai/types-actions-state-context';\nimport type { PUBSUB_TOKEN } from './pubsub';\n\nexport { PlatformAction } from '@tramvai/types-actions-state-context';\n\n/**\n * @description\n * Context implementation\n */\nexport const CONTEXT_TOKEN = createToken<ConsumerContext>('context');\n\nexport interface ConsumerContext extends BaseConsumerContext {\n  readonly di: Container;\n  readonly pubsub: typeof PUBSUB_TOKEN;\n\n  dehydrate: () => {\n    dispatcher: {\n      stores: Record<string, any>;\n    };\n  };\n}\n\n"))),(0,a.kt)("h2",{id:"hook-tokens"},"Hook tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\n\n/**\n * @description\n * [Hooks documentation](https://tramvai.dev/docs/references/libs/hooks)\n */\nexport const HOOK_TOKEN = createToken<Hooks>('hooks');\n\ntype Hook<TPayload> = (context: any, payload?: TPayload, options?: any) => TPayload;\n\nexport interface Hooks {\n  /**\n   * Register hooks\n   */\n  registerHooks<TPayload>(name: string, list: Hook<TPayload>[] | Hook<TPayload>): void;\n\n  /**\n   * Run sync hook\n   */\n  runHooks<TPayload>(name: string, context: any, payload?: TPayload, options?: any): TPayload;\n\n  /**\n   * Run async hooks\u0417\u0430\u043f\u0443\u0441\u043a \u0430\u0441\u0441\u0438\u0445\u0440\u043e\u043d\u043d\u044b\u0445 \u0445\u0443\u043a\u043e\u0432\n   */\n  runAsyncHooks<TPayload>(name: string, context: any, payload: TPayload, options?: any): TPayload;\n\n  /**\n   * Run promise hooks\n   */\n  runPromiseHooks(\n    name: string,\n    context: any,\n    options?: any\n  ): <TPayload>(payload: TPayload) => Promise<TPayload> | Promise<never>;\n}\n\n"))),(0,a.kt)("h2",{id:"logger-tokens"},"Logger tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import type { Logger } from '@tinkoff/logger';\nimport { createToken } from '@tinkoff/dippy';\n\n/**\n * @description\n * Logger implementation\n */\nexport const LOGGER_TOKEN = createToken<LoggerFactory>('logger');\n\n/**\n * @description\n * Hook to be able to modify logger on initialization\n */\nexport const LOGGER_INIT_HOOK = createToken<LoggerInitHook>('loggerHook');\n\ntype Config = {\n  name: string;\n  [key: string]: any;\n};\n\nexport type LoggerFactory = Logger & ((configOrName: string | Config) => Logger);\n\ntype LoggerInitHook = (logger: LoggerFactory) => void;\n\nexport type { Logger, LogFn, LogArg } from '@tinkoff/logger';\n\n"))),(0,a.kt)("h2",{id:"pubsub-tokens"},"Pubsub tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\n\n/**\n * @description\n * Factory for creating pubsub instances\n */\nexport const PUBSUB_FACTORY_TOKEN = createToken<() => PubSub>('pubsubFactory');\n\n/**\n * @description\n * Singleton pubsub instance\n */\nexport const PUBSUB_TOKEN = createToken<PubSub>('pubsub');\n\n/**\n * @description\n * Request pubsub instance that is created for every client\n */\nexport const ROOT_PUBSUB_TOKEN = createToken<PubSub>('rootPubsub');\n\nexport interface PubSub {\n  subscribe(event: string, fn: (payload?: any) => void): () => boolean;\n\n  publish(event: string, ...args: unknown[]): any;\n}\n\n"))),(0,a.kt)("h2",{id:"requestmanager-tokens"},"RequestManager tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { Url } from '@tinkoff/url';\n\n/**\n * @description\n * Instance for managing client requests (request headers, query-parameters, cookies etc).\n * Mostly used on server, but has partial functional for browser for simplification build isomorphic app\n */\nexport const REQUEST_MANAGER_TOKEN = createToken<RequestManager>('requestManager');\n\nexport interface RequestManager {\n  getBody(): unknown;\n\n  getUrl(): string;\n\n  getParsedUrl(): Url;\n\n  getMethod(): string;\n\n  getCookie(key: string): string;\n\n  getCookies(): Record<string, string>;\n\n  getHeader(key: string): string | string[] | undefined;\n\n  getHeaders(): Record<string, string | string[]>;\n\n  getClientIp(): string;\n\n  getHost(): string;\n}\n\n"))),(0,a.kt)("h2",{id:"responsemanager-tokens"},"ResponseManager tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\n\n/**\n * @description\n * Instance for managing client response (response headers, cookies, response body).\n * Mostly used on server, but has partial functional for browser for simplification build isomorphic app\n */\nexport const RESPONSE_MANAGER_TOKEN = createToken<ResponseManager>('responseManager');\n\nexport interface ResponseManager {\n  getBody(): unknown;\n\n  setBody(value: unknown): void;\n\n  getHeader(key: string): string | string[];\n\n  getHeaders(): Record<string, string | string[]>;\n\n  setHeader(key: string, value: string): void;\n\n  getCookie(key: string): string;\n\n  getCookies(): Record<string, string>;\n\n  setCookie(key: string, value: string): void;\n\n  getStatus(): number;\n\n  setStatus(status: number): void;\n}\n\n"))),(0,a.kt)("h2",{id:"state-tokens"},"State tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type {\n  DispatcherContext,\n  Event,\n  Middleware,\n  Reducer,\n} from '@tramvai/types-actions-state-context';\n\n/**\n * @description\n * dispatcher implementation\n * \u0420\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f dispatcher\n */\nexport const DISPATCHER_TOKEN = createToken('dispatcher');\n\n/**\n * @description\n * dispatcher context implementation\n */\nexport const DISPATCHER_CONTEXT_TOKEN = createToken<DispatcherContext<any>>('dispatcherContext');\n\n/**\n * @description\n * Token for adding stores that were created with createReducer\n */\nexport const COMBINE_REDUCERS = createToken('combineReducers', { multi: true });\n\n/**\n * @description\n * Common app store\n */\nexport const STORE_TOKEN = createToken<Store>('store');\n\n/**\n * @description\n * Custom middlewares for working with store state\n */\nexport const STORE_MIDDLEWARE = createToken<Middleware>('storeMiddleware', { multi: true });\n\n/**\n * @description\n * \u041d\u0430\u0447\u0430\u043b\u044c\u043d\u043e\u0435 \u0441\u043e\u0441\u0442\u043e\u044f\u043d\u0438\u0435 \u0434\u043b\u044f \u043a\u043b\u0438\u0435\u043d\u0442\u0430\n */\nexport const INITIAL_APP_STATE_TOKEN = createToken<{ stores: Record<string, any> }>(\n  'initialAppState'\n);\n\nexport interface Store<State = Record<string, any>> {\n  dispatch: <Payload>(actionOrNameEvent: string | Event<Payload>, payload?: Payload) => Payload;\n\n  subscribe(callback: (state: Record<string, any>) => void): () => void;\n  subscribe<S>(reducer: Reducer<S>, callback: (state: S) => void): () => void;\n\n  getState(): State;\n  getState<S>(reducer: Reducer<S>): S;\n}\n\n"))),(0,a.kt)("h2",{id:"execution-tokens"},"Execution tokens"),(0,a.kt)("p",null,(0,a.kt)("pre",{parentName:"p"},(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { createToken } from '@tinkoff/dippy';\nimport type { AbortController, AbortSignal } from 'node-abort-controller';\n\nexport interface ExecutionContextValues {\n  [key: string]: any | undefined;\n}\n\nexport interface ExecutionContext {\n  name: string;\n  abortSignal: AbortSignal;\n  values: ExecutionContextValues;\n}\n\nexport interface ExecutionContextOptions {\n  name: string;\n  values?: ExecutionContextValues;\n}\n\nexport interface ExecutionContextManager {\n  withContext<T>(\n    parentContext: ExecutionContext,\n    nameOrOptions: string | ExecutionContextOptions,\n    cb: (context: ExecutionContext, abortController: AbortController) => Promise<T>\n  ): Promise<T>;\n}\n\nexport const EXECUTION_CONTEXT_MANAGER_TOKEN = createToken<ExecutionContextManager>(\n  'common ExecutionContextManager'\n);\n\nexport const ROOT_EXECUTION_CONTEXT_TOKEN = createToken<ExecutionContext | null>(\n  'common rootExecutionContext'\n);\n\nexport const COMMAND_LINE_EXECUTION_CONTEXT_TOKEN = createToken<() => ExecutionContext | null>(\n  'common commandLineExecutionContext'\n);\n\n"))))}u.isMDXComponent=!0}}]);