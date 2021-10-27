(self.webpackChunk=self.webpackChunk||[]).push([[4025],{3905:(e,n,t)=>{"use strict";t.d(n,{Zo:()=>c,kt:()=>m});var r=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),l=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(s.Provider,{value:n},e.children)},k={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=l(t),m=o,u=d["".concat(s,".").concat(m)]||d[m]||k[m]||a;return t?r.createElement(u,i(i({ref:n},c),{},{components:t})):r.createElement(u,i({ref:n},c))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var p={};for(var s in n)hasOwnProperty.call(n,s)&&(p[s]=n[s]);p.originalType=e,p.mdxType="string"==typeof e?e:o,i[1]=p;for(var l=2;l<a;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},4850:(e,n,t)=>{"use strict";t.r(n),t.d(n,{frontMatter:()=>p,contentTitle:()=>s,metadata:()=>l,toc:()=>c,default:()=>d});var r=t(2122),o=t(9756),a=(t(7294),t(3905)),i=["components"],p={id:"mocker",title:"mocker"},s=void 0,l={unversionedId:"references/libs/mocker",id:"references/libs/mocker",isDocsHomePage:!1,title:"mocker",description:"\u0421\u0435\u0440\u0432\u0435\u0440 \u0438 middleware \u0434\u043b\u044f \u043c\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f API.",source:"@site/tmp-docs/references/libs/mocker.md",sourceDirName:"references/libs",slug:"/references/libs/mocker",permalink:"/en/docs/references/libs/mocker",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/libs/mocker.md",version:"current",frontMatter:{id:"mocker",title:"mocker"},sidebar:"docs",previous:{title:"user-agent",permalink:"/en/docs/references/libs/user-agent"},next:{title:"papi",permalink:"/en/docs/references/libs/papi"}},c=[{value:"\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",id:"\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",children:[]},{value:"Explanation",id:"explanation",children:[{value:"\u041c\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u044f",id:"\u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u044f",children:[]},{value:"\u041c\u043e\u043a\u0438 \u0438\u0437 \u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u044b",id:"\u043c\u043e\u043a\u0438-\u0438\u0437-\u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439-\u0441\u0438\u0441\u0442\u0435\u043c\u044b",children:[]}]},{value:"API",id:"api",children:[{value:"Mocker",id:"mocker",children:[]},{value:"MockerOptions",id:"mockeroptions",children:[]},{value:"MockRepository",id:"mockrepository",children:[]}]},{value:"How to",id:"how-to",children:[{value:"\u041a\u0430\u043a \u043c\u043e\u043a\u0430\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u043c\u0438 query \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438?",id:"\u043a\u0430\u043a-\u043c\u043e\u043a\u0430\u0442\u044c-\u0437\u0430\u043f\u0440\u043e\u0441-\u0442\u043e\u043b\u044c\u043a\u043e-\u0441-\u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u043c\u0438-query-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438",children:[]},{value:"\u041a\u0430\u043a \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 API \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441?",id:"\u043a\u0430\u043a-\u043f\u0440\u043e\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u0442\u044c-\u0432-\u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435-api-\u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439-\u0437\u0430\u043f\u0440\u043e\u0441",children:[]}]}],k={toc:c};function d(e){var n=e.components,t=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},k,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"\u0421\u0435\u0440\u0432\u0435\u0440 \u0438 middleware \u0434\u043b\u044f \u043c\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f API."),(0,a.kt)("h2",{id:"\u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435"},"\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435"),(0,a.kt)("p",null,"\u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c ",(0,a.kt)("inlineCode",{parentName:"p"},"@tinkoff/mocker"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add @tinkoff/mocker\n")),(0,a.kt)("p",null,"\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0435\u0440\u0432\u044b\u0439 \u043c\u043e\u043a, \u0432 \u0444\u0430\u0439\u043b\u0435 ",(0,a.kt)("inlineCode",{parentName:"p"},"mocks/first-api.js"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"module.exports = {\n  api: 'first-api',\n  mocks: {\n    'GET /endpoint': {\n      status: 200,\n      headers: {},\n      payload: 'mocked response',\n    },\n  },\n};\n")),(0,a.kt)("p",null,"\u0417\u0430\u0442\u0435\u043c \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043c\u043e\u043a\u0435\u0440 \u0432 \u043f\u0440\u043e\u0435\u043a\u0442\u0435:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Mocker, FileSystemMockRepository } from '@tinkoff/mocker';\n\n// \u0440\u0435\u043f\u043e\u0437\u0438\u0442\u043e\u0440\u0438\u0439 \u0431\u0443\u0434\u0435\u0442 \u0447\u0438\u0442\u0430\u0442\u044c \u043c\u043e\u043a\u0438 \u0438\u0437 \u0444\u0430\u0439\u043b\u043e\u0432 \u0432 \u0442\u0435\u043a\u0443\u0449\u0435\u0439 \u0434\u0438\u0440\u0435\u043a\u0442\u043e\u0440\u0438\u0438, \u0438\u0437 \u043f\u0430\u043f\u043a\u0438 `mocks`\nconst repository = new FileSystemMockRepository({ cwd: process.cwd(), root: 'mocks' });\n// \u0432\u0441\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u043a \u043c\u043e\u043a\u0435\u0440\u0443 \u043d\u0430 `/first-api/...` \u043b\u0438\u0431\u043e \u043f\u043e\u043b\u0443\u0447\u0430\u044e\u0442 \u043f\u043e\u0434\u0445\u043e\u0434\u044f\u0449\u0438\u0439 \u043c\u043e\u043a, \u043b\u0438\u0431\u043e \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u043d\u0430 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 API\nconst options = {\n  apis: {\n    'first-api': {\n      target: 'https://real-first-api.com/',\n    },\n  },\n  passUnhandledRequests: true\n};\n\nconst mocker = new Mocker({ options, repository, logger: console });\n\n(async () => {\n  // \u043d\u0430 \u044d\u0442\u043e\u043c \u044d\u0442\u0430\u043f\u0435 \u043c\u043e\u043a\u0435\u0440 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442 \u043c\u043e\u043a\u0438 \u0447\u0435\u0440\u0435\u0437 \u0440\u0435\u043f\u043e\u0437\u0438\u0442\u043e\u0440\u0438\u0439, \u0438 \u0441\u043e\u0437\u0434\u0430\u0435\u0442 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0435 \u0440\u043e\u0443\u0442\u044b\n  await mocker.init();\n\n  mocker.start(4000, () => {\n    console.log('Mocker running at 4000 port');\n  });\n})();\n")),(0,a.kt)("p",null,"\u0418 \u043c\u043e\u0436\u0435\u043c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c ",(0,a.kt)("inlineCode",{parentName:"p"},"GET")," \u0437\u0430\u043f\u0440\u043e\u0441 \u043a \u043c\u043e\u043a\u0435\u0440\u0443:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"(async () => {\nconst response = await fetch('http://localhost:4000/first-api/endpoint');\nconst data = await response.json();\n\nconsole.log(data); // \"mocked response\"\n})();\n")),(0,a.kt)("h2",{id:"explanation"},"Explanation"),(0,a.kt)("p",null,"\u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430 \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 ",(0,a.kt)("a",{parentName:"p",href:"https://expressjs.com/"},"express"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"mocker")," \u043c\u043e\u0436\u043d\u043e \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c \u043a\u0430\u043a \u0432 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u0441\u0435\u0440\u0432\u0435\u0440\u0430,\n\u0442\u0430\u043a \u0438 \u043d\u0430 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044e\u0449\u0435\u043c \u0441\u0435\u0440\u0432\u0435\u0440\u0435 \u0447\u0435\u0440\u0435\u0437 middleware ",(0,a.kt)("inlineCode",{parentName:"p"},"mocker.use(req, res)"),"."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"FileSystemMockRepository")," \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043c\u043e\u043a\u0438 \u0432 \u0444\u043e\u0440\u043c\u0430\u0442\u0430\u0445 ",(0,a.kt)("inlineCode",{parentName:"p"},"js")," \u0438 ",(0,a.kt)("inlineCode",{parentName:"p"},"json"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"js")," \u043c\u043e\u043a\u0438 \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u044e\u0442 \u0437\u0430\u0434\u0430\u0432\u0430\u0442\u044c \u043a\u0430\u0441\u0442\u043e\u043c\u043d\u044b\u0435 ",(0,a.kt)("inlineCode",{parentName:"p"},"express")," \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u0438 (\u043c\u0435\u0442\u043e\u0434\u044b) \u0432 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435 \u043c\u043e\u043a\u0430."),(0,a.kt)("p",null,"\u041f\u0440\u0438 \u0432\u044b\u0431\u043e\u0440\u0430 \u043c\u043e\u043a\u0430 \u0434\u043b\u044f \u0442\u0435\u043a\u0443\u0449\u0435\u0433\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u0430, \u0443\u0447\u0438\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f ",(0,a.kt)("inlineCode",{parentName:"p"},"method")," \u0437\u0430\u043f\u0440\u043e\u0441\u0430, ",(0,a.kt)("inlineCode",{parentName:"p"},"url")," \u0438 ",(0,a.kt)("inlineCode",{parentName:"p"},"query")," \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b."),(0,a.kt)("p",null,"\u041c\u043e\u043a\u0435\u0440 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432 \u0432 API, \u0447\u0442\u043e \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u043c\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0435\u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u044d\u043d\u0434\u043f\u043e\u0438\u043d\u0442\u044b, \u0430 \u043d\u0435 \u0432\u0435\u0441\u044c \u0431\u044d\u043a\u0435\u043d\u0434."),(0,a.kt)("h3",{id:"\u043c\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u044f"},"\u041c\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u044f"),(0,a.kt)("p",null,"\u0415\u0441\u043b\u0438 \u043c\u043e\u043a\u0435\u0440 \u0431\u044b\u043b \u0437\u0430\u043f\u0443\u0449\u0435\u043d \u043a\u0430\u043a \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u0439 \u0441\u0435\u0440\u0432\u0435\u0440, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u043d\u0430 4000 \u043f\u043e\u0440\u0442\u0443, \u043e\u043d \u0431\u0443\u0434\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u043d\u0430 ",(0,a.kt)("inlineCode",{parentName:"p"},"http://localhost:4000/"),"."),(0,a.kt)("p",null,"\u0414\u043b\u044f \u043a\u0430\u0436\u0434\u043e\u0433\u043e ",(0,a.kt)("inlineCode",{parentName:"p"},"api")," \u0438\u0437 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a ",(0,a.kt)("inlineCode",{parentName:"p"},"options.apis")," \u0431\u0443\u0434\u0435\u0442 \u0441\u043e\u0437\u0434\u0430\u043d \u0432\u043b\u043e\u0436\u0435\u043d\u043d\u044b\u0439 \u0440\u043e\u0443\u0442\u0435\u0440, \u0434\u043b\u044f ",(0,a.kt)("inlineCode",{parentName:"p"},"first-api")," \u044d\u0442\u043e \u0431\u0443\u0434\u0435\u0442 ",(0,a.kt)("inlineCode",{parentName:"p"},"http://localhost:4000/first-api/"),"."),(0,a.kt)("p",null,"\u0420\u043e\u0443\u0442\u044b \u0434\u043b\u044f ",(0,a.kt)("inlineCode",{parentName:"p"},"api")," \u0441\u043e\u0437\u0434\u0430\u044e\u0442\u0441\u044f \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u043c\u043e\u043a\u043e\u0432, \u0443 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043a\u043b\u044e\u0447\u0435\u043c \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043c\u0435\u0442\u043e\u0434 + \u0443\u0440\u043b \u0437\u0430\u043f\u0440\u043e\u0441\u0430, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 \u043c\u043e\u043a ",(0,a.kt)("inlineCode",{parentName:"p"},"GET /endpoint")," \u0431\u0443\u0434\u0435\u0442 \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u043f\u043e \u0430\u0434\u0440\u0435\u0441\u0443 ",(0,a.kt)("inlineCode",{parentName:"p"},"http://localhost:4000/first-api/endpoint"),", \u0434\u043b\u044f ",(0,a.kt)("inlineCode",{parentName:"p"},"GET")," \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432."),(0,a.kt)("h3",{id:"\u043c\u043e\u043a\u0438-\u0438\u0437-\u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439-\u0441\u0438\u0441\u0442\u0435\u043c\u044b"},"\u041c\u043e\u043a\u0438 \u0438\u0437 \u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u044b"),(0,a.kt)("p",null,"\u041c\u043e\u043a\u0435\u0440 \u043f\u043e\u043b\u0443\u0447\u0430\u0435\u0442 \u043c\u043e\u043a\u0438 \u0447\u0435\u0440\u0435\u0437 \u0440\u0435\u043f\u043e\u0437\u0438\u0442\u043e\u0440\u0438\u0439, \u0447\u0442\u043e \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043c\u043e\u043a\u0438 \u0432 \u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u0435, \u043f\u0430\u043c\u044f\u0442\u0438, \u0438\u043b\u0438 \u043d\u0430 \u0434\u0440\u0443\u0433\u043e\u043c \u0441\u0435\u0440\u0432\u0435\u0440\u0435.\n",(0,a.kt)("inlineCode",{parentName:"p"},"FileSystemMockRepository")," \u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0442 \u0441 \u0444\u0430\u0439\u043b\u043e\u0432\u043e\u0439 \u0441\u0438\u0441\u0442\u0435\u043c\u043e\u0439, \u0438 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u0432\u0438\u0434\u044b \u043c\u043e\u043a\u043e\u0432:"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"mock.json")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "api": "first-api",\n  "mocks": {\n    "GET /foo": {\n      "status": 200,\n      "headers": {},\n      "payload": {\n        "fake": "true"\n      }\n    }\n  }\n}\n')),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"mock.js")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"module.exports = {\n  api: 'first-api',\n  mocks: {\n    'GET /bar': {\n      status: 200,\n      headers: {},\n      payload: {\n        fake: 'true',\n      },\n    },\n    'POST /bar': (req, res) => {\n      res.status(200);\n      res.set('X-Mock-Server', 'true');\n      res.json({ fake: 'true' });\n    },\n  },\n};\n")),(0,a.kt)("h2",{id:"api"},"API"),(0,a.kt)("h3",{id:"mocker"},"Mocker"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"interface Mocker {\n  new (params: {\n    options: MockerOptions;\n    repository: MockRepository;\n    logger: Logger;\n  }): Mocker;\n\n  init(): Promise<void>;\n\n  update(): Promise<void>;\n\n  use(req: IncomingMessage, res: ServerResponse): express.Express;\n\n  start(port: number, callback?: (...args: any[]) => void): Server;\n}\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Mocker.init")," - \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u043c\u043e\u043a\u043e\u0432 \u0447\u0435\u0440\u0435\u0437 ",(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository"),", \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u044f \u0440\u043e\u0443\u0442\u0438\u043d\u0433\u0430. \u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u0432\u044b\u0437\u044b\u0432\u0430\u0442\u044c \u0434\u043e \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u0438\u043b\u0438 middleware."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Mocker.update")," - \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u0435 \u043c\u043e\u043a\u043e\u0432 \u0447\u0435\u0440\u0435\u0437 ",(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository"),", \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u043e\u0443\u0442\u0438\u043d\u0433\u0430. \u041c\u043e\u0436\u043d\u043e \u0432\u044b\u0437\u044b\u0432\u0430\u0442\u044c \u0432 \u0440\u0430\u043d\u0442\u0430\u0439\u043c\u0435."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Mocker.use")," - ",(0,a.kt)("inlineCode",{parentName:"p"},"express")," middleware, \u043f\u043e\u0434\u0445\u043e\u0434\u0438\u0442 \u0434\u043b\u044f \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043d\u0430 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044e\u0449\u0435\u043c \u0441\u0435\u0440\u0432\u0435\u0440\u0435."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"Mocker.start")," - \u0437\u0430\u043f\u0443\u0441\u043a \u043c\u043e\u043a\u0435\u0440\u0430 \u043d\u0430 \u0441\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u043e\u043c http \u0441\u0435\u0440\u0432\u0435\u0440\u0435."),(0,a.kt)("h3",{id:"mockeroptions"},"MockerOptions"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"interface MockerOptions {\n  apis: Record<string, { target: string }>;\n  passUnhandledRequests?: boolean;\n  apiRoutePrefix?: string;\n}\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockerOptions.apis")," - \u0441\u043f\u0438\u0441\u043e\u043a API \u0434\u043b\u044f \u043c\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f, \u0432 ",(0,a.kt)("inlineCode",{parentName:"p"},"target")," \u0443\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u044b\u0439 \u0443\u0440\u043b API."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockerOptions.passUnhandledRequests")," - \u043f\u0440\u0438 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u043d\u043e\u0439 \u043e\u043f\u0446\u0438\u0438, \u0432\u0441\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u044b, \u0434\u043b\u044f \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043d\u0435 \u043d\u0430\u0448\u043b\u043e\u0441\u044c \u043c\u043e\u043a\u043e\u0432, \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u043d\u0430 ",(0,a.kt)("inlineCode",{parentName:"p"},"target")," url,\n\u0438\u043d\u0430\u0447\u0435 \u043e\u0442\u0434\u0430\u0435\u0442\u0441\u044f \u043e\u0448\u0438\u0431\u043a\u0430."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockerOptions.apiRoutePrefix")," - \u0435\u0441\u043b\u0438 \u043c\u043e\u043a\u0435\u0440 \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0435\u0442\u0441\u044f \u0432 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044e\u0449\u0435\u043c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438 \u043d\u0430 \u0432\u043b\u043e\u0436\u0435\u043d\u043d\u043e\u043c \u0440\u043e\u0443\u0442\u0435, \u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440 ",(0,a.kt)("inlineCode",{parentName:"p"},"/mocker"),",\n\u043c\u043e\u0436\u0435\u0442 \u043f\u043e\u043d\u0430\u0434\u043e\u0431\u0438\u0442\u044c\u0441\u044f \u043f\u0440\u043e\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u044d\u0442\u043e\u0442 \u0443\u0440\u043b \u0432 ",(0,a.kt)("inlineCode",{parentName:"p"},"apiRoutePrefix")," \u0434\u043b\u044f \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0440\u043e\u0443\u0442\u0435\u0440\u0430 \u043c\u043e\u043a\u0435\u0440\u0430."),(0,a.kt)("h3",{id:"mockrepository"},"MockRepository"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"interface MockRepository {\n  get(api: string, endpoint: string): Promise<Mock>;\n\n  getAll(api: string): Promise<Record<string, Mock>>;\n\n  add(api: string, endpoint: string, mock: Mock): Promise<void>;\n\n  delete(api: string, endpoint: string): Promise<void>;\n}\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository.getAll")," - \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0432\u0441\u0435 \u043c\u043e\u043a\u0438 \u0434\u043b\u044f \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0433\u043e api."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository.get")," - \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u0439 \u043c\u043e\u043a \u0434\u043b\u044f \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0433\u043e api."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository.add")," - \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043c\u043e\u043a \u0434\u043b\u044f \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0433\u043e api."),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"MockRepository.delete")," - \u0443\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u0439 \u043c\u043e\u043a \u0434\u043b\u044f \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0433\u043e api."),(0,a.kt)("h2",{id:"how-to"},"How to"),(0,a.kt)("h3",{id:"\u043a\u0430\u043a-\u043c\u043e\u043a\u0430\u0442\u044c-\u0437\u0430\u043f\u0440\u043e\u0441-\u0442\u043e\u043b\u044c\u043a\u043e-\u0441-\u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u043c\u0438-query-\u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438"},"\u041a\u0430\u043a \u043c\u043e\u043a\u0430\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441 \u0442\u043e\u043b\u044c\u043a\u043e \u0441 \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u043c\u0438 query \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438?"),(0,a.kt)("p",null,"\u0412 \u043c\u043e\u043a\u0430\u0445 \u0440\u0435\u0430\u043b\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u0430 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u0441\u0432\u0435\u0440\u043a\u0438 query \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u043e\u0432 \u0437\u0430\u043f\u0440\u043e\u0441\u0430 \u0438 \u043c\u043e\u043a\u0430,\n\u0432 \u043f\u0440\u0438\u043c\u0435\u0440\u0435 \u043d\u0438\u0436\u0435 \u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 ",(0,a.kt)("inlineCode",{parentName:"p"},"/endpoint?foo=bar")," \u043f\u043e\u043f\u0430\u0434\u0435\u0442 \u0432 \u043f\u0435\u0440\u0432\u044b\u0439 \u043c\u043e\u043a, ",(0,a.kt)("inlineCode",{parentName:"p"},"/endpoint?foo=baz")," \u0432\u043e \u0432\u0442\u043e\u0440\u043e\u0439,\n\u0430 \u0432\u0441\u0435 \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0437\u0430\u043f\u0440\u043e\u0441\u044b \u0441 \u0434\u0440\u0443\u0433\u0438\u043c\u0438 query, \u0438\u043b\u0438 \u0431\u0435\u0437 \u043d\u0438\u0445, \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u0443\u044e\u0442\u0441\u044f \u0432 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 API (\u043f\u0440\u0438 \u0432\u043a\u043b\u044e\u0447\u0435\u043d\u043d\u043e\u0439 \u043e\u043f\u0446\u0438\u0438 ",(0,a.kt)("inlineCode",{parentName:"p"},"passUnhandledRequests"),")."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"module.exports = {\n  api: 'api',\n  mocks: {\n    'GET /endpoint?foo=bar': {\n      status: 200,\n      headers: {},\n      payload: 'mocked bar response',\n    },\n    'GET /endpoint?foo=baz': {\n      status: 200,\n      headers: {},\n      payload: 'mocked baz response',\n    },\n  },\n};\n")),(0,a.kt)("h3",{id:"\u043a\u0430\u043a-\u043f\u0440\u043e\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u0442\u044c-\u0432-\u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435-api-\u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439-\u0437\u0430\u043f\u0440\u043e\u0441"},"\u041a\u0430\u043a \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432 \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u044c\u043d\u043e\u0435 API \u043e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0439 \u0437\u0430\u043f\u0440\u043e\u0441?"),(0,a.kt)("p",null,"\u042d\u0442\u043e \u0438\u043c\u0435\u0435\u0442 \u0441\u043c\u044b\u0441\u043b, \u0435\u0441\u043b\u0438 \u043e\u0442\u043a\u043b\u044e\u0447\u0435\u043d\u0430 \u043e\u043f\u0446\u0438\u044f ",(0,a.kt)("inlineCode",{parentName:"p"},"passUnhandledRequests"),", \u0434\u043e\u0441\u0442\u0430\u0442\u043e\u0447\u043d\u043e \u043f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u0441\u0432\u043e\u0439\u0441\u0442\u0432\u043e ",(0,a.kt)("inlineCode",{parentName:"p"},"pass: true")," \u0432 \u043d\u0443\u0436\u043d\u044b\u0439 \u043c\u043e\u043a:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"module.exports = {\n  api: 'api',\n  mocks: {\n    'ALL /endpoint': {\n      pass: true,\n    },\n  },\n};\n")))}d.isMDXComponent=!0}}]);