"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5474],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(r),m=a,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return r?n.createElement(f,o(o({ref:t},p),{},{components:r})):n.createElement(f,o({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},6210:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),o=["components"],l={sidebar_position:4},s=void 0,c={unversionedId:"references/cli/build",id:"references/cli/build",title:"build",description:"Library build",source:"@site/tmp-docs/references/cli/build.md",sourceDirName:"references/cli",slug:"/references/cli/build",permalink:"/tramvai/docs/references/cli/build",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/cli/build.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"sidebar",previous:{title:"start",permalink:"/tramvai/docs/references/cli/start"},next:{title:"analyze",permalink:"/tramvai/docs/references/cli/analyze"}},p={},d=[{value:"Library build",id:"library-build",level:2}],u={toc:d};function m(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"library-build"},"Library build"),(0,i.kt)("p",null,"Command ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai build")," can build libraries to separate bundles for various environments:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"CommonJS modules + ES2019 code (for nodejs without ESM support) - it uses field ",(0,i.kt)("inlineCode",{parentName:"li"},"main")," in ",(0,i.kt)("inlineCode",{parentName:"li"},"package.json")),(0,i.kt)("li",{parentName:"ul"},"ES modules + ES2019 code (for nodejs with ESM support) - it uses filed ",(0,i.kt)("inlineCode",{parentName:"li"},"module")," in ",(0,i.kt)("inlineCode",{parentName:"li"},"package.json")),(0,i.kt)("li",{parentName:"ul"},"ES modules + ES2019 code (for browsers) - it uses field ",(0,i.kt)("inlineCode",{parentName:"li"},"browser")," in ",(0,i.kt)("inlineCode",{parentName:"li"},"package.json"))),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," use ",(0,i.kt)("a",{parentName:"p",href:"/tramvai/docs/references/tools/build"},"@tramvai/build")," package under the hood for bundling packages."),(0,i.kt)("p",null,"To specify new library in ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai.json")," add new project with the type ",(0,i.kt)("inlineCode",{parentName:"p"},"package"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "projects": {\n    "{{packageName}}": {\n      "name": "{{packageName}}",\n      "type": "package",\n      "root": "libs/{{packageName}}"\n    }\n  }\n}\n')),(0,i.kt)("p",null,"Library settings should be specified in the ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," of the library itself:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "name": "{{packageName}}",\n  "version": "1.0.0",\n  "main": "dist/index.js", // main library entry point\n  "browser": "dist/browser.js", // optional field, library entry point for browsers bundle\n  "typings": "src/index.ts", // \n  "sideEffects": false,\n  "scripts": {\n    "start": "tramvai build {{packageName}} --watchMode", // watch mode to develop package\n    "build": "tramvai build {{packageName}} --forPublish" // single time build for the production\n  }\n}\n')),(0,i.kt)("p",null,"See the complete documentation about output targets, configuration and many reciepes in ",(0,i.kt)("a",{parentName:"p",href:"/tramvai/docs/references/tools/build"},"@tramvai/build documentation"),"."))}m.isMDXComponent=!0}}]);