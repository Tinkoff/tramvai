"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[469],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>d});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),l=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=l(e.components);return a.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=l(n),d=r,g=u["".concat(p,".").concat(d)]||u[d]||c[d]||i;return n?a.createElement(g,o(o({ref:t},m),{},{components:n})):a.createElement(g,o({ref:t},m))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=u;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},627:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>p,default:()=>d,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var a=n(7462),r=n(3366),i=(n(7294),n(3905)),o=["components"],s={id:"assets",title:"Assets"},p=void 0,l={unversionedId:"guides/assets",id:"guides/assets",title:"Assets",description:"Images",source:"@site/tmp-docs/guides/assets.md",sourceDirName:"guides",slug:"/guides/assets",permalink:"/docs/guides/assets",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/guides/assets.md",tags:[],version:"current",frontMatter:{id:"assets",title:"Assets"},sidebar:"sidebar",previous:{title:"Child App",permalink:"/docs/features/child-app/overview"},next:{title:"Bundle optimization",permalink:"/docs/guides/bundle-optimization"}},m={},c=[{value:"Images",id:"images",level:2},{value:"Raster",id:"raster",level:3},{value:"Vector",id:"vector",level:3},{value:"React component",id:"react-component",level:4},{value:"Optimization",id:"optimization",level:3},{value:"Typings",id:"typings",level:3},{value:"Fonts",id:"fonts",level:2},{value:"Custom Web Fonts",id:"custom-web-fonts",level:3},{value:"Typings",id:"typings-1",level:3}],u={toc:c};function d(e){var t=e.components,n=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"images"},"Images"),(0,i.kt)("h3",{id:"raster"},"Raster"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Supported formats:")," ",(0,i.kt)("inlineCode",{parentName:"p"},".png"),", ",(0,i.kt)("inlineCode",{parentName:"p"},".jpg"),", ",(0,i.kt)("inlineCode",{parentName:"p"},".jpeg"),", ",(0,i.kt)("inlineCode",{parentName:"p"},".gif"),", ",(0,i.kt)("inlineCode",{parentName:"p"},".webp")),(0,i.kt)("p",null,"Import of raster image emits a separate file, while default export returns URL string and named export returns ",(0,i.kt)("inlineCode",{parentName:"p"},"image")," object with the following interface:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"interface ImageObject {\n  src: string;\n  width: number;\n  height: number;\n}\n")),(0,i.kt)("p",null,"Example with named export and automatic ",(0,i.kt)("inlineCode",{parentName:"p"},"aspect-ratio")," calculation based on real image width and height:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'import { image } from \'./images/mountains.jpeg\';\n\nconst Image = () => {\n  const { src, width, height } = image;\n\n  // <img src="${ASSETS_PREFIX}/dist/client/9930f34d1d49796027f2a18ea89e6ccf.jpeg" width="1104" height="460" />\n  return <img src={src} width={width} height={height} />;\n}\n')),(0,i.kt)("p",null,"Example with default export:"),(0,i.kt)("admonition",{type:"warning"},(0,i.kt)("p",{parentName:"admonition"},"Usage without ",(0,i.kt)("inlineCode",{parentName:"p"},"width")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"height")," attributes not recommended, it will degrade the Cumulative Layout Shift metric")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import src from './images/mountains.jpeg';\n\nconst Image = () => {\n  // <img src=\"${ASSETS_PREFIX}/dist/client/9930f34d1d49796027f2a18ea89e6ccf.jpeg\" />\n  return <img src={src} />;\n}\n")),(0,i.kt)("h3",{id:"vector"},"Vector"),(0,i.kt)("p",null,"Import of ",(0,i.kt)("inlineCode",{parentName:"p"},".svg")," images emits a separate file and have different behavior on server and client side, because of some legacy coupling with our internal UI-kit library. By default, on server side, it will return image source code as a string, and on client side, it will return an URL string."),(0,i.kt)("p",null,"This default behavior not very useful, so we recommend to use imports with ",(0,i.kt)("inlineCode",{parentName:"p"},"svgr")," ",(0,i.kt)("a",{parentName:"p",href:"https://webpack.js.org/configuration/module/#ruleresourcequery"},"resource query"),"."),(0,i.kt)("h4",{id:"react-component"},"React component"),(0,i.kt)("p",null,"Imports with ",(0,i.kt)("inlineCode",{parentName:"p"},".svg?react")," resource query will return React component, created by ",(0,i.kt)("a",{parentName:"p",href:"https://react-svgr.com/"},"svgr library"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},'import Image from \'./images/logo.svg?react\';\n\nconst Logo = () => {\n  // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.9 72.2" width="100" height="100">...</svg>\n  return <Image width="100" height="100" />;\n}\n')),(0,i.kt)("p",null,"All properties to this ",(0,i.kt)("inlineCode",{parentName:"p"},"Image")," component will be passed to root ",(0,i.kt)("inlineCode",{parentName:"p"},"svg")," tag."),(0,i.kt)("h3",{id:"optimization"},"Optimization"),(0,i.kt)("p",null,"By default, ",(0,i.kt)("strong",{parentName:"p"},"raster")," images doesn't have any optimization, and you have a few options for it:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"run the image once through tools like ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/GoogleChromeLabs/squoosh"},"Squoosh")),(0,i.kt)("li",{parentName:"ul"},"optimize images in runtime with services like ",(0,i.kt)("a",{parentName:"li",href:"https://imgproxy.net/"},"imgproxy")),(0,i.kt)("li",{parentName:"ul"},"in ",(0,i.kt)("inlineCode",{parentName:"li"},"tramvai.json")," turn on ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/tcoopman/image-webpack-loader"},"image-webpack-loader")," with ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/imagemin/imagemin"},"imagemin")," under the hood")),(0,i.kt)("p",null,"For automatic ",(0,i.kt)("inlineCode",{parentName:"p"},"imagemin")," processing use option ",(0,i.kt)("inlineCode",{parentName:"p"},"imageOptimization"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="tramvai.json"',title:'"tramvai.json"'},'{\n  "projects": {\n    "appName": {\n      "imageOptimization": {\n        // enable image optimization\n        "enabled": true,\n        // options for the detailed settings (https://github.com/tcoopman/image-webpack-loader#options)\n        "options": {}\n      }\n    }\n  }\n}\n')),(0,i.kt)("p",null,"For ",(0,i.kt)("strong",{parentName:"p"},"vector")," images, on contrast, ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/svg/svgo"},"svgo")," always enabled."),(0,i.kt)("h3",{id:"typings"},"Typings"),(0,i.kt)("p",null,"To prevent typescript issues with image imports, make sure that your custom types declaration contains ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," package reference:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="typings.d.ts"',title:'"typings.d.ts"'},'/// <reference types="@tramvai/cli" />\n')),(0,i.kt)("h2",{id:"fonts"},"Fonts"),(0,i.kt)("p",null,"Simpliest way to add Web Fonts in your project is to use ",(0,i.kt)("inlineCode",{parentName:"p"},"RENDER_SLOTS")," token, example with ",(0,i.kt)("inlineCode",{parentName:"p"},"Lato")," Google Font:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';\n\nprovide({\n  provide: RENDER_SLOTS,\n  multi: true,\n  useValue: {\n    type: ResourceType.style,\n    slot: ResourceSlot.HEAD_CORE_STYLES,\n    payload: 'https://fonts.googleapis.com/css2?family=Lato&display=swap',\n  },\n});\n")),(0,i.kt)("p",null,"Also, for faster text rendering, you can preload used fonts:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';\n\nprovde({\n  provide: RENDER_SLOTS,\n  multi: true,\n  useValue: {\n    type: ResourceType.preloadLink,\n    slot: ResourceSlot.HEAD_CORE_SCRIPTS,\n    payload: 'https://fonts.gstatic.com/s/lato/v20/S6uyw4BMUTPHjx4wXiWtFCc.woff2',\n    attrs: {\n      as: 'font',\n      type: 'font/woff2',\n      crossOrigin: 'anonymous',\n    },\n  },\n})\n")),(0,i.kt)("h3",{id:"custom-web-fonts"},"Custom Web Fonts"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Supported formats:")," ",(0,i.kt)("inlineCode",{parentName:"p"},".woff2")),(0,i.kt)("p",null,"Recommended way to add custom fonts - import nessesary font in ",(0,i.kt)("inlineCode",{parentName:"p"},"@font-face")," directive:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-css",metastring:'title="app.module.css"',title:'"app.module.css"'},":global {\n  @font-face {\n    font-family: 'CascadiaCode';\n    src: url('./fonts/CascadiaCodePL.woff2') format('woff2');\n  }\n\n  html {\n    font-family: CascadiaCode;\n  }\n}\n")),(0,i.kt)("p",null,"Then just import this CSS file in application entry:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="index.ts"',title:'"index.ts"'},"import './app.module.css';\n")),(0,i.kt)("p",null,"Result CSS will looks like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-css"},"@font-face {\n  font-family: 'CascadiaCode';\n  src: url(${ASSETS_PREFIX}/dist/client/20d46cabfe465e8d.woff2) format('woff2');\n}\nhtml {\n  font-family: CascadiaCode;\n}\n")),(0,i.kt)("p",null,"And preload your font as in previous example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/tokens-render';\nimport font from './fonts/CascadiaCodePL.woff2';\n\nprovide({\n  provide: RENDER_SLOTS,\n  multi: true,\n  useValue: {\n    type: ResourceType.preloadLink,\n    slot: ResourceSlot.HEAD_CORE_SCRIPTS,\n    payload: font,\n    attrs: {\n      as: 'font',\n      type: 'font/woff2',\n      crossOrigin: 'anonymous',\n    },\n  },\n});\n")),(0,i.kt)("h3",{id:"typings-1"},"Typings"),(0,i.kt)("p",null,"To prevent typescript issues with import ",(0,i.kt)("inlineCode",{parentName:"p"},"*.woff2")," file, make sure that your custom types declaration contains ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/cli")," package reference:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="typings.d.ts"',title:'"typings.d.ts"'},'/// <reference types="@tramvai/cli" />\n')))}d.isMDXComponent=!0}}]);