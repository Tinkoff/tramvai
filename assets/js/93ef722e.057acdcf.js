(self.webpackChunk=self.webpackChunk||[]).push([[6433],{3905:(e,r,t)=>{"use strict";t.d(r,{Zo:()=>p,kt:()=>u});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?l(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),g=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=g(e.components);return n.createElement(s.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},c=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,l=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=g(t),u=o,m=c["".concat(s,".").concat(u)]||c[u]||d[u]||l;return t?n.createElement(m,a(a({ref:r},p),{},{components:t})):n.createElement(m,a({ref:r},p))}));function u(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var l=t.length,a=new Array(l);a[0]=c;var i={};for(var s in r)hasOwnProperty.call(r,s)&&(i[s]=r[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var g=2;g<l;g++)a[g]=t[g];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}c.displayName="MDXCreateElement"},6461:(e,r,t)=>{"use strict";t.r(r),t.d(r,{frontMatter:()=>i,contentTitle:()=>s,metadata:()=>g,toc:()=>p,default:()=>c});var n=t(2122),o=t(9756),l=(t(7294),t(3905)),a=["components"],i={id:"logger",title:"logger"},s=void 0,g={unversionedId:"references/libs/logger",id:"references/libs/logger",isDocsHomePage:!1,title:"logger",description:"Logging library",source:"@site/tmp-docs/references/libs/logger.md",sourceDirName:"references/libs",slug:"/references/libs/logger",permalink:"/docs/references/libs/logger",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/logger.md",version:"current",frontMatter:{id:"logger",title:"logger"},sidebar:"docs",previous:{title:"is-modern-lib",permalink:"/docs/references/libs/is-modern-lib"},next:{title:"Layout factory",permalink:"/docs/references/libs/layout-factory"}},p=[{value:"Installation",id:"installation",children:[]},{value:"Api",id:"api",children:[{value:"Child loggers",id:"child-loggers",children:[]},{value:"Display logs",id:"display-logs",children:[]},{value:"Configuration",id:"configuration",children:[]},{value:"Extend logger functionality",id:"extend-logger-functionality",children:[]},{value:"Bundled Reporters",id:"bundled-reporters",children:[]}]},{value:"How to",id:"how-to",children:[{value:"Base usage",id:"base-usage",children:[]}]},{value:"How to log properly",id:"how-to-log-properly",children:[]},{value:"Troubleshooting",id:"troubleshooting",children:[{value:"I use logger in my Nest.js application, and it does not work",id:"i-use-logger-in-my-nestjs-application-and-it-does-not-work",children:[]}]}],d={toc:p};function c(e){var r=e.components,t=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Logging library"),(0,l.kt)("h2",{id:"installation"},"Installation"),(0,l.kt)("p",null,"Install using package manager, e.g. for npm:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save @tinkoff/logger\n")),(0,l.kt)("p",null,"for yarn:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tinkoff/logger\n")),(0,l.kt)("h2",{id:"api"},"Api"),(0,l.kt)("h3",{id:"child-loggers"},"Child loggers"),(0,l.kt)("p",null,"You can create child loggers using method ",(0,l.kt)("inlineCode",{parentName:"p"},".child")," of the current logger instance. Child logger will inherit parent logger settings and can override these settings."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"const log = logger({ name: 'test' });\n\nconst childLog = log.child('child'); // as this logger is child logger the result name will be 'test.child'\n\nconst childLogWithDefaults = log.child({\n  name: 'withDefaults',\n  defaults: {\n    // defaults might be used to specify properties which will be merged to log objects logged with this logger\n    child: true,\n  },\n});\n\nconst childLogWithOverrides = log.child({\n  name: 'override',\n  reporters: [], // may override settings of the parent logger\n  filters: [],\n  extensions: [],\n});\n")),(0,l.kt)("h3",{id:"display-logs"},"Display logs"),(0,l.kt)("p",null,"Library allows to specify used logging level, show/hide logs for specific instances of the logger, reset display settings."),(0,l.kt)("p",null,"By default, ",(0,l.kt)("inlineCode",{parentName:"p"},"error")," level is used for every logger."),(0,l.kt)("p",null,"Settings display level higher than ",(0,l.kt)("inlineCode",{parentName:"p"},"error")," for single logger, e.g. ",(0,l.kt)("inlineCode",{parentName:"p"},"logger.enable('info', 'my-logger')"),", overrides logging level only for ",(0,l.kt)("inlineCode",{parentName:"p"},"my-logger"),"."),(0,l.kt)("p",null,"It is impossible to set logging level lower than common level, e.g. when using common logging level equal to ",(0,l.kt)("inlineCode",{parentName:"p"},"error")," calls to ",(0,l.kt)("inlineCode",{parentName:"p"},"logger.enable('fatal', 'my-logger')")," changes nothing."),(0,l.kt)("p",null,"All subsequent setup for log displaying are preserved, e.g. subsequent calls ",(0,l.kt)("inlineCode",{parentName:"p"},"logger.enable('info', 'my-logger')")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"logger.enable('trace', 'yet-another-logger')")," will enable logs to both logger according to their settings."),(0,l.kt)("h4",{id:"display-logs-on-server"},"Display logs on server"),(0,l.kt)("p",null,"For control of displaying logs on server environment variables ",(0,l.kt)("inlineCode",{parentName:"p"},"LOG_LEVEL")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"LOG_ENABLE")," are used:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"LOG_LEVEL = trace | debug | info | warn | error | fatal - enables displaying logs for specified level and higher. E.g.:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"if ",(0,l.kt)("inlineCode",{parentName:"li"},"LOG_LEVEL=info")," then all logs of levels info, warn, error, fatal will be showed."))),(0,l.kt)("li",{parentName:"ul"},"LOG_ENABLE = ",(0,l.kt)("inlineCode",{parentName:"li"},"${name}")," | ",(0,l.kt)("inlineCode",{parentName:"li"},"${level}:${name}")," - let to enable displaying logs for a specific name and level. It can accept several entries that are passed as comma-separated. E.g.:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"if ",(0,l.kt)("inlineCode",{parentName:"li"},"LOG_ENABLE=server")," then all logs for name ",(0,l.kt)("inlineCode",{parentName:"li"},"server")," will be displayed"),(0,l.kt)("li",{parentName:"ul"},"if ",(0,l.kt)("inlineCode",{parentName:"li"},"LOG_ENABLE=trace:server*")," then for logs with name server only ",(0,l.kt)("inlineCode",{parentName:"li"},"trace")," level will be showed"),(0,l.kt)("li",{parentName:"ul"},"if ",(0,l.kt)("inlineCode",{parentName:"li"},"LOG_ENABLE=info:server,client,trace:shared")," then displaying logs will be enabled for specified loggers using rules above")))),(0,l.kt)("h4",{id:"display-logs-in-browser"},"Display logs in browser"),(0,l.kt)("p",null,"In browser display settings are stored in localStorage, so it will work even after page reloads. In order to reset settings you may clear localStorage. For convenient usage a special object ",(0,l.kt)("inlineCode",{parentName:"p"},"logger")," is added to window object in the browser."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"logger === window.logger;\n\nlogger.setLevel('warn'); // enable displaying log for level `warn` and higher\n\nlogger.enable('info', 'test'); // enable displaying logs for logger `test` with level `info` \u0442\u0430\u043a\u0436\u0435 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c \u0432\u044b\u0432\u043e\u0434 \u043b\u043e\u0433\u0433\u0435\u0440\u0430 test \u0443\u0440\u043e\u0432\u043d\u044f info\n\nlogger.enable('my-logger'); // show all logs for logger `my-logger`\n\nlogger.enable('perf*'); // enable all logs with name starting with `perf`\n\nlogger.disable('my-logger'); // disable displaying logs for `my-logger`\n\nlogger.clear(); // reset all settings\n")),(0,l.kt)("h3",{id:"configuration"},"Configuration"),(0,l.kt)("h4",{id:"local-logger-configuration"},"Local logger configuration"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { logger } from '@tinkoff/logger';\n\nconst log = logger({ name: 'my-logger' }); // name is required field in order to identify logs\nconst log = logger('my-logger'); // same as above\n\nconst log = logger({\n  name: 'remote-logger',\n  defaults: {\n    remote: true,\n  },\n});\n")),(0,l.kt)("p",null,"Options:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"name[='log']")," - name of the new logger")),(0,l.kt)("h3",{id:"extend-logger-functionality"},"Extend logger functionality"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"@tinkoff/logger")," might be extended using next entities:"),(0,l.kt)("h4",{id:"filter"},"Filter"),(0,l.kt)("p",null,"Filters can disable logging for specific logs base on inner conditions"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { logger } from '@tinkoff/logger';\n\ninterface Filter {\n  filter(logObj: LogObj): boolean;\n}\n\nlogger.addFilter(filter as Filter); // add new filter to list of previously added filters\nlogger.setFilters([filter1, filter2]); // replace current filters with passed list. that allows to override default settings\n")),(0,l.kt)("h4",{id:"extension"},"Extension"),(0,l.kt)("p",null,"Extensions can extend or override log object before making actual logging"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { logger } from '@tinkoff/logger';\n\ninterface Extension {\n  extend(logObj: LogObj): LogObj;\n}\n\nlogger.addExtension(extension as Extension); // add new extension to list of previously added extensions\nlogger.setExtensions([extension1, extension2]); // replace current extensions with passed list. that allows to override default settings\n")),(0,l.kt)("h4",{id:"reporter"},"Reporter"),(0,l.kt)("p",null,"Reporters can change the way logs are showed (json, fancy logs in browser, send logs to remote api)."),(0,l.kt)("p",null,"Be default, enabled only reporters for displaying logs in console based on ",(0,l.kt)("a",{parentName:"p",href:"#display-logs"},"display logs settings")),(0,l.kt)("p",null,"Reporters are depends of logger level settings as reporters will not be called if level of the current log are lower than display logs setting"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { logger } from '@tinkoff/logger';\n\ninterface Reporter {\n  log(logObj: LogObj): void;\n}\n\nlogger.addReporter(reporter as Reporter); // add new reporter to list of previously added reporters\nlogger.setReporters([reporter1, reporter2]); // replace current reporters with passed list. that allows to override default settings\n")),(0,l.kt)("h4",{id:"beforereporter"},"BeforeReporter"),(0,l.kt)("p",null,"Same as usual ",(0,l.kt)("inlineCode",{parentName:"p"},"Reporter")," but ",(0,l.kt)("inlineCode",{parentName:"p"},"BeforeReporter")," are called unconditionally for every log and get called before any other extension."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { logger } from '@tinkoff/logger';\n\ninterface Reporter {\n  log(logObj: LogObj): void;\n}\n\nlogger.addBeforeReporter(reporter as Reporter); // add new beforeReporter to list of previously added beforeReporter\nlogger.setBeforeReporters([reporter1, reporter2]); // replace current beforeReporters with passed list. that allows to override default settings\n")),(0,l.kt)("h3",{id:"bundled-reporters"},"Bundled Reporters"),(0,l.kt)("h4",{id:"browserreporter"},"BrowserReporter"),(0,l.kt)("p",null,"Standard reporter to show logs in browser"),(0,l.kt)("h4",{id:"nodedevreporter"},"NodeDevReporter"),(0,l.kt)("p",null,"Standard reporter to showing logs in the server console with handy formatting"),(0,l.kt)("p",null,"Used by default in dev-mode or if environment variable ",(0,l.kt)("inlineCode",{parentName:"p"},"process.env.DEBUG_PLAIN")," is specified."),(0,l.kt)("h4",{id:"nodebasicreporter"},"NodeBasicReporter"),(0,l.kt)("p",null,"Minimal reporter to showing logs in the server console."),(0,l.kt)("h4",{id:"jsonreporter"},"JSONReporter"),(0,l.kt)("p",null,"Show logs in json format."),(0,l.kt)("h4",{id:"remotereporter"},"RemoteReporter"),(0,l.kt)("p",null,"Sends logs on remote api."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"import { logger, RemoteReporter } from '@tinkoff/logger';\n\nconst remote = new RemoteReporter({\n  requestCount: 1, // number of parallel request\n  emitLevels: { error: true, fatal: true }, // log levels which will be send to api\n  async makeRequest(logObj) {\n    // function that accepts log object and sends data to api\n    return await request();\n  },\n});\n\nlogger.addReporter(remote);\n\nconst log = logger({ name: 'test-remote' }); // settings for remote will be inherited from RemoteReporter itself\n\nlog.error('error'); // will be sent to api\nlog.info('test'); // will not be sent to api\n\nconst remoteLog = logger({ name: 'remote-for-all', remote: true }); // `remote` allows to override settings from RemoteReporter and send logs unconditionally\n\nremoteLog.info('test'); // will be sent to api\nremoteLog.debug('test'); // will be sent to api\n\nconst traceLog = logger({ name: 'log-trace', emitLevels: { trace: true } }); // override RemoteReporter settings\n\ntraceLog.trace('test'); // will be sent to api\ntraceLog.error('test'); // will not be sent to api\n")),(0,l.kt)("h2",{id:"how-to"},"How to"),(0,l.kt)("h3",{id:"base-usage"},"Base usage"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import logger from '@tinkoff/logger'; // import logger\n\nconst log = logger('my-component'); // create new logger with an id `my-component`. This id will be added for every log at field `name`. Using unique ids will help to find source of the logs\n\n// logs can be created with different levels\nlog.trace('trace');\nlog.debug('debug');\nlog.info({ event: 'client-visited', message: 'client visited tinkoff.ru' });\nlog.warn('warn');\nlog.error({ event: 'form-send-error', error: new Error('form') });\nlog.fatal('fatal error');\n")),(0,l.kt)("p",null,"More about logging level and what do they mean in ",(0,l.kt)("a",{parentName:"p",href:"https://www.scalyr.com/blog/logging-levels/"},"the article"),"."),(0,l.kt)("h2",{id:"how-to-log-properly"},"How to log properly"),(0,l.kt)("p",null,"To log properly it is suitable to use next format:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"interface Log {\n  event?: string; // unique id of event which is might be easily found in log management tool\n  message?: string; // log description\n  error?: Error; // error if appropriate\n  [key]: any; // any other data\n}\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"In case of logging simple text just use string template to pass result string to logger. For json format this string will be available in the ",(0,l.kt)("inlineCode",{parentName:"li"},"message")," props.")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"logger.info('hello logger'); // identical to logger.info({ message: 'hello logger' });\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"In order to log some object or many arguments, compile they together to single object:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"logger.warn({\n  message: 'be warn',\n  event: 'my-warning',\n  ...obj1,\n  ...obj2,\n  a: 1,\n  b: 2,\n});\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"In order to log error object either pass the error with the props ",(0,l.kt)("inlineCode",{parentName:"li"},"error")," or pass it to logger as only argument")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"logger.error({\n  error: new Error('message'),\n});\n\nlogger.error(new Error('message'));\nlogger.error(new Error('typeError'), 'custom error message'); // a special format to redefine error message\n")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"In case of several arguments were passed to logger then only the first argument will be proceeded with the rules from above while all of the other arguments will be passed as an ",(0,l.kt)("inlineCode",{parentName:"li"},"args")," props")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-tsx"},"logger.debug(\n  {\n    event: 'watch',\n    data: 'some data',\n  },\n  'arg2',\n  'arg3'\n);\n")),(0,l.kt)("p",null,"These formatting rules are handful to connect logging to external tools like kibana, splunk. So it is desirable to follow these rules, otherwise it may lead to troubles with searching and analyzing your logs."),(0,l.kt)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,l.kt)("h3",{id:"i-use-logger-in-my-nestjs-application-and-it-does-not-work"},"I use logger in my Nest.js application, and it does not work"),(0,l.kt)("p",null,"Be sure that you set all required environment variable (",(0,l.kt)("inlineCode",{parentName:"p"},"LOG_LEVEL")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"LOG_ENABLE"),") before app initialization.\nIf you set all variable in ",(0,l.kt)("inlineCode",{parentName:"p"},".env")," and parse them via Nest.js's ",(0,l.kt)("a",{parentName:"p",href:"https://docs.nestjs.com/techniques/configuration"},"ConfigModule"),",\nthey will not be available in the ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/TinkoffCreditSystems/tramvai/blob/main/packages/libs/logger/src/server.ts#L13-L14"},"logger initialization phase"),".\n",(0,l.kt)("inlineCode",{parentName:"p"},"ConfigModule")," parses ",(0,l.kt)("inlineCode",{parentName:"p"},".env"),"-file later."),(0,l.kt)("p",null,"Also, check ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/TinkoffCreditSystems/tramvai/blob/main/packages/libs/logger/src/server.ts#L34"},"here"),"\nthat ",(0,l.kt)("inlineCode",{parentName:"p"},"DEBUG_PLAIN")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"NODE_ENV")," variables are available."))}c.isMDXComponent=!0}}]);