(self.webpackChunk=self.webpackChunk||[]).push([[7908],{3905:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>d,kt:()=>h});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),u=c(n),h=o,m=u["".concat(l,".").concat(h)]||u[h]||p[h]||i;return n?a.createElement(m,r(r({ref:t},d),{},{components:n})):a.createElement(m,r({ref:t},d))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,r[1]=s;for(var c=2;c<i;c++)r[c]=n[c];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4977:(e,t,n)=>{"use strict";n.r(t),n.d(t,{frontMatter:()=>s,contentTitle:()=>l,metadata:()=>c,toc:()=>d,default:()=>u});var a=n(2122),o=n(9756),i=(n(7294),n(3905)),r=["components"],s={id:"command-line-runner",title:"Actions chain"},l=void 0,c={unversionedId:"concepts/command-line-runner",id:"concepts/command-line-runner",isDocsHomePage:!1,title:"Actions chain",description:"When processing a client request, we need to perform a standard list of actions, such as getting a route, getting the desired data for the client, rendering the application and responding to the client. At the same time, we have a modular system, when the modules do not know about each other, but they need to be connected somehow.",source:"@site/tmp-docs/concepts/command-line-runner.md",sourceDirName:"concepts",slug:"/concepts/command-line-runner",permalink:"/en/docs/concepts/command-line-runner",editUrl:"https://github.com/TinkoffCreditSystems/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/concepts/command-line-runner.md",version:"current",frontMatter:{id:"command-line-runner",title:"Actions chain"},sidebar:"docs",previous:{title:"Module",permalink:"/en/docs/concepts/module"},next:{title:"Action",permalink:"/en/docs/concepts/action"}},d=[{value:"Usage example",id:"usage-example",children:[]},{value:"Action blocks",id:"action-blocks",children:[{value:"Initialization (init)",id:"initialization-init",children:[]},{value:"Handling customer requests",id:"handling-customer-requests",children:[]},{value:"SPA transitions (spa)",id:"spa-transitions-spa",children:[]},{value:"Shutdown (close)",id:"shutdown-close",children:[]}]},{value:"Tokens",id:"tokens",children:[{value:"init",id:"init",children:[]},{value:"listen",id:"listen",children:[]},{value:"customer_start",id:"customer_start",children:[]},{value:"resolve_user_deps",id:"resolve_user_deps",children:[]},{value:"resolve_page",id:"resolve_page",children:[]},{value:"resolve_page_deps",id:"resolve_page_deps",children:[]},{value:"generate_page",id:"generate_page",children:[]},{value:"clear",id:"clear",children:[]},{value:"spa_transition",id:"spa_transition",children:[]},{value:"close",id:"close",children:[]}]},{value:"Errors in stages",id:"errors-in-stages",children:[]},{value:"Customization",id:"customization",children:[]}],p={toc:d};function u(e){var t=e.components,s=(0,o.Z)(e,r);return(0,i.kt)("wrapper",(0,a.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"When processing a client request, we need to perform a standard list of actions, such as getting a route, getting the desired data for the client, rendering the application and responding to the client. At the same time, we have a modular system, when the modules do not know about each other, but they need to be connected somehow."),(0,i.kt)("p",null,"To solve this problem, ",(0,i.kt)("inlineCode",{parentName:"p"},"commandLineRunner")," was developed, which contains a fixed list of steps in which modules can add the necessary tasks through providers. All steps are executed sequentially, but the tasks registered for each individual step are executed in parallel."),(0,i.kt)("h2",{id:"usage-example"},"Usage example"),(0,i.kt)("p",null,"We have registered a new provider that will be called when ",(0,i.kt)("inlineCode",{parentName:"p"},"commandLineRunner")," reaches the ",(0,i.kt)("inlineCode",{parentName:"p"},"commandLineListTokens.generatePage")," token and the ",(0,i.kt)("inlineCode",{parentName:"p"},"render")," function is executed:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { provide } from '@tramvai/core';\n@Module({\n  providers: [\n    provide({\n      provide: commandLineListTokens.generatePage,\n      useFactory: ({ responseManager }) => {\n        return function render() {\n          responseManager.setBody(ReactDOM.renderToString(<App />));\n        };\n      },\n      deps: {\n        responseManager: RESPONSE_MANAGER_TOKEN,\n      },\n      multi: true,\n    }),\n  ],\n})\nexport class RenderModule {}\n")),(0,i.kt)("h2",{id:"action-blocks"},"Action blocks"),(0,i.kt)("p",null,"A number of basic actions are predefined in the tramvai, which are performed at certain stages of the application. Based on these stages, the work of the basic tram modules is built and actions can be added to custom modules."),(0,i.kt)("h3",{id:"initialization-init"},"Initialization (init)"),(0,i.kt)("p",null,"When tramvai starts, a chain of actions is launched in which you can initialize asynchronous services (if necessary) and add basic functionality. These actions are performed only once and are not available to providers who need a custom context."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"init command",src:n(8081).Z})),(0,i.kt)("h3",{id:"handling-customer-requests"},"Handling customer requests"),(0,i.kt)("p",null,"For each client, we run a list of actions in which the user context and data are available. For each client, we create our own di context in which the implementations will live only while we process the client's request."),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"customer command",src:n(8795).Z})),(0,i.kt)("h3",{id:"spa-transitions-spa"},"SPA transitions (spa)"),(0,i.kt)("p",null,"For SPA transitions in the browser, routing triggers a list of actions"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"spa command",src:n(8728).Z})),(0,i.kt)("h3",{id:"shutdown-close"},"Shutdown (close)"),(0,i.kt)("p",null,"Before exiting the application, this list of actions is launched"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"close command",src:n(2306).Z})),(0,i.kt)("h2",{id:"tokens"},"Tokens"),(0,i.kt)("h3",{id:"init"},"init"),(0,i.kt)("p",null,"Initializing Asynchronous Services"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": If you need to initialize global singletons asynchronously"),(0,i.kt)("h3",{id:"listen"},"listen"),(0,i.kt)("p",null,"Subscribing to global events by the application"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": If you need to subscribe to global events or a port"),(0,i.kt)("h3",{id:"customer_start"},"customer_start"),(0,i.kt)("p",null,"The starting token in the client request processing chain. Required to initialize custom asynchronous constructors."),(0,i.kt)("p",null,"It is not advised to do any lengthy asynchronous tasks at this stage, as only synchronous actions are expected."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": To initialize asynchronous services for each client"),(0,i.kt)("h3",{id:"resolve_user_deps"},"resolve_user_deps"),(0,i.kt)("p",null,"The main goal of this stage is to find out all the necessary information about the client we are currently processing."),(0,i.kt)("p",null,"Since all actions within one stage are performed in parallel with us, it is at this stage that you can efficiently and quickly request all the necessary information, for example, simultaneously with the request for customer data, you can find out about the status of the customer's authorization, get analytical information about the customer and similar actions."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": To request any global customer information"),(0,i.kt)("h3",{id:"resolve_page"},"resolve_page"),(0,i.kt)("p",null,"The main goal of this stage is to find out all the necessary information about the page the client visited."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": To request information about the page"),(0,i.kt)("h3",{id:"resolve_page_deps"},"resolve_page_deps"),(0,i.kt)("p",null,"At this stage, we already know about the client, about what this page is. But, we have not requested the necessary data for the page. For example: request resources from the admin panel, get a list of regions, load the necessary page blocks. And all the information that will be needed when generating the page."),(0,i.kt)("p",null,"At this stage, it is not worth doing long asynchronous actions and it is supposed to be cached or moved to ",(0,i.kt)("inlineCode",{parentName:"p"},"resolveUserDeps")," to achieve the maximum speed of response to clients."),(0,i.kt)("p",null,"At this stage, ",(0,i.kt)("a",{parentName:"p",href:"/en/docs/concepts/action"},"action")," is executed and perhaps they will suit you better, as there are many additional functionality"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": To get the information needed to render the page"),(0,i.kt)("h3",{id:"generate_page"},"generate_page"),(0,i.kt)("p",null,"At this stage, we already know the current route, which client and all actions for the page have already been loaded. And at this stage, according to the information from the previous stages, we generate an html page and give it to the client"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": this is more of an internal stage and should not be used in ordinary cases. Since ",(0,i.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Race_condition"},"race condition")," with application rendering"),(0,i.kt)("h3",{id:"clear"},"clear"),(0,i.kt)("p",null,"This stage will be called after we have responded to the client, but some modules or libraries need to delete client data"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": The method is needed if you need to perform actions after a successful response to the user"),(0,i.kt)("h3",{id:"spa_transition"},"spa_transition"),(0,i.kt)("p",null,"Tasks registered at this stage are executed on SPA transitions in the application"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": To update meta information on the current page"),(0,i.kt)("h3",{id:"close"},"close"),(0,i.kt)("p",null,"Before closing the application, some modules may need to perform special actions, for example, close connections, send data and similar activities. In order not to duplicate the application closure tracking code in each module, this stage was made."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"For what"),": If you need to perform actions before closing the application. for example close connections, send logs and so on"),(0,i.kt)("h2",{id:"errors-in-stages"},"Errors in stages"),(0,i.kt)("p",null,"On the server side, you can intercept errors from ",(0,i.kt)("inlineCode",{parentName:"p"},"commandLineRunner")," stages by adding ",(0,i.kt)("inlineCode",{parentName:"p"},"express")," error middleware with a multi token ",(0,i.kt)("inlineCode",{parentName:"p"},"WEB_APP_AFTER_INIT_TOKEN"),".\nIn this middleware you can change the response status, headers and body, and end the response.\nFor example, exceptions when rendering React components from current page, get into this handler (",(0,i.kt)("inlineCode",{parentName:"p"},"Error Boundary")," not working at server-side)."),(0,i.kt)("p",null,"Middleware example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  provide: WEB_APP_AFTER_INIT_TOKEN,\n  multi: true,\n  useFactory: (deps) => {\n    return (app) => {\n      app.use((err, req: Request, res: Response, next) => {\n        next(err);\n      });\n    };\n  },\n  deps: {},\n},\n")),(0,i.kt)("h2",{id:"customization"},"Customization"),(0,i.kt)("p",null,"The application can override the standard list of actions, for example, delete unnecessary ones or add new ones."),(0,i.kt)("p",null,"To do this, you need to define a provider in the application or module that will rewrite the base list"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-tsx"},"import { provide } from '@tramvai/core';\n[\n  provide({\n    provide: COMMAND_LINES_TOKEN,\n    scope: 'singleton',\n    useValue: customLines,\n  }),\n];\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("em",{parentName:"strong"},"Caution")),": do not delete stages, as this may cause some modules to stop working correctly. In this case, the best solution would be to delete the module that is being linked to an unnecessary stage."))}u.isMDXComponent=!0},2306:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});const a=n.p+"assets/images/command-line-close-999a3cc053d7b4ed03d11c5b86b04522.jpg"},8081:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});const a=n.p+"assets/images/command-line-init-03a555026ef72a3e8b1a400a72fc6746.jpg"},8728:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});const a=n.p+"assets/images/command-line-spa-2e224e802651a136dd012000b77a94b2.jpg"},8795:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});const a=n.p+"assets/images/customer-command.drawio-266e8318ff23a30b3ee1eada63ef27d8.svg"}}]);