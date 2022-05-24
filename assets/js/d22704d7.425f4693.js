"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6670],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=a,h=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return n?r.createElement(h,o(o({ref:t},c),{},{components:n})):r.createElement(h,o({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},2590:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>s,metadata:()=>p,toc:()=>c,default:()=>u});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],l={},s=void 0,p={unversionedId:"references/modules/server",id:"references/modules/server",title:"server",description:"Core tramvai module, responsible for processing the users requests.",source:"@site/tmp-docs/references/modules/server.md",sourceDirName:"references/modules",slug:"/references/modules/server",permalink:"/docs/references/modules/server",editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/references/modules/server.md",tags:[],version:"current",frontMatter:{},sidebar:"sidebar",previous:{title:"server-response-cache",permalink:"/docs/references/modules/server-response-cache"},next:{title:"base",permalink:"/docs/references/modules/router/base"}},c=[{value:"Installation",id:"installation",children:[],level:2},{value:"Explanation",id:"explanation",children:[{value:"Processing the users requests",id:"processing-the-users-requests",children:[],level:3},{value:"Request proxying",id:"request-proxying",children:[{value:"Proxy config format",id:"proxy-config-format",children:[{value:"Key-value object",id:"key-value-object",children:[],level:5},{value:"Object with context and target properties",id:"object-with-context-and-target-properties",children:[],level:5},{value:"Array with context and target properties",id:"array-with-context-and-target-properties",children:[],level:5},{value:"Implementation of the PROXY_CONFIG_TOKEN token",id:"implementation-of-the-proxy_config_token-token",children:[],level:5}],level:4}],level:3},{value:"Serving static files",id:"serving-static-files",children:[],level:3},{value:"PAPI",id:"papi",children:[],level:3},{value:"Emulation of network/backends problems in the application",id:"emulation-of-networkbackends-problems-in-the-application",children:[],level:3},{value:"Logging requests sent to the server",id:"logging-requests-sent-to-the-server",children:[],level:3},{value:"Health checks",id:"health-checks",children:[],level:3},{value:"Warming application caches",id:"warming-application-caches",children:[],level:3},{value:"Custom headers",id:"custom-headers",children:[{value:"Building and Deployment Information",id:"building-and-deployment-information",children:[],level:4}],level:3},{value:"Debugging",id:"debugging",children:[],level:3}],level:2},{value:"How to",id:"how-to",children:[{value:"Specify server port",id:"specify-server-port",children:[],level:3},{value:"Specify port for utility paths",id:"specify-port-for-utility-paths",children:[],level:3}],level:2},{value:"Exportable tokens",id:"exportable-tokens",children:[],level:2}],d={toc:c};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Core ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai")," module, responsible for processing the users requests."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("p",null,"You need to install ",(0,i.kt)("inlineCode",{parentName:"p"},"@tramvai/module-server")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm i --save @tramvai/module-server\n")),(0,i.kt)("p",null,"And connect to the project"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { createApp } from '@tramvai/core';\nimport { ServerModule } from '@tramvai/module-server';\n\ncreateApp({\n  name: 'tincoin',\n  modules: [ServerModule],\n});\n")),(0,i.kt)("h2",{id:"explanation"},"Explanation"),(0,i.kt)("h3",{id:"processing-the-users-requests"},"Processing the users requests"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"ServerModule")," creates ",(0,i.kt)("a",{parentName:"p",href:"https://expressjs.com/"},"express.js")," application, handles user requests, runs ",(0,i.kt)("a",{parentName:"p",href:"/docs/concepts/command-line-runner"},"commandLineRunner"),", and sends responses to users with data, headers and status from ",(0,i.kt)("inlineCode",{parentName:"p"},"RESPONSE_MANAGER_TOKEN")," token."),(0,i.kt)("h3",{id:"request-proxying"},"Request proxying"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"ServerModule")," allows you to configure the proxying of urls to the application using the library ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/chimurai/http-proxy-middleware"},"http-proxy-middleware")),(0,i.kt)("p",null,"To enable proxying, create a file ",(0,i.kt)("inlineCode",{parentName:"p"},"proxy.conf.js")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"proxy.conf.json")," in the root of the project to export the request mapping object, or you can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"PROXY_CONFIG_TOKEN")," token."),(0,i.kt)("h4",{id:"proxy-config-format"},"Proxy config format"),(0,i.kt)("h5",{id:"key-value-object"},"Key-value object"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"const testStand = 'https://example.org';\n\nmodule.exports = {\n  // The key is the path pattern for the `express` to be passed to `app.use`\n  // value can be a string, in order to proxy all urls starting with `/login/`\n  '/login/': testStand,\n  // or can be a config object for [http-proxy](https://github.com/chimurai/http-proxy-middleware#http-proxy-options)\n  '/test/': {\n    target: testStand,\n    auth: true,\n    xfwd: true,\n    ...\n  }\n};\n")),(0,i.kt)("h5",{id:"object-with-context-and-target-properties"},"Object with context and target properties"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"module.exports = {\n  // context - is similar to the option for [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#context-matching)\n  context: ['/login/', '/registration/', '/auth/papi/'],\n  target: 'https://example.org',\n  // other `http-proxy-middleware` options\n  changeOrigin: true,\n};\n")),(0,i.kt)("h5",{id:"array-with-context-and-target-properties"},"Array with context and target properties"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'[\n  {\n    "context": ["/a/", "/b/*/c/"],\n    "target": "https://example.org"\n  }\n]\n')),(0,i.kt)("h5",{id:"implementation-of-the-proxy_config_token-token"},"Implementation of the PROXY_CONFIG_TOKEN token"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { Scope, provide } from '@tramvai/core';\nimport { PROXY_CONFIG_TOKEN } from '@tramvai/tokens-server';\n\n[\n  provide({\n    provide: PROXY_CONFIG_TOKEN,\n    scope: Scope.SINGLETON,\n    useValue: {\n      context: ['/a/', '/b/*/c/'],\n      target: 'https://example.org',\n    },\n    multi: true,\n  }),\n];\n")),(0,i.kt)("h3",{id:"serving-static-files"},"Serving static files"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"ServerModule")," has a built-in static server that allows you to distribute static files to users."),(0,i.kt)("p",null,"To serve files, you need to create a directory ",(0,i.kt)("inlineCode",{parentName:"p"},"public")," in the root of the project in which to place the necessary files. After that, all files will be available for request by browsers."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For example, we want to distribute sw.js file from the project's root:")," for this we create a folder ",(0,i.kt)("inlineCode",{parentName:"p"},"public")," in which we put the file ",(0,i.kt)("inlineCode",{parentName:"p"},"sw.js"),". Now on the client side, we will be able to request data from the url http://localhost:3000/sw.js. Also, we will most likely need some modifications on the CI/CD side to copy the public folder to the stands."),(0,i.kt)("p",null,"This function is also available in production. For this purpose, copy the folder ",(0,i.kt)("inlineCode",{parentName:"p"},"public")," into the docker container"),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Module will not serve the newly added file on the filesystem, works only for all defined files in the served folder at the time of the server startup."))),(0,i.kt)("h3",{id:"papi"},"PAPI"),(0,i.kt)("p",null,"Papi - API routes for the ",(0,i.kt)("inlineCode",{parentName:"p"},"tramvai")," application. More information is available in ",(0,i.kt)("a",{parentName:"p",href:"/docs/features/papi/introduction"},"Papi")),(0,i.kt)("h3",{id:"emulation-of-networkbackends-problems-in-the-application"},"Emulation of network/backends problems in the application"),(0,i.kt)("p",null,"(functionality is only available in dev mode)"),(0,i.kt)("p",null,"The server has the ability to increase the response time of all requests."),(0,i.kt)("p",null,"To do this you must:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"start the application"),(0,i.kt)("li",{parentName:"ul"},"send a POST request to ",(0,i.kt)("inlineCode",{parentName:"li"},"/private/papi/debug-http-request")," with a delay for the request:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:"script",script:!0},"curl --location --request POST 'http://localhost:3000/tincoin/private/papi/debug-http-request' \\\n--header 'Content-Type: application/x-www-form-urlencoded' \\\n--data-urlencode 'delay=2000'\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"check if the application works. Note: after each restart of the server the settings are reset, so after each rebuild it is necessary to access papi again."),(0,i.kt)("li",{parentName:"ul"},"you can disable the timeout by accessing the same papi using the DELETE method")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:"script",script:!0},"curl --location --request DELETE 'http://localhost:3000/tincoin/private/papi/debug-http-request'\n")),(0,i.kt)("h3",{id:"logging-requests-sent-to-the-server"},"Logging requests sent to the server"),(0,i.kt)("p",null,"In dev mode, all requests sent through the standard ",(0,i.kt)("inlineCode",{parentName:"p"},"http")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"https")," libraries for nodejs are logged under a special ",(0,i.kt)("inlineCode",{parentName:"p"},"server:node-debug:request")," key. This allows you to see all requests that have been sent to the server, even if no logging has been defined for the requests explicitly."),(0,i.kt)("p",null,"To enable such logging, simply add the ",(0,i.kt)("inlineCode",{parentName:"p"},"server:node-debug:request")," key to the ",(0,i.kt)("inlineCode",{parentName:"p"},"LOG_ENABLE")," environment variable"),(0,i.kt)("h3",{id:"health-checks"},"Health checks"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"em"},"/healthz"))," - always replies ",(0,i.kt)("inlineCode",{parentName:"li"},"OK")," after starting the application"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},(0,i.kt)("inlineCode",{parentName:"em"},"/readyz"))," - always replies ",(0,i.kt)("inlineCode",{parentName:"li"},"OK")," after starting the application")),(0,i.kt)("p",null,"Metrics"),(0,i.kt)("p",null,"The metrics module is automatically connected into the server module. For more information on metrics, you can read ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/modules/metrics"},"in the metrics documentation")),(0,i.kt)("h3",{id:"warming-application-caches"},"Warming application caches"),(0,i.kt)("p",null,"The cache-warmup module is automatically plugged into the server module. Detailed information on cache warmup can be found ",(0,i.kt)("a",{parentName:"p",href:"/docs/references/modules/cache-warmup"},"in cache-warmup documentation")),(0,i.kt)("h3",{id:"custom-headers"},"Custom headers"),(0,i.kt)("h4",{id:"building-and-deployment-information"},"Building and Deployment Information"),(0,i.kt)("p",null,"There are special headers in the module, which help to determine the exact information about the version of the built application, commit, branch, etc:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-app-id")," - The name of the application specified in ",(0,i.kt)("inlineCode",{parentName:"li"},"createApp"),". Specified in the application code."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-host")," - Hostname of the server where the current application is running. Computed in runtime."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-app-version")," - version of the running application. Transmitted through the environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"APP_VERSION"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-deploy-branch")," - branch from which the current application image was built. Passed through environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"DEPLOY_BRANCH"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-deploy-commit")," - sha commit from which current application image was built. Passed through environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"DEPLOY_COMMIT"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-deploy-version")," - deploy revision number in k8s. Passed through environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"DEPLOY_VERSION"),"."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("em",{parentName:"li"},"x-deploy-repository")," - application repository link. Passed through environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"DEPLOY_REPOSITORY"),".")),(0,i.kt)("p",null,"For all of the headers above which are passed via environment variables to be available, you need the external infrastructure to pass them when building and deprovisioning the application image (inside tinkoff this is done automatically)."),(0,i.kt)("h3",{id:"debugging"},"Debugging"),(0,i.kt)("p",null,"Module uses loggers with identifiers: ",(0,i.kt)("inlineCode",{parentName:"p"},"server"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"server:static"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"server:webapp"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"server:node-debug:request")),(0,i.kt)("h2",{id:"how-to"},"How to"),(0,i.kt)("h3",{id:"specify-server-port"},"Specify server port"),(0,i.kt)("p",null,"By default server starts at ",(0,i.kt)("inlineCode",{parentName:"p"},"3000")," port. You have next options to override this value depending on your environment:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"in dev environment")," port in fully controlled by ",(0,i.kt)("inlineCode",{parentName:"li"},"@tramvai/cli")," and should be specified by ",(0,i.kt)("a",{parentName:"li",href:"/docs/references/cli/start#-p---port"},(0,i.kt)("inlineCode",{parentName:"a"},"-p")," option")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"in prod environment")," it can be specified explicitly as an environment variable ",(0,i.kt)("inlineCode",{parentName:"li"},"PORT")," e.g. ",(0,i.kt)("inlineCode",{parentName:"li"},"PORT=8080"))),(0,i.kt)("h3",{id:"specify-port-for-utility-paths"},"Specify port for utility paths"),(0,i.kt)("p",null,"It includes: health checks, liveness checks, metrics."),(0,i.kt)("p",null,"By default port for utility paths equals ",(0,i.kt)("a",{parentName:"p",href:"#specify-server-port"},"base server port")," and they will use the same http server."),(0,i.kt)("p",null,"If you want to change this and run utility routes on different server with different port, use token ",(0,i.kt)("inlineCode",{parentName:"p"},"UTILITY_SERVER_PORT_TOKEN"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { UTILITY_SERVER_PORT_TOKEN } from '@tramvai/tokens-server';\n\nconst providers = [\n  {\n    provide: UTILITY_SERVER_PORT_TOKEN,\n    useValue: 6532,\n  },\n];\n")),(0,i.kt)("p",null,"Or use env variable ",(0,i.kt)("inlineCode",{parentName:"p"},"UTILITY_SERVER_PORT")," with defined value."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"env UTILITY_SERVER_PORT=6532 tramvai start app\n")),(0,i.kt)("h2",{id:"exportable-tokens"},"Exportable tokens"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/docs/references/tokens/server"},"Link")))}u.isMDXComponent=!0}}]);