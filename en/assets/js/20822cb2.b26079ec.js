(self.webpackChunk=self.webpackChunk||[]).push([[3251],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>m,kt:()=>c});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),d=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},m=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),p=d(n),c=r,f=p["".concat(s,".").concat(c)]||p[c]||u[c]||o;return n?a.createElement(f,i(i({ref:t},m),{},{components:n})):a.createElement(f,i({ref:t},m))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},9513:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>s,metadata:()=>d,toc:()=>m,default:()=>p});var a=n(2122),r=n(9756),o=(n(7294),n(3905)),i=["components"],l={id:"seo",title:"seo"},s=void 0,d={unversionedId:"references/modules/seo",id:"references/modules/seo",isDocsHomePage:!1,title:"seo",description:"The module internally takes data from the page configuration, generates meta tags and adds to the page.",source:"@site/tmp-docs/references/modules/seo.md",sourceDirName:"references/modules",slug:"/references/modules/seo",permalink:"/en/docs/references/modules/seo",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/seo.md",version:"current",frontMatter:{id:"seo",title:"seo"},sidebar:"docs",previous:{title:"router",permalink:"/en/docs/references/modules/router"},next:{title:"sentry",permalink:"/en/docs/references/modules/sentry"}},m=[{value:"Installation",id:"installation",children:[]},{value:"Tramvai integration",id:"tramvai-integration",children:[]},{value:"Basic data sources",id:"basic-data-sources",children:[]},{value:"Connecting additional data sources",id:"connecting-additional-data-sources",children:[]},{value:"Setting seo data dynamically",id:"setting-seo-data-dynamically",children:[]},{value:"Replacing default seo data",id:"replacing-default-seo-data",children:[]},{value:"Meta parameters",id:"meta-parameters",children:[]},{value:"How to",id:"how-to",children:[{value:"Testing",id:"testing",children:[]}]}],u={toc:m};function p(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The module internally takes data from the page configuration, generates meta tags and adds to the page."),(0,o.kt)("h2",{id:"installation"},"Installation"),(0,o.kt)("p",null,"You need to install ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/module-seo")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm i @tramvai/module-seo\n")),(0,o.kt)("p",null,"And connect to the project"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { SeoModule } from '@tramvai/module-seo';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [...SeoModule],\n});\n")),(0,o.kt)("h2",{id:"tramvai-integration"},"Tramvai integration"),(0,o.kt)("p",null,"The module does not add a public api to the DI.\nThe seo renderer uses the ",(0,o.kt)("inlineCode",{parentName:"p"},"@tramvai/module-render")," capabilities to insert code into the html page."),(0,o.kt)("h2",{id:"basic-data-sources"},"Basic data sources"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"default")," - list of basic default parameters"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"config/meta")," - a list of meta parameters from the route configuration")),(0,o.kt)("h2",{id:"connecting-additional-data-sources"},"Connecting additional data sources"),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"@tinkoff/meta-tags-generate")," library allows you to connect additional data sources for meta tags with the ability to overwrite basic ones."),(0,o.kt)("p",null,"To do this, you need to define a multi-provider ",(0,o.kt)("inlineCode",{parentName:"p"},"META_UPDATER_TOKEN"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp, provide } from '@tramvai/core';\nimport { SeoModule, META_UPDATER_TOKEN, META_PRIORITY_ROUTE } from '@tramvai/module-seo';\n\nconst metaSpecial = (meta) => {\n  meta.updateMeta(META_PRIORITY_ROUTE, {\n    // priority - 10\n    title: 'title', // key/value in meta,\n    metaCustom: {\n      // more information about the format [in the documentation](references/libs/meta-tags-generate.md)\n      tag: 'meta',\n      attributes: {\n        name: 'metaCustomNameAttribute',\n        content: 'metaCustomContent',\n      },\n    },\n  });\n};\n\ncreateApp({\n  providers: [\n    provide({\n      // or add via provider\n      provide: META_UPDATER_TOKEN,\n      multi: true,\n      useValue: metaSpecial,\n    }),\n  ],\n  modules: [\n    SeoModule.forRoot({\n      list: [metaSpecial],\n    }),\n  ],\n});\n")),(0,o.kt)("p",null,"Each source is a function that takes a meta and allows you to extend the meta through a ",(0,o.kt)("em",{parentName:"p"},"updateMeta")," call.\nThe priority is a positive number, for each specific meta key the value with the highest priority will be used, the value with priority 0 denotes the default value."),(0,o.kt)("p",null,"More about the format ",(0,o.kt)("a",{parentName:"p",href:"/en/docs/references/libs/meta-tags-generate"},"in the documentation")),(0,o.kt)("h2",{id:"setting-seo-data-dynamically"},"Setting seo data dynamically"),(0,o.kt)("p",null,"If you want to install seo in a page action or in one of the commandLineRunner steps, you can explicitly use the ",(0,o.kt)("inlineCode",{parentName:"p"},"MetaWalk")," entity from the ",(0,o.kt)("inlineCode",{parentName:"p"},"@tinkoff/meta-tags-generate")," lib."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createAction } from '@tramvai/core';\nimport { META_WALK_TOKEN, META_PRIORITY_APP } from '@tramvai/module-seo';\n\ncreateAction({\n  name: 'action',\n  fn: async (context, payload, { meta }) => {\n    meta.updateMeta(META_PRIORITY_APP, {\n      title: 'WoW, such dynamic!',\n    });\n  },\n  deps: {\n    meta: META_WALK_TOKEN,\n  },\n  conditions: {\n    always: true,\n  },\n});\n")),(0,o.kt)("h2",{id:"replacing-default-seo-data"},"Replacing default seo data"),(0,o.kt)("p",null,"The SEO module comes with a default package of seo tags. If they do not suit you, you can replace the provider's implementation and put your own data:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { SeoModule, META_DEFAULT_TOKEN } from '@tramvai/module-seo';\n\ncreateApp({\n  providers: [\n    // Change metaDefaultPack token implementation\n    {\n      provide: META_DEFAULT_TOKEN,\n      useValue: { title: 'E Corp' },\n    },\n  ],\n  modules: [SeoModule],\n});\n")),(0,o.kt)("p",null,"After that we will substitute the new default parameters"),(0,o.kt)("h2",{id:"meta-parameters"},"Meta parameters"),(0,o.kt)("p",null,"The library already predefines some basic parameters for convenient use when configuring routers."),(0,o.kt)("p",null,"And we can use meta parameters like ",(0,o.kt)("inlineCode",{parentName:"p"},"title: 'Tinkoff'"),"."),(0,o.kt)("p",null,"See the list of such converters in the ",(0,o.kt)("inlineCode",{parentName:"p"},"src/converters/converters.ts")," file"),(0,o.kt)("h2",{id:"how-to"},"How to"),(0,o.kt)("h3",{id:"testing"},"Testing"),(0,o.kt)("h4",{id:"testing-work-with-meta_updater_token-and-meta_default_token"},"Testing work with META_UPDATER_TOKEN and META_DEFAULT_TOKEN"),(0,o.kt)("p",null,"If you have a module or providers that define ",(0,o.kt)("inlineCode",{parentName:"p"},"META_UPDATER_TOKEN")," or ",(0,o.kt)("inlineCode",{parentName:"p"},"META_DEFAULT_TOKEN")," then it is convenient to use special utilities to test them separately"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"import { Module, provide } from '@tramvai/core';\nimport { testMetaUpdater } from '@tramvai/module-seo/tests';\nimport { META_PRIORITY_APP, META_DEFAULT_TOKEN, META_UPDATER_TOKEN } from '@tramvai/module-seo';\n\ndescribe('testMetaUpdater', () => {\n  it('modules', async () => {\n    const metaUpdater = jest.fn<\n      ReturnType<typeof META_UPDATER_TOKEN>,\n      Parameters<typeof META_UPDATER_TOKEN>\n    >((walker) => {\n      walker.updateMeta(META_PRIORITY_APP, {\n        title: 'test title',\n      });\n    });\n    @Module({\n      providers: [\n        provide({\n          provide: META_UPDATER_TOKEN,\n          multi: true,\n          useValue: metaUpdater,\n        }),\n      ],\n    })\n    class CustomModule {}\n    const { renderMeta } = testMetaUpdater({\n      modules: [CustomModule],\n    });\n\n    const { render, metaWalk } = renderMeta();\n\n    expect(metaWalk.get('title').value).toBe('test title');\n    expect(render).toMatch('<title data-meta-dynamic=\"true\">test title</title>');\n  });\n\n  it('providers', async () => {\n    const { renderMeta } = testMetaUpdater({\n      providers: [\n        provide({\n          provide: META_DEFAULT_TOKEN,\n          useValue: {\n            title: 'default title',\n          },\n        }),\n      ],\n    });\n\n    const { render } = renderMeta();\n\n    expect(render).toMatch('<title data-meta-dynamic=\"true\">default title</title>');\n  });\n});\n")))}p.isMDXComponent=!0}}]);