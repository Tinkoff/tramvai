"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[259],{3905:(e,n,t)=>{t.d(n,{Zo:()=>d,kt:()=>m});var a=t(7294);function l(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){l(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,l=function(e,n){if(null==e)return{};var t,a,l={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(l[t]=e[t]);return l}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(l[t]=e[t])}return l}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},d=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},c=a.forwardRef((function(e,n){var t=e.components,l=e.mdxType,i=e.originalType,s=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),c=p(t),m=l,k=c["".concat(s,".").concat(m)]||c[m]||u[m]||i;return t?a.createElement(k,r(r({ref:n},d),{},{components:t})):a.createElement(k,r({ref:n},d))}));function m(e,n){var t=arguments,l=n&&n.mdxType;if("string"==typeof e||l){var i=t.length,r=new Array(i);r[0]=c;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o.mdxType="string"==typeof e?e:l,r[1]=o;for(var p=2;p<i;p++)r[p]=t[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},5162:(e,n,t)=>{t.d(n,{Z:()=>r});var a=t(7294),l=t(6010);const i="tabItem_Ymn6";function r(e){var n=e.children,t=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",className:(0,l.Z)(i,r),hidden:t},n)}},5488:(e,n,t)=>{t.d(n,{Z:()=>m});var a=t(7462),l=t(7294),i=t(6010),r=t(2389),o=t(7392),s=t(7094),p=t(2466);const d="tabList__CuJ",u="tabItem_LNqP";function c(e){var n,t,r=e.lazy,c=e.block,m=e.defaultValue,k=e.values,b=e.groupId,f=e.className,h=l.Children.map(e.children,(function(e){if((0,l.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=k?k:h.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),v=(0,o.l)(g,(function(e,n){return e.value===n.value}));if(v.length>0)throw new Error('Docusaurus error: Duplicate values "'+v.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var N=null===m?m:null!=(n=null!=m?m:null==(t=h.find((function(e){return e.props.default})))?void 0:t.props.value)?n:h[0].props.value;if(null!==N&&!g.some((function(e){return e.value===N})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+N+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var w=(0,s.U)(),y=w.tabGroupChoices,C=w.setTabGroupChoices,j=(0,l.useState)(N),x=j[0],S=j[1],T=[],E=(0,p.o5)().blockElementScrollPositionUntilNextRender;if(null!=b){var O=y[b];null!=O&&O!==x&&g.some((function(e){return e.value===O}))&&S(O)}var I=function(e){var n=e.currentTarget,t=T.indexOf(n),a=g[t].value;a!==x&&(E(n),S(a),null!=b&&C(b,String(a)))},B=function(e){var n,t=null;switch(e.key){case"ArrowRight":var a,l=T.indexOf(e.currentTarget)+1;t=null!=(a=T[l])?a:T[0];break;case"ArrowLeft":var i,r=T.indexOf(e.currentTarget)-1;t=null!=(i=T[r])?i:T[T.length-1]}null==(n=t)||n.focus()};return l.createElement("div",{className:(0,i.Z)("tabs-container",d)},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":c},f)},g.map((function(e){var n=e.value,t=e.label,r=e.attributes;return l.createElement("li",(0,a.Z)({role:"tab",tabIndex:x===n?0:-1,"aria-selected":x===n,key:n,ref:function(e){return T.push(e)},onKeyDown:B,onFocus:I,onClick:I},r,{className:(0,i.Z)("tabs__item",u,null==r?void 0:r.className,{"tabs__item--active":x===n})}),null!=t?t:n)}))),r?(0,l.cloneElement)(h.filter((function(e){return e.props.value===x}))[0],{className:"margin-top--md"}):l.createElement("div",{className:"margin-top--md"},h.map((function(e,n){return(0,l.cloneElement)(e,{key:n,hidden:e.props.value!==x})}))))}function m(e){var n=(0,r.Z)();return l.createElement(c,(0,a.Z)({key:String(n)},e))}},4961:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>b,frontMatter:()=>p,metadata:()=>u,toc:()=>m});var a=t(7462),l=t(3366),i=(t(7294),t(3905)),r=t(5488),o=t(5162),s=["components"],p={},d=void 0,u={unversionedId:"references/tools/build",id:"references/tools/build",title:"build",description:"Library for building production ready bundles for packages written in TypeScript targetting next environments:",source:"@site/tmp-docs/references/tools/build.md",sourceDirName:"references/tools",slug:"/references/tools/build",permalink:"/docs/references/tools/build",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/tools/build.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"server",permalink:"/docs/references/tokens/server"},next:{title:"check-versions",permalink:"/docs/references/tools/check-versions"}},c={},m=[{value:"Installation",id:"installation",level:2},{value:"Get started",id:"get-started",level:2},{value:"Explanation",id:"explanation",level:2},{value:"NodeJS bundle in CommonJs format",id:"nodejs-bundle-in-commonjs-format",level:3},{value:"Bundle for bundlers (Webpack, etc.) in ES modules format",id:"bundle-for-bundlers-webpack-etc-in-es-modules-format",level:3},{value:"Bundle for browsers",id:"bundle-for-browsers",level:3},{value:"Copy static assets",id:"copy-static-assets",level:3},{value:"Build and copy migrations",id:"build-and-copy-migrations",level:3},{value:"CLI",id:"cli",level:2},{value:"Single build",id:"single-build",level:3},{value:"Build in watch mode",id:"build-in-watch-mode",level:3},{value:"Copy static assets",id:"copy-static-assets-1",level:3},{value:"Available flags",id:"available-flags",level:3},{value:"JavaScript API",id:"javascript-api",level:2},{value:"TramvaiBuild",id:"tramvaibuild",level:3},{value:"Build",id:"build",level:3},{value:"Copy static files",id:"copy-static-files",level:3},{value:"How to",id:"how-to",level:2},{value:"Build separate bundle for browsers",id:"build-separate-bundle-for-browsers",level:3},{value:"Replace specific module for browser bundle",id:"replace-specific-module-for-browser-bundle",level:3},{value:"Build all of the packages in monorepo in watch mode",id:"build-all-of-the-packages-in-monorepo-in-watch-mode",level:3},{value:"Import module only under some circumstances or put module to separate chunk",id:"import-module-only-under-some-circumstances-or-put-module-to-separate-chunk",level:3},{value:"Use JSON in package",id:"use-json-in-package",level:3},{value:"Use assets file in the package (e.g. css, svg)",id:"use-assets-file-in-the-package-eg-css-svg",level:3},{value:"Use css-modules",id:"use-css-modules",level:3}],k={toc:m};function b(e){var n=e.components,t=(0,l.Z)(e,s);return(0,i.kt)("wrapper",(0,a.Z)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Library for building ",(0,i.kt)("inlineCode",{parentName:"p"},"production")," ready bundles for packages written in TypeScript targetting next environments:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"NodeJS"),(0,i.kt)("li",{parentName:"ul"},"Bundlers (Webpack, etc.)"),(0,i.kt)("li",{parentName:"ul"},"Browsers")),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,"Install ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," first:"),(0,i.kt)(r.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install --save-dev @tramvai/build\n"))),(0,i.kt)(o.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add --dev @tramvai/build\n")))),(0,i.kt)("h2",{id:"get-started"},"Get started"),(0,i.kt)("p",null,"Add necessary fields to ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "main": "lib/index.js",\n  "module": "lib/index.es.js",\n  "typings": "lib/index.d.ts",\n  "sideEffects": false,\n  "files": [\n    "lib"\n  ]\n}\n')),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},'"main": "lib/index.js"')," based on that field lib calculates entry point for the build and it will be ",(0,i.kt)("inlineCode",{parentName:"p"},'"src/index.ts"')," in this case")),(0,i.kt)("p",null,"Create ",(0,i.kt)("inlineCode",{parentName:"p"},"tsconfig.json"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "compilerOptions": {\n    "moduleResolution": "node",\n    "module": "ESNext",\n    "target": "ES2015",\n    "allowJs": true,\n    "declaration": true,\n    "sourceMap": true,\n    "importHelpers": true,\n    "resolveJsonModule": true,\n    "allowSyntheticDefaultImports": true,\n    "esModuleInterop": true,\n    "skipLibCheck": true,\n    "jsx": "react-jsx",\n    "rootDir": "./src",\n    "outDir": "./lib",\n    "declarationDir": "./lib",\n    "types": ["node"],\n    "lib": [\n      "es2015",\n      "es2016",\n      "es2017",\n      "es2018",\n      "dom"\n    ]\n  },\n  "include": ["./src"],\n  "exclude": [\n    "**/*.spec.ts",\n    "**/*.spec.tsx",\n    "**/*.test.ts",\n    "**/*.test.tsx"\n  ]\n}\n')),(0,i.kt)("p",null,"Add to ",(0,i.kt)("inlineCode",{parentName:"p"},"dependencies")," library ",(0,i.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/tslib"},"tslib"),":"),(0,i.kt)(r.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install tslib\n"))),(0,i.kt)(o.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add tslib\n")))),(0,i.kt)("p",null,"Build package with command ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai-build"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-build --preserveModules --forPublish\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"with flag ",(0,i.kt)("inlineCode",{parentName:"p"},"--preserveModules")," tramvai-build wil preserve file structure of library modules for better tree-shaking")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"with flag ",(0,i.kt)("inlineCode",{parentName:"p"},"--forPublish")," tramvai-build replaces some fields in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," in order to make built package usable in the end apps, for example ",(0,i.kt)("inlineCode",{parentName:"p"},'"browser"')," field with object value can be updated`")),(0,i.kt)("h2",{id:"explanation"},"Explanation"),(0,i.kt)("p",null,"The main purpose for the lib is the effective ",(0,i.kt)("inlineCode",{parentName:"p"},"production")," build for TypeScript package using ",(0,i.kt)("a",{parentName:"p",href:"https://rollupjs.org/"},"rollup"),", with ",(0,i.kt)("a",{parentName:"p",href:"https://rollupjs.org/guide/en/#rollupwatch"},"watch")," mode support."),(0,i.kt)("p",null,"Such builds, especially for monorepositories with big number of packages, can take a long time and are not very comfortable to work. Thats why, for the ",(0,i.kt)("inlineCode",{parentName:"p"},"development")," environment it is preferred to use ",(0,i.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/compiler-options.html"},"tsc")," with ",(0,i.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/project-references.html"},"project references")," and ",(0,i.kt)("a",{parentName:"p",href:"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag"},"incremental build"),"."),(0,i.kt)("p",null,"Recommended and automatically generated ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," for ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," allows apps to use packages that were built either with ",(0,i.kt)("inlineCode",{parentName:"p"},"tsc"),", or with ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," without any additional steps."),(0,i.kt)("p",null,"All of the built bundles will contain ",(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," standard code, it is expected that they will be bundled to ",(0,i.kt)("inlineCode",{parentName:"p"},"ES5")," using bundler (Webpack, etc.) with configured transpilation through ",(0,i.kt)("inlineCode",{parentName:"p"},"babel")," for packages inside ",(0,i.kt)("inlineCode",{parentName:"p"},"node_modules"),", written in modern JS."),(0,i.kt)("h3",{id:"nodejs-bundle-in-commonjs-format"},"NodeJS bundle in CommonJs format"),(0,i.kt)("p",null,"NodeJS before 12 version hasn't supported ES modules or supported it only behind special flag. ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," generates bundle in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," standard in ",(0,i.kt)("inlineCode",{parentName:"p"},"CommonJS")," format automatically. Name of the result bundle is taken from field ",(0,i.kt)("inlineCode",{parentName:"p"},"main")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),", e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"lib/index.js"),"."),(0,i.kt)("p",null,"When bundling package in the app using ",(0,i.kt)("inlineCode",{parentName:"p"},"webpack")," with option ",(0,i.kt)("inlineCode",{parentName:"p"},"target: 'node'")," this ",(0,i.kt)("inlineCode",{parentName:"p"},"CommonJS")," bundle probably will not be used as webpack will prefer to use ",(0,i.kt)("inlineCode",{parentName:"p"},"module")," field while resolving source code."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"It is expected that bundle from field ",(0,i.kt)("inlineCode",{parentName:"p"},'"main"')," will be resolved only by ",(0,i.kt)("inlineCode",{parentName:"p"},"NodeJS")," itself while bundlers will use bundle from field ",(0,i.kt)("inlineCode",{parentName:"p"},'"module"'))),(0,i.kt)("h3",{id:"bundle-for-bundlers-webpack-etc-in-es-modules-format"},"Bundle for bundlers (Webpack, etc.) in ES modules format"),(0,i.kt)("p",null,"Modern bundlers support ES modules and non-standard field ",(0,i.kt)("inlineCode",{parentName:"p"},'"module"')," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),". ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," generates bundle in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," standard in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES modules")," format automatically. Name of the result bundle is calculates from field ",(0,i.kt)("inlineCode",{parentName:"p"},"main")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," by adding postfix ",(0,i.kt)("inlineCode",{parentName:"p"},".es")," e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"lib/index.es.js"),"."),(0,i.kt)("p",null,"If build was called with flag ",(0,i.kt)("inlineCode",{parentName:"p"},"--forPublish")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," will be added new field ",(0,i.kt)("inlineCode",{parentName:"p"},'"module": "lib/index.es.js"'),"."),(0,i.kt)("p",null,"When bundling package in the app through ",(0,i.kt)("inlineCode",{parentName:"p"},"webpack")," with option ",(0,i.kt)("inlineCode",{parentName:"p"},"target: 'node'")," bundle from field ",(0,i.kt)("inlineCode",{parentName:"p"},"module")," will have higher priority over bundle from ",(0,i.kt)("inlineCode",{parentName:"p"},"main"),"."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," code standard is generated as it is expected that bundle from field ",(0,i.kt)("inlineCode",{parentName:"p"},'"module"')," will be resolved by bundler with configured transpilation through ",(0,i.kt)("inlineCode",{parentName:"p"},"babel")," for packages inside ",(0,i.kt)("inlineCode",{parentName:"p"},"node_modules"),", written in modern JS. Why we still prefer to use ",(0,i.kt)("inlineCode",{parentName:"p"},"ES5")," code over ",(0,i.kt)("inlineCode",{parentName:"p"},"ES2019"),"? Apparently, code in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES5")," is still notably faster on NodeJS server. In the same time output bundle size is not important on server.")),(0,i.kt)("h3",{id:"bundle-for-browsers"},"Bundle for browsers"),(0,i.kt)("p",null,"Modern bundlers support ES modules and non-standard field ",(0,i.kt)("inlineCode",{parentName:"p"},'"browser"')," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),". When field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," in specified in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/build")," will generate bundle in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," standard in ",(0,i.kt)("inlineCode",{parentName:"p"},"ES modules")," format."),(0,i.kt)("p",null,"If field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," is defined as a string then this string determines entry point to ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," bundle and its name. E.g. when ",(0,i.kt)("inlineCode",{parentName:"p"},'"browser": "lib/browser.js"')," entry point will be ",(0,i.kt)("inlineCode",{parentName:"p"},"src/browser.ts")," and bundle will have a name ",(0,i.kt)("inlineCode",{parentName:"p"},"lib/browser.js"),"."),(0,i.kt)("p",null,"Otherwise, if field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," is defined as an object and build was called with flag ",(0,i.kt)("inlineCode",{parentName:"p"},"--forPublish")," then name is defined by the field ",(0,i.kt)("inlineCode",{parentName:"p"},"main")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," with adding postfix ",(0,i.kt)("inlineCode",{parentName:"p"},".browser")," e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"lib/index.browser.js"),". After that to field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," new property will be added as pointer for bundlers to bundle for the browser, instead of the field ",(0,i.kt)("inlineCode",{parentName:"p"},"module"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "browser": {\n    ...,\n    "./index.es.js": "./index.browser.js"\n  }\n}\n')),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Specification for the field ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/defunctzombie/package-browser-field-spec"},"browser"))),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"ES2019")," code standard is generated as it is expected that bundle from ",(0,i.kt)("inlineCode",{parentName:"p"},'"browser"')," field will be resolved by bundler with configured transpilation through ",(0,i.kt)("inlineCode",{parentName:"p"},"babel")," for packages inside ",(0,i.kt)("inlineCode",{parentName:"p"},"node_modules")," written in modern JS to the code according to the ",(0,i.kt)("inlineCode",{parentName:"p"},"browserslist")," config.")),(0,i.kt)("p",null,"When building our package in the app with ",(0,i.kt)("inlineCode",{parentName:"p"},"webpack")," with option ",(0,i.kt)("inlineCode",{parentName:"p"},"target: 'web'")," bundle from field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," will be prioritized over field ",(0,i.kt)("inlineCode",{parentName:"p"},"module"),"."),(0,i.kt)("h3",{id:"copy-static-assets"},"Copy static assets"),(0,i.kt)("p",null,"For every build, all of the non JS/TS/JSON files (e.g. CSS, fonts, images) are copied to the output bundle preserving their relative paths (e.g. ",(0,i.kt)("inlineCode",{parentName:"p"},"src/css/style.css")," -> ",(0,i.kt)("inlineCode",{parentName:"p"},"lib/css/style.css"),"). You can disable such copying by using flag ",(0,i.kt)("inlineCode",{parentName:"p"},"copyStaticAssets"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-build --copyStaticAssets false\n")),(0,i.kt)("h3",{id:"build-and-copy-migrations"},"Build and copy migrations"),(0,i.kt)("p",null,"When directory ",(0,i.kt)("inlineCode",{parentName:"p"},"migrations")," has any code files they are considered as migration files. These files will be compiled to ",(0,i.kt)("inlineCode",{parentName:"p"},".js")," and copied to directory ",(0,i.kt)("inlineCode",{parentName:"p"},"__migrations__"),"."),(0,i.kt)("h2",{id:"cli"},"CLI"),(0,i.kt)("h3",{id:"single-build"},"Single build"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-build\n")),(0,i.kt)("h3",{id:"build-in-watch-mode"},"Build in watch mode"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-build --watch\n")),(0,i.kt)("h3",{id:"copy-static-assets-1"},"Copy static assets"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-copy\n")),(0,i.kt)("h3",{id:"available-flags"},"Available flags"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai-build --help\n")),(0,i.kt)("h2",{id:"javascript-api"},"JavaScript API"),(0,i.kt)("h3",{id:"tramvaibuild"},"TramvaiBuild"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"TramvaiBuild")," is used to configure build process for following usage."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { TramvaiBuild } from '@tramvai/build';\n\nnew TramvaiBuild(options);\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Available options:")),(0,i.kt)("p",null,(0,i.kt)("pre",{parentName:"p"},(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"export type Options = {\n  sourceDir: string;\n  copyStaticAssets: boolean;\n  watchMode?: boolean;\n  forPublish?: boolean;\n  preserveModules?: boolean;\n};\n\n"))),(0,i.kt)("h3",{id:"build"},"Build"),(0,i.kt)("p",null,"Method ",(0,i.kt)("inlineCode",{parentName:"p"},"TramvaiBuild.start")," builds package either single time or in ",(0,i.kt)("inlineCode",{parentName:"p"},"watch")," mode depending on configuration of ",(0,i.kt)("inlineCode",{parentName:"p"},"TramvaiBuild"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { TramvaiBuild } from '@tramvai/build';\n\nnew TramvaiBuild(options).start();\n")),(0,i.kt)("h3",{id:"copy-static-files"},"Copy static files"),(0,i.kt)("p",null,"Method ",(0,i.kt)("inlineCode",{parentName:"p"},"TramvaiBuild.copy")," copies static assets to the ",(0,i.kt)("inlineCode",{parentName:"p"},"output")," directory:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { TramvaiBuild } from '@tramvai/build';\n\nnew TramvaiBuild(options).copy();\n")),(0,i.kt)("h2",{id:"how-to"},"How to"),(0,i.kt)("h3",{id:"build-separate-bundle-for-browsers"},"Build separate bundle for browsers"),(0,i.kt)("p",null,"Let's say we have to entry points. One is for the server - ",(0,i.kt)("inlineCode",{parentName:"p"},"src/server.ts")," and for the client - ",(0,i.kt)("inlineCode",{parentName:"p"},"src/browser.ts"),". In this case we should set field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," the next way:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "main": "lib/server.js",\n  "browser": "lib/browser.js"\n}\n')),(0,i.kt)("p",null,"After build for publication we will get next ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "main": "lib/server.js",\n  "browser": "lib/browser.js",\n  "typings": "lib/server.d.ts",\n  "module": "lib/server.es.js"\n}\n')),(0,i.kt)("h3",{id:"replace-specific-module-for-browser-bundle"},"Replace specific module for browser bundle"),(0,i.kt)("p",null,"Let's say we have one entry point - ",(0,i.kt)("inlineCode",{parentName:"p"},"src/index.ts")," and a module ",(0,i.kt)("inlineCode",{parentName:"p"},"src/external.ts")," we want to replace by ",(0,i.kt)("inlineCode",{parentName:"p"},"src/external.browser.ts"),". In this case we should set field ",(0,i.kt)("inlineCode",{parentName:"p"},"browser")," in ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," the next way:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "main": "lib/index.js",\n  "browser": {\n    "./lib/external.js": "./lib/external.browser.js"\n  }\n}\n')),(0,i.kt)("p",null,"After build for publication we will get next ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "main": "lib/index.js",\n  "browser": {\n    "./lib/external.js": "./lib/external.browser.js",\n    "./lib/index.es.js": "./lib/index.browser.js"\n  },\n  "typings": "lib/index.d.ts",\n  "module": "lib/index.es.js"\n}\n')),(0,i.kt)("h3",{id:"build-all-of-the-packages-in-monorepo-in-watch-mode"},"Build all of the packages in monorepo in watch mode"),(0,i.kt)("p",null,"@TODO + link to ",(0,i.kt)("inlineCode",{parentName:"p"},"@tinkoff/fix-ts-references")),(0,i.kt)("h3",{id:"import-module-only-under-some-circumstances-or-put-module-to-separate-chunk"},"Import module only under some circumstances or put module to separate chunk"),(0,i.kt)("p",null,"Instead of static imports you can use dynamic import or require. In this case imported module will be build in the separate chunk. Later this chunk can be added by bundler to the generated bundle and if dynamic import was used it will be separate chunk as well after bundlers build, but when using require separate chunk will not be generated."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"let func = noop;\n\nif (process.env.NODE_ENV !== 'production') {\n  func = require('./realFunc').func;\n}\n\nexport { func };\n")),(0,i.kt)("h3",{id:"use-json-in-package"},"Use JSON in package"),(0,i.kt)("p",null,"By default in root ",(0,i.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," option ",(0,i.kt)("inlineCode",{parentName:"p"},"resolveJsonModule")," is enabled. It is allows to import json-files the same way as usual source code using ",(0,i.kt)("inlineCode",{parentName:"p"},"import"),", moreover typecheck and tree-shaking will work to json as well when publishing package. To disable ts errors for json imports add to ",(0,i.kt)("inlineCode",{parentName:"p"},"tsconfig.json")," of the package new entry to field ",(0,i.kt)("inlineCode",{parentName:"p"},"includes"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "includes": ["./src", "./src/**/*.json"]\n}\n')),(0,i.kt)("h3",{id:"use-assets-file-in-the-package-eg-css-svg"},"Use assets file in the package (e.g. css, svg)"),(0,i.kt)("p",null,"These files are not used in bundle or source code and ts will ignore them. For proper package usage additional setup should be done. Add script ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai-copy")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "scripts": {\n    "copy-static-assets": "tramvai-copy"\n  }\n}\n')),(0,i.kt)("p",null,"This script will copy not related files to source code to the output directory. Copying itself happens either on dependencies install in the repository root or on package publishing. As for some reasons output directory might be deleted it may be needed to rerun ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai-copy")," command for package."),(0,i.kt)("h3",{id:"use-css-modules"},"Use css-modules"),(0,i.kt)("p",null,"In order to disable typescript errors for css-modules imports add new file ",(0,i.kt)("inlineCode",{parentName:"p"},"typings.d.ts")," to the ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," folder with the next content:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"declare module '*.css' {\n  const value: any;\n  export default value;\n}\n")),(0,i.kt)("p",null,"To copy css while deb-build change next command:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'"watch": "tramvai-copy && tsc -w"\n')),(0,i.kt)("p",null,"Such imports are not compiled. To use it properly you can use ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," for building app or any other solution for the css-modules."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"When building correctness of imports for the css is not checking so check your package manually before publication.")))}b.isMDXComponent=!0}}]);