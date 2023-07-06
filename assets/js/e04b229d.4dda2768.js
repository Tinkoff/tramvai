"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7240],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>m});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=a.createContext({}),d=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},s=function(e){var n=d(e.components);return a.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},u=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=d(t),m=o,h=u["".concat(l,".").concat(m)]||u[m]||c[m]||r;return t?a.createElement(h,i(i({ref:n},s),{},{components:t})):a.createElement(h,i({ref:n},s))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var r=t.length,i=new Array(r);i[0]=u;var p={};for(var l in n)hasOwnProperty.call(n,l)&&(p[l]=n[l]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var d=2;d<r;d++)i[d]=t[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5471:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>p,metadata:()=>d,toc:()=>c});var a=t(7462),o=t(3366),r=(t(7294),t(3905)),i=["components"],p={id:"connect",title:"Connect Child App and Root App"},l=void 0,d={unversionedId:"features/child-app/connect",id:"features/child-app/connect",title:"Connect Child App and Root App",description:"For now, we have a new shiny Child App, with perfect UI and all possible features like Actions, modules and providers, stores, commands, etc. Next, we need to connect it with Root App.",source:"@site/tmp-docs/03-features/015-child-app/010-connect.md",sourceDirName:"03-features/015-child-app",slug:"/features/child-app/connect",permalink:"/docs/features/child-app/connect",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/03-features/015-child-app/010-connect.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{id:"connect",title:"Connect Child App and Root App"},sidebar:"sidebar",previous:{title:"Dependency Injection",permalink:"/docs/features/child-app/di"},next:{title:"React Query",permalink:"/docs/features/child-app/react-query"}},s={},c=[{value:"Installation",id:"installation",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Base URL",id:"base-url",level:3},{value:"Rendering",id:"rendering",level:2},{value:"Preloading",id:"preloading",level:2},{value:"Preload automatically for page or layout",id:"preload-automatically-for-page-or-layout",level:3},{value:"Preload manually",id:"preload-manually",level:3},{value:"Development",id:"development",level:2},{value:"Multiple Child Apps",id:"multiple-child-apps",level:3},{value:"Custom debug configuration",id:"custom-debug-configuration",level:3}],u={toc:c};function m(e){var n=e.components,t=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"For now, we have a new shiny Child App, with perfect UI and all possible features like Actions, modules and providers, stores, commands, etc. Next, we need to connect it with Root App."),(0,r.kt)("h2",{id:"installation"},"Installation"),(0,r.kt)("p",null,"First, you need to install ",(0,r.kt)("inlineCode",{parentName:"p"},"@tramvai/module-child-app")," module in your Root App:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"npx tramvai add @tramvai/module-child-app\n")),(0,r.kt)("p",null,"Then, connect ",(0,r.kt)("inlineCode",{parentName:"p"},"RouterChildAppModule")," from this module in your ",(0,r.kt)("inlineCode",{parentName:"p"},"createApp")," function:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { createApp } from '@tramvai/core';\nimport { ChildAppModule } from '@tramvai/module-child-app';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ChildAppModule],\n});\n")),(0,r.kt)("h2",{id:"configuration"},"Configuration"),(0,r.kt)("p",null,"At first, we need to provide a ",(0,r.kt)("strong",{parentName:"p"},"complete map")," of Child Apps and their versions, which will be used in our Root App. This can be done with ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_RESOLUTION_CONFIGS_TOKEN")," token."),(0,r.kt)("p",null,"Also, we need to provide a ",(0,r.kt)("strong",{parentName:"p"},"base url")," for Child Apps assets, which will be used in our Root App. This can be done with ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_RESOLVE_BASE_URL_TOKEN")," token or ",(0,r.kt)("a",{parentName:"p",href:"#base-url"},"few other methods"),"."),(0,r.kt)("p",null,"For example, our Root App has one Child App - ",(0,r.kt)("inlineCode",{parentName:"p"},"fancy-child"),", resolution config will look like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { createApp, provide } from '@tramvai/core';\nimport {\n  ChildAppModule,\n  CHILD_APP_RESOLVE_BASE_URL_TOKEN,\n  CHILD_APP_RESOLUTION_CONFIGS_TOKEN,\n} from '@tramvai/module-child-app';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ChildAppModule],\n  providers: [\n    provide({\n      provide: CHILD_APP_RESOLVE_BASE_URL_TOKEN,\n      useValue: 'https://my.cdn.dev/child-app/',\n    }),\n    provide({\n      provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,\n      useValue: [\n        {\n          // name of the child-app\n          name: 'fancy-child',\n          byTag: {\n            latest: {\n              // current version for the child app for tag `latest`\n              version: '1.0.0',\n              // remove this property if you already add CSS for this Child App\n              withoutCss: true,\n            },\n          },\n        },\n      ],\n    }),\n  ],\n});\n")),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"All benefits of microfrontends approach can be available if you will have remote configuration for Child Apps - because you will be able to release new Child Apps versions independend from Root App release cycle."),(0,r.kt)("p",{parentName:"admonition"},"You can achieve this with ",(0,r.kt)("strong",{parentName:"p"},"async")," ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_RESOLUTION_CONFIGS_TOKEN")," provider, where you can fetch configuration from remote API, s3 file storage, etc."),(0,r.kt)("p",{parentName:"admonition"},"In this case, it is important to cache this requests for short time, because it will be executed on every page rendering.")),(0,r.kt)("h3",{id:"base-url"},"Base URL"),(0,r.kt)("p",null,"You can provide global base url for all Child Apps, and unique base url for any of Child Apps."),(0,r.kt)("p",null,"Global url can be provided with few methods:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"CHILD_APP_RESOLVE_BASE_URL_TOKEN")," provider in Root App code"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"CHILD_APP_EXTERNAL_URL")," env variable, passed to Root App")),(0,r.kt)("p",null,"Specific url can be provided in Child App configuration in ",(0,r.kt)("inlineCode",{parentName:"p"},"baseUrl")," property:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const provider = provide({\n  provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,\n  useValue: [\n    {\n      name: 'fancy-child',\n      byTag: {\n        latest: {\n          version: '1.0.0',\n          withoutCss: true,\n        },\n      },\n      // highlight-next-line\n      baseUrl: 'https://my.cdn.dev/fancy-child/',\n    },\n  ],\n});\n")),(0,r.kt)("h2",{id:"rendering"},"Rendering"),(0,r.kt)("p",null,"We definitely want to render our Child App in one of Root App pages. For this, we need to use ",(0,r.kt)("inlineCode",{parentName:"p"},"<ChildApp />")," component:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="routes/index.tsx"',title:'"routes/index.tsx"'},"import type { PageComponent } from '@tramvai/react';\nimport { ChildApp } from '@tramvai/module-child-app';\n\nconst MainPage: PageComponent = () => {\n  return (\n    <>\n      <h1>Main Page</h1>\n      <ChildApp name=\"fancy-child\" />\n    </>\n  );\n};\n\nexport default MainPage;\n")),(0,r.kt)("h2",{id:"preloading"},"Preloading"),(0,r.kt)("p",null,"By default, this Child App will be rendered only client-side, because we don't know about this microfrontend before started rendering page component server-side. It is not optimal for SEO, UX and performance, so we need to provide list of Child Apps for preloading. This can be done automatically or manually. The same logic is applied for running ",(0,r.kt)("inlineCode",{parentName:"p"},"spa")," line list while transitioning by spa navigation on client - ",(0,r.kt)("inlineCode",{parentName:"p"},"spa")," line list will be executed only for Child Apps that were preloaded on the next page of navigation."),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"If you really need to render Child App client-side only, you can render ",(0,r.kt)("inlineCode",{parentName:"p"},"<ChildApp />")," only when some state was changed on component mount in ",(0,r.kt)("inlineCode",{parentName:"p"},"useEffect")," hook")),(0,r.kt)("h3",{id:"preload-automatically-for-page-or-layout"},"Preload automatically for page or layout"),(0,r.kt)("p",null,"You can provide list of Child Apps for preloading in ",(0,r.kt)("inlineCode",{parentName:"p"},"childApps")," property of page or layout component:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-tsx",metastring:'title="routes/index.tsx"',title:'"routes/index.tsx"'},"import type { PageComponent } from '@tramvai/react';\nimport { ChildApp } from '@tramvai/module-child-app';\n\nconst MainPage: PageComponent = () => {\n  return (\n    <>\n      <h1>Main Page</h1>\n      <ChildApp name=\"fancy-child\" />\n    </>\n  );\n};\n\n// highlight-next-line\nMainPage.childApps = [{ name: 'fancy-child' }];\n\nexport default MainPage;\n")),(0,r.kt)("h3",{id:"preload-manually"},"Preload manually"),(0,r.kt)("p",null,"You can preload any child-app manually with the help of ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_PRELOAD_MANAGER_TOKEN"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { provide, commandLineListTokens } from '@tramvai/core';\nimport { CHILD_APP_PRELOAD_MANAGER_TOKEN } from '@tramvai/module-child-app';\n\nconst provider = provide({\n  provide: commandLineListTokens.resolvePageDeps,\n  useFactory: ({ preloadManager }) => {\n    return function preloadFancyChildApp() {\n      return preloadManager.preload({ name: 'fancy-child' });\n    };\n  },\n  deps: {\n    preloadManager: CHILD_APP_PRELOAD_MANAGER_TOKEN,\n  },\n});\n")),(0,r.kt)("h2",{id:"development"},"Development"),(0,r.kt)("p",null,"By default, Child App assets in development mode will be served on ",(0,r.kt)("inlineCode",{parentName:"p"},"http://localhost:4040/"),". Root App will use the same url in development mode and when Child App is passed in ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_DEBUG")," env variable."),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Run child-app using cli"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"yarn tramvai start child-app\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Run Root App with ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_DEBUG")," environment variable"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"CHILD_APP_DEBUG=child-app npx tramvai start root-app\n")))),(0,r.kt)("h3",{id:"multiple-child-apps"},"Multiple Child Apps"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Run somehow multiple Child Apps. They should be started on different ports.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"And either pass ",(0,r.kt)("inlineCode",{parentName:"p"},"Base Url")," showed from ",(0,r.kt)("inlineCode",{parentName:"p"},"tramvai")," CLI in terminal (after ",(0,r.kt)("inlineCode",{parentName:"p"},"start")," command) as url to debug every Child App"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"CHILD_APP_DEBUG=child-app1=baseUrl1;child-app2=baseUrl2 npx tramvai start root-app\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Or implement proxy on default ",(0,r.kt)("inlineCode",{parentName:"p"},"http:://localhost:4040/")," yourself which redirects to concrete server by url"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"CHILD_APP_DEBUG=child-app1;child-app2 npx tramvai start root-app\n")))),(0,r.kt)("h3",{id:"custom-debug-configuration"},"Custom debug configuration"),(0,r.kt)("p",null,"You may specify a full config to debug to a specific Child App:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Provide token ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_RESOLUTION_CONFIGS_TOKEN")," for needed Child Apps add special tag ",(0,r.kt)("inlineCode",{parentName:"p"},"debug"),":"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const provider = provide({\n  provide: CHILD_APP_RESOLUTION_CONFIGS_TOKEN,\n  useValue: [\n    {\n      name: 'fancy-child',\n      byTag: {\n        latest: {\n          version: '1.0.0',\n          withoutCss: true,\n        },\n        // highlight-start\n        debug: {\n          baseUrl: '...url',\n          version: '...version',\n          client: {},\n          server: {},\n          css: {},\n        },\n        // highlight-end\n      },\n    },\n  ],\n});\n"))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Run Root App with ",(0,r.kt)("inlineCode",{parentName:"p"},"CHILD_APP_DEBUG")," environment variable with value of Child App names needed to debug"))))}m.isMDXComponent=!0}}]);