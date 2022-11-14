"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4282],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>c});var o=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,o,i=function(e,t){if(null==e)return{};var n,o,i={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var d=o.createContext({}),s=function(e){var t=o.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return o.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,d=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),m=s(n),c=i,h=m["".concat(d,".").concat(c)]||m[c]||p[c]||a;return n?o.createElement(h,l(l({ref:t},u),{},{components:n})):o.createElement(h,l({ref:t},u))}));function c(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,l=new Array(a);l[0]=m;var r={};for(var d in t)hasOwnProperty.call(t,d)&&(r[d]=t[d]);r.originalType=e,r.mdxType="string"==typeof e?e:i,l[1]=r;for(var s=2;s<a;s++)l[s]=n[s];return o.createElement.apply(null,l)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5012:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>d,default:()=>c,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var o=n(7462),i=n(3366),a=(n(7294),n(3905)),l=["components"],r={id:"module",title:"Module",sidebar_position:4},d=void 0,s={unversionedId:"concepts/module",id:"concepts/module",title:"Module",description:"Modules are the implementation of some limited functionality of the application using the DI system and providers.",source:"@site/tmp-docs/concepts/module.md",sourceDirName:"concepts",slug:"/concepts/module",permalink:"/tramvai/docs/concepts/module",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/concepts/module.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{id:"module",title:"Module",sidebar_position:4},sidebar:"sidebar",previous:{title:"Provider",permalink:"/tramvai/docs/concepts/provider"},next:{title:"CommandLineRunner",permalink:"/tramvai/docs/concepts/command-line-runner"}},u={},p=[{value:"Module life cycle",id:"module-life-cycle",level:2},{value:"Initializing the application",id:"initializing-the-application",level:3},{value:"Handling customer requests",id:"handling-customer-requests",level:3},{value:"Example module",id:"example-module",level:2},{value:"Import in module third party modules",id:"import-in-module-third-party-modules",level:2},{value:"Dynamic modules",id:"dynamic-modules",level:2},{value:"Recommendations for modules",id:"recommendations-for-modules",level:2},{value:"Low coupling",id:"low-coupling",level:3},{value:"Small size",id:"small-size",level:3},{value:"Optional dependencies / configuration",id:"optional-dependencies--configuration",level:3},{value:"Debugging Modules",id:"debugging-modules",level:3},{value:"When to create a module, and when not?",id:"when-to-create-a-module-and-when-not",level:3},{value:"Additional links",id:"additional-links",level:2}],m={toc:p};function c(e){var t=e.components,n=(0,i.Z)(e,l);return(0,a.kt)("wrapper",(0,o.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Modules are the implementation of some limited functionality of the application using the DI system and providers."),(0,a.kt)("p",null,"In general, module is just a list of providers, with some specific logic, for example deduplication by module name."),(0,a.kt)("h2",{id:"module-life-cycle"},"Module life cycle"),(0,a.kt)("h3",{id:"initializing-the-application"},"Initializing the application"),(0,a.kt)("p",null,"When creating an application, all declared ",(0,a.kt)("a",{parentName:"p",href:"/tramvai/docs/concepts/provider"},"providers")," are processed, which will fall into the general ",(0,a.kt)("a",{parentName:"p",href:"/tramvai/docs/concepts/di"},"DI")," container."),(0,a.kt)("h3",{id:"handling-customer-requests"},"Handling customer requests"),(0,a.kt)("p",null,"The module is instantiated once on the server (and used for all clients), after initializing the application, and once in the browser, after loading the page and initializing the client side. These instances contain instances of the classes that were passed to ",(0,a.kt)("inlineCode",{parentName:"p"},"deps")," and will be passed to the module's constructor:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module } from '@tramvai/core';\n\n@Module({\n  providers: [],\n  deps: {\n    log: 'log',\n  },\n})\nclass TestModule {\n  constructor({ log }) {\n    log.info('TestModule created');\n  }\n}\n")),(0,a.kt)("h2",{id:"example-module"},"Example module"),(0,a.kt)("p",null,"The main functionality of the module is in the ",(0,a.kt)("inlineCode",{parentName:"p"},"providers")," list. Each provider either adds new functionality, for example, makes available in all other modules the constant value ",(0,a.kt)("inlineCode",{parentName:"p"},"New")," under the key ",(0,a.kt)("inlineCode",{parentName:"p"},"Token"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: 'Token',\n      useValue: 'New',\n    }),\n  ],\n})\nclass TestModule {}\n")),(0,a.kt)("p",null,"Or it uses tokens from other modules, for example, adding a new environment parameter via the ",(0,a.kt)("inlineCode",{parentName:"p"},"ENV_USED_TOKEN")," token, which will be processed by the EnvModule:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tramvai/core';\nimport { ENV_USED_TOKEN } from '@tramvai/module-common';\n\n@Module({\n  providers: [\n    provide({\n      provide: ENV_USED_TOKEN,\n      multi: true,\n      useValue: [\n        {\n          key: 'ENV_VARIABLE',\n          value: 'New',\n          optional: true,\n        },\n      ],\n    }),\n  ],\n})\nclass TestModule {}\n")),(0,a.kt)("h2",{id:"import-in-module-third-party-modules"},"Import in module third party modules"),(0,a.kt)("p",null,"Modules can be imported internally by providers of third-party modules. Thus, allowing you to build a chain of interconnected modules."),(0,a.kt)("p",null,"Code example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module } from '@tramvai/core';\nimport { LogModule } from '@tramvai/module-log';\n\n@Module({\n  providers: [],\n  imports: [LogModule],\n})\nclass TestModule {}\n")),(0,a.kt)("p",null,"In this case, when initializing TestModule, the providers from the ModuleLogger module and nested imports, if present, will be initialized beforehand."),(0,a.kt)("h2",{id:"dynamic-modules"},"Dynamic modules"),(0,a.kt)("p",null,"Modules can be configured in two ways, and both methods can be used simultaneously:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"passing parameters to ",(0,a.kt)("inlineCode",{parentName:"li"},"module")),(0,a.kt)("li",{parentName:"ul"},"return parameters in the static method ",(0,a.kt)("inlineCode",{parentName:"li"},"forRoot"))),(0,a.kt)("p",null,"An example of a dynamic module, in which we will add dependencies ",(0,a.kt)("inlineCode",{parentName:"p"},"metaGenerate")," to the DI in the first way and ",(0,a.kt)("inlineCode",{parentName:"p"},"meta-list")," in the second, and one of them depends on the other:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module, provide } from '@tramvai/core';\n\n@Module({\n  providers: [\n    provide({\n      provide: 'metaGenerate',\n      useClass: class MetaGenerate {},\n      deps: {\n        list: 'meta-list',\n      },\n    }),\n  ],\n})\nexport class SeoModule {\n  static forRoot({ metaList }: { metaList?: string[] }) {\n    if (metaList) {\n      return {\n        mainModule: SeoModule,\n        providers: [\n          provide({\n            provide: 'meta-list',\n            useValue: metaList,\n          }),\n        ],\n      };\n    }\n  }\n}\n")),(0,a.kt)("p",null,"A static method must return an object with an interface:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"type staticModule = {\n  mainModule: Module; // Link to the main module, from which we will extract all the basic information\n  providers: Provider []; // Providers to be added to DI\n};\n")),(0,a.kt)("p",null,"Now this module contains a static method ",(0,a.kt)("inlineCode",{parentName:"p"},"forRoot")," which adds additional ",(0,a.kt)("inlineCode",{parentName:"p"},"providers")," to the standard ",(0,a.kt)("inlineCode",{parentName:"p"},"SeoModule")," module. Without this construct, we would need to explicitly write providers in the application. All data that has been added to the ",(0,a.kt)("inlineCode",{parentName:"p"},"SeoModule")," will be inherited and expanded."),(0,a.kt)("p",null,"Now we can call our static method in the application or in other modules. And the result of execution of ",(0,a.kt)("inlineCode",{parentName:"p"},"forRoot")," will be added to",(0,a.kt)("inlineCode",{parentName:"p"}," DI")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Module } from '@tramvai/core';\nimport { SeoModule } from './SeoModule';\nimport { metaFromConfig } from './metaFromConfig';\n\n@Module({\n  imports: [SeoModule.forRoot([metaFromConfig])],\n})\nexport class ApplicationModule {}\n")),(0,a.kt)("p",null,"It should be borne in mind that the ",(0,a.kt)("inlineCode",{parentName:"p"},"forRoot")," construction should only simplify the use of the module and we should also maintain the functionality of the module through the usual configuration of ",(0,a.kt)("inlineCode",{parentName:"p"},"providers")),(0,a.kt)("h2",{id:"recommendations-for-modules"},"Recommendations for modules"),(0,a.kt)("h3",{id:"low-coupling"},"Low coupling"),(0,a.kt)("p",null,"It is advisable to build modules so that they do not directly depend on other modules. Coupling only needs to be interface-based and replaceable. Otherwise, it will not be possible to simply replace modules and refactor."),(0,a.kt)("h3",{id:"small-size"},"Small size"),(0,a.kt)("p",null,"The larger the module, the more code it contains inside and the more potentially it has connections and reasons for changes."),(0,a.kt)("p",null,"For this reason, the module will be more difficult to change and there will be a greater chance of breaking functionality when changed."),(0,a.kt)("p",null,"It is desirable that the modules implement some small part of the functionality."),(0,a.kt)("h3",{id:"optional-dependencies--configuration"},"Optional dependencies / configuration"),(0,a.kt)("p",null,"It is convenient to use the module if it does not require any configuration and works normally by default. But, if it is clear that for some applications and cases additional behavior setting will be needed, then it is advisable to use optional dependencies that can be defined in the application."),(0,a.kt)("p",null,"It is worth marking non-critical functionality with optional dependencies, which the module does not necessarily need. So that you can not implement interfaces and throw out some of the logic. For example, logging"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"// @todo example of optional dependency\n")),(0,a.kt)("h3",{id:"debugging-modules"},"Debugging Modules"),(0,a.kt)("p",null,"It is recommended to specify in the module documentation the unique identifier / namespace of the logger, which is used in this module. Example module id for ",(0,a.kt)("inlineCode",{parentName:"p"},"@tramvai/module-server"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"const log = logger ('server'); // get a logger instance by LOGGER_TOKEN token\n")),(0,a.kt)("h3",{id:"when-to-create-a-module-and-when-not"},"When to create a module, and when not?"),(0,a.kt)("p",null,"Add providers in ",(0,a.kt)("inlineCode",{parentName:"p"},"createApp")," in a simple cases, for example:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"When you need to configure any module"),(0,a.kt)("li",{parentName:"ul"},"When you need one simple provider and module will be overhead")),(0,a.kt)("p",null,"In any other cases, our recommendation to create an independend modules for any features, for example:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"metrics"),(0,a.kt)("li",{parentName:"ul"},"logger"),(0,a.kt)("li",{parentName:"ul"},"auth strategy"),(0,a.kt)("li",{parentName:"ul"},"API client"),(0,a.kt)("li",{parentName:"ul"},"fonts"),(0,a.kt)("li",{parentName:"ul"},"domain logic")),(0,a.kt)("h2",{id:"additional-links"},"Additional links"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"About ",(0,a.kt)("a",{parentName:"li",href:"/tramvai/docs/concepts/di"},"DI container")),(0,a.kt)("li",{parentName:"ul"},"About ",(0,a.kt)("a",{parentName:"li",href:"/tramvai/docs/concepts/provider"},"providers"))))}c.isMDXComponent=!0}}]);