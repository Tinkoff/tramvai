(self.webpackChunk=self.webpackChunk||[]).push([[4619],{3905:(e,n,r)=>{"use strict";r.d(n,{Zo:()=>m,kt:()=>d});var t=r(7294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=t.createContext({}),l=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},m=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},p=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),p=l(r),d=o,f=p["".concat(c,".").concat(d)]||p[d]||u[d]||i;return r?t.createElement(f,a(a({ref:n},m),{},{components:r})):t.createElement(f,a({ref:n},m))}));function d(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=p;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=r[l];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}p.displayName="MDXCreateElement"},3511:(e,n,r)=>{"use strict";r.r(n),r.d(n,{frontMatter:()=>s,contentTitle:()=>c,metadata:()=>l,toc:()=>m,default:()=>p});var t=r(2122),o=r(9756),i=(r(7294),r(3905)),a=["components"],s={id:"browser-timings",title:"browser-timings"},c=void 0,l={unversionedId:"references/libs/browser-timings",id:"references/libs/browser-timings",isDocsHomePage:!1,title:"browser-timings",description:"Lib for measure client browsers performance. Automatically collects performance data on page load.",source:"@site/tmp-docs/references/libs/browser-timings.md",sourceDirName:"references/libs",slug:"/references/libs/browser-timings",permalink:"/en/docs/references/libs/browser-timings",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/browser-timings.md",version:"current",frontMatter:{id:"browser-timings",title:"browser-timings"},sidebar:"docs",previous:{title:"server",permalink:"/en/docs/references/modules/server"},next:{title:"browserslist-config",permalink:"/en/docs/references/libs/browserslist-config"}},m=[{value:"Installation",id:"installation",children:[]},{value:"How to",id:"how-to",children:[]},{value:"Lib interface",id:"lib-interface",children:[]}],u={toc:m};function p(e){var n=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Lib for measure client browsers performance. Automatically collects performance data on page load."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,"Install npm package"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save @tinkoff/browser-timings\n")),(0,i.kt)("h2",{id:"how-to"},"How to"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { browserTimings } from '@tinkoff/browser-timings';\n\nwindow.addEventListener('load', () => {\n  setTimeout(() => {\n    // setTimeout is necessary in order to get metrics about loadEventEnd\n    const perfData = browserTimings();\n  }, 0);\n});\n")),(0,i.kt)("p",null,"After executing ",(0,i.kt)("inlineCode",{parentName:"p"},"perfData")," will contain client performance metrics which may be send to any external system for further analysis."),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"Call of the library should be executed only after page load in order to get actual data. Otherwise, it may return empty object without data.")),(0,i.kt)("h2",{id:"lib-interface"},"Lib interface"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"export interface Timings {\n  /* Connection timing from client to server */\n  connection: number;\n  /* How much time backend was preparing response */\n  backend: number;\n  /* Page download to client */\n  pageDownload: number;\n  /* Timing of first paint for a page */\n  'first-paint': number;\n  /* Timing when DOM becomes interactive */\n  domInteractive: number;\n  /* DOM building is complete */\n  domComplete: number;\n  /* Page and every resource were loaded */\n  pageLoadTime: number;\n  /* Common information about resources and its loading time grouped by type */\n  download: {\n    html: TimingResource;\n    js: TimingResource;\n    css: TimingResource;\n    img: TimingResource;\n    font: TimingResource;\n    other: TimingResource;\n  };\n}\n\ninterface TimingResource {\n  /* Timing of resource loading */\n  duration: number;\n  /* Byte-size measure of data used by resource */\n  encodedDecodeSize: number;\n  /* Byte-size measure of data transferred by network. Calculating difference between encodedDecodeSize - transferSize may reveal how much data where stored in browser cache */\n  transferSize: number;\n}\n")))}p.isMDXComponent=!0}}]);