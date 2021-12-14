(self.webpackChunk=self.webpackChunk||[]).push([[506],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>c,kt:()=>h});var o=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,o,l=function(e,t){if(null==e)return{};var n,o,l={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var p=o.createContext({}),s=function(e){var t=o.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},c=function(e){var t=s(e.components);return o.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},u=o.forwardRef((function(e,t){var n=e.components,l=e.mdxType,i=e.originalType,p=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),u=s(n),h=l,f=u["".concat(p,".").concat(h)]||u[h]||d[h]||i;return n?o.createElement(f,r(r({ref:t},c),{},{components:n})):o.createElement(f,r({ref:t},c))}));function h(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var i=n.length,r=new Array(i);r[0]=u;var a={};for(var p in t)hasOwnProperty.call(t,p)&&(a[p]=t[p]);a.originalType=e,a.mdxType="string"==typeof e?e:l,r[1]=a;for(var s=2;s<i;s++)r[s]=n[s];return o.createElement.apply(null,r)}return o.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9719:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>a,contentTitle:()=>p,metadata:()=>s,toc:()=>c,default:()=>u});var o=n(2122),l=n(9756),i=(n(7294),n(3905)),r=["components"],a={id:"how-to-enable-polyfills",title:"How to enable polyfills?"},p=void 0,s={unversionedId:"how-to/how-to-enable-polyfills",id:"how-to/how-to-enable-polyfills",isDocsHomePage:!1,title:"How to enable polyfills?",description:"Tramvai has polyfills integration:",source:"@site/tmp-docs/how-to/how-to-enable-polyfills.md",sourceDirName:"how-to",slug:"/how-to/how-to-enable-polyfills",permalink:"/en/docs/how-to/how-to-enable-polyfills",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/how-to/how-to-enable-polyfills.md",version:"current",frontMatter:{id:"how-to-enable-polyfills",title:"How to enable polyfills?"},sidebar:"docs",previous:{title:"How to update tramvai?",permalink:"/en/docs/how-to/tramvai-update"},next:{title:"Execution of actions depending on conditions",permalink:"/en/docs/how-to/actions-conditions"}},c=[{value:"Setup",id:"setup",children:[]},{value:"How polyfills loading works",id:"how-polyfills-loading-works",children:[]},{value:"Replacing the polyfills loading check",id:"replacing-the-polyfills-loading-check",children:[{value:"Why would it be necessary?",id:"why-would-it-be-necessary",children:[]},{value:"Important tips",id:"important-tips",children:[]}]},{value:"Replacing the check",id:"replacing-the-check",children:[]}],d={toc:c};function u(e){var t=e.components,n=(0,l.Z)(e,r);return(0,i.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Tramvai has polyfills integration:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"there is a separate library ",(0,i.kt)("inlineCode",{parentName:"li"},"@tinkoff/pack-polyfills")," that contains all the necessary polyfills"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"@tramvai/cli")," build polyfills in a separate file"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"@tramvai/module-render")," contains code that only loads polyfills where they are needed")),(0,i.kt)("h2",{id:"setup"},"Setup"),(0,i.kt)("h4",{id:"install-polyfills-pack"},"Install polyfills pack"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save @tinkoff/pack-polyfills\n")),(0,i.kt)("h4",{id:"create-a-file-polyfillts"},"Create a file polyfill.ts"),(0,i.kt)("p",null,"You need to create a file ",(0,i.kt)("inlineCode",{parentName:"p"},"polyfill.ts")," inside your project, for example ",(0,i.kt)("inlineCode",{parentName:"p"},"src/polyfill.ts")," and connect the polyfills inside:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import '@tinkoff/pack-polyfills';\n")),(0,i.kt)("h4",{id:"set-up-tramvaicli"},"Set up @tramvai/cli"),(0,i.kt)("p",null,"After that, we need to tell ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," that our project has polyfills.\nTo do this, in ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai.json")," we add for our project the line ",(0,i.kt)("inlineCode",{parentName:"p"},'"polyfill: "src/polyfill.ts"')," in ",(0,i.kt)("inlineCode",{parentName:"p"},"projects[APP_ID].commands.build.options.polyfill")," example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "projects": {\n    "pfphome": {\n      "name": "pfphome",\n      "root": "src",\n      "type": "application",\n      "commands": {\n        "build": {\n          "options": {\n            "server": "src/index.ts",\n            "vendor": "src/vendor.ts",\n            "polyfill": "src/polyfill.ts"\n          }\n        }\n      }\n    }\n  }\n}\n\n')),(0,i.kt)("h2",{id:"how-polyfills-loading-works"},"How polyfills loading works"),(0,i.kt)("p",null,"On the ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," side, we have configured to build the polyfills into a separate file, so it doesn't mix with the main code.\nOn every build we will have a file with polyfills."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/en/docs/references/modules/render"},"module-render")," if it finds polyfills in the build, then for each client embeds inline code that checks the availability of features in the browser and if the browser does not support any of the features, then we consider the browser is legacy and load polyfills. An example of a check: ",(0,i.kt)("inlineCode",{parentName:"p"},"!window.Promise.prototype.finally || !window.URL || !window.URLSearchParams || !window.AbortController || !window.IntersectionObserver || !Object.fromEntries'")),(0,i.kt)("h2",{id:"replacing-the-polyfills-loading-check"},"Replacing the polyfills loading check"),(0,i.kt)("h3",{id:"why-would-it-be-necessary"},"Why would it be necessary?"),(0,i.kt)("p",null,"If you do not fit the standard check for supported features in the browser and polyfills do not load in browsers where they should.\nIn this case, it is better to create issue and we will update the check, or you can replace the check with another."),(0,i.kt)("h3",{id:"important-tips"},"Important tips"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"POLYFILL_CONDITION")," should return true if the browser does not support some features"),(0,i.kt)("li",{parentName:"ul"},"You should not load polyfiles into all browsers"),(0,i.kt)("li",{parentName:"ul"},"It is better to extend ",(0,i.kt)("inlineCode",{parentName:"li"},"DEFAULT_POLYFILL_CONDITION")," with additional checks, rather than replacing it")),(0,i.kt)("h2",{id:"replacing-the-check"},"Replacing the check"),(0,i.kt)("p",null,"To do this, we need to set provider ",(0,i.kt)("inlineCode",{parentName:"p"},"POLYFILL_CONDITION"),", which is in ",(0,i.kt)("inlineCode",{parentName:"p"},"import { POLYFILL_CONDITION } from '@tramvai/module-render'")," and pass a new line."),(0,i.kt)("p",null,"Example: This is a synthetic example, but suppose we want to additionally check for the presence of window.Promise in the browser, to do this we extend ",(0,i.kt)("inlineCode",{parentName:"p"},"DEFAULT_POLYFILL_CONDITION")," string.\nThe resulting expression should return true if the browsers do not support the feature."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { POLYFILL_CONDITION, DEFAULT_POLYFILL_CONDITION } from '@tramvai/module-render';\nimport { provide } from '@tramvai/core';\n\nconst provider = provide({\n  provide: POLYFILL_CONDITION,\n  useValue: `${DEFAULT_POLYFILL_CONDITION} || !window.Promise`,\n});\n")))}u.isMDXComponent=!0}}]);