"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7954],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=c(r),m=a,f=d["".concat(p,".").concat(m)]||d[m]||s[m]||o;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5090:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>m,frontMatter:()=>l,metadata:()=>c,toc:()=>s});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],l={},p=void 0,c={unversionedId:"references/tools/nx-plugin",id:"references/tools/nx-plugin",title:"nx-plugin",description:"This library was generated with Nx.",source:"@site/tmp-docs/references/tools/nx-plugin.md",sourceDirName:"references/tools",slug:"/references/tools/nx-plugin",permalink:"/tramvai/docs/references/tools/nx-plugin",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/tools/nx-plugin.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"pkgs-collector-workspaces",permalink:"/tramvai/docs/references/tools/monorepo/pkgs-collector-workspaces"},next:{title:"public-packages",permalink:"/tramvai/docs/references/tools/public-packages"}},u={},s=[{value:"Building",id:"building",level:2},{value:"API",id:"api",level:2},{value:"Generate project.json",id:"generate-projectjson",level:3},{value:"Build package",id:"build-package",level:3}],d={toc:s};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"This library was generated with ",(0,o.kt)("a",{parentName:"p",href:"https://nx.dev"},"Nx"),"."),(0,o.kt)("h2",{id:"building"},"Building"),(0,o.kt)("p",null,"Run ",(0,o.kt)("inlineCode",{parentName:"p"},"nx build tools-nx-build")," to build the library."),(0,o.kt)("h2",{id:"api"},"API"),(0,o.kt)("h3",{id:"generate-projectjson"},"Generate project.json"),(0,o.kt)("p",null,"Run command ",(0,o.kt)("inlineCode",{parentName:"p"},"nx g @tramvai/nx-plugin:project")," to generate ",(0,o.kt)("inlineCode",{parentName:"p"},"project.json")," to every publishable package in workspace"),(0,o.kt)("h3",{id:"build-package"},"Build package"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Run command ",(0,o.kt)("inlineCode",{parentName:"li"},"nx run <package_name>:build-publish")," to build specific package"),(0,o.kt)("li",{parentName:"ul"},"Run command ",(0,o.kt)("inlineCode",{parentName:"li"},"nx run-many --target=build-publish --all")," to build all packages in workspace")))}m.isMDXComponent=!0}}]);