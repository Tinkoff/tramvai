"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2828],{3905:(e,t,a)=>{a.d(t,{Zo:()=>c,kt:()=>h});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},c=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=s(a),h=i,m=u["".concat(p,".").concat(h)]||u[h]||d[h]||o;return a?n.createElement(m,r(r({ref:t},c),{},{components:a})):n.createElement(m,r({ref:t},c))}));function h(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,r=new Array(o);r[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,r[1]=l;for(var s=2;s<o;s++)r[s]=a[s];return n.createElement.apply(null,r)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},2896:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>p,default:()=>h,frontMatter:()=>l,metadata:()=>s,toc:()=>d});var n=a(7462),i=a(3366),o=(a(7294),a(3905)),r=["components"],l={id:"deploy",title:"Deployment"},p=void 0,s={unversionedId:"guides/deploy",id:"guides/deploy",title:"Deployment",description:"Introduction",source:"@site/tmp-docs/guides/deploy.md",sourceDirName:"guides",slug:"/guides/deploy",permalink:"/docs/guides/deploy",draft:!1,editUrl:"https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md/tmp-docs/guides/deploy.md",tags:[],version:"current",frontMatter:{id:"deploy",title:"Deployment"},sidebar:"sidebar",previous:{title:"CPU profiling",permalink:"/docs/guides/cpu-profiling"},next:{title:"Error Boundaries",permalink:"/docs/guides/error-boundary"}},c={},d=[{value:"Introduction",id:"introduction",level:2},{value:"List of actions required to deploy the application",id:"list-of-actions-required-to-deploy-the-application",level:2},{value:"Build the project",id:"build-the-project",level:3},{value:"Create a docker container",id:"create-a-docker-container",level:3},{value:"Deploy static assets",id:"deploy-static-assets",level:3},{value:"Deploy application",id:"deploy-application",level:3},{value:"Explanation",id:"explanation",level:2},{value:"Probes",id:"probes",level:3},{value:"Launching an application without a client CDN",id:"launching-an-application-without-a-client-cdn",level:3},{value:"Run locally in a docker container",id:"run-locally-in-a-docker-container",level:3},{value:"We build the project in production mode, we will have an artifact in the dist directory",id:"we-build-the-project-in-production-mode-we-will-have-an-artifact-in-the-dist-directory",level:4},{value:"Build a docker application image",id:"build-a-docker-application-image",level:4},{value:"Run the created image",id:"run-the-created-image",level:4},{value:"To stop all containers",id:"to-stop-all-containers",level:4}],u={toc:d};function h(e){var t=e.components,a=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"introduction"},"Introduction"),(0,o.kt)("p",null,"Tramvai is a regular node.js application that can be run using standard tools available in the node.js community. Restrictions are only imposed on the file structure and the need to pass ENV variables to the application"),(0,o.kt)("h2",{id:"list-of-actions-required-to-deploy-the-application"},"List of actions required to deploy the application"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"build the application in production mode"),(0,o.kt)("li",{parentName:"ul"},"fill in assets"),(0,o.kt)("li",{parentName:"ul"},"build a docker container with application files"),(0,o.kt)("li",{parentName:"ul"},"run by passing ENV variables")),(0,o.kt)("h3",{id:"build-the-project"},"Build the project"),(0,o.kt)("p",null,"To build the project, you must use the command (before installing the dependencies in the project)"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"tramvai build APP_ID\n")),(0,o.kt)("p",null,"in APP_ID, you must pass the application identifier. After executing the command, the ",(0,o.kt)("inlineCode",{parentName:"p"},"dist")," directory will appear with the build files for the server and client code"),(0,o.kt)("h3",{id:"create-a-docker-container"},"Create a docker container"),(0,o.kt)("p",null,"Recommended Dockerfile"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-dockerfile"},'FROM node:18-buster-slim\nWORKDIR /app\nCOPY dist/server /app/\nCOPY package.json /app/\nENV NODE_ENV=\'production\'\n\nEXPOSE 3000\nCMD [ "node", "--max-http-header-size=80000", "/app/server.js" ]\n')),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"FROM")," - you can put a 16+ version of the node, preferably an alpine version to reduce the size")),(0,o.kt)("h3",{id:"deploy-static-assets"},"Deploy static assets"),(0,o.kt)("p",null,"The recommended way is to upload files to a CDN, since node.js does not do a very good job of serving static content, so there will be a lot of traffic for our infrastructure. Therefore, for production applications that clients will use, you should always use a CDN."),(0,o.kt)("p",null,"To do this, upload the contents of the ",(0,o.kt)("inlineCode",{parentName:"p"},"dist/client")," folder to the CDN according to the method you choose, you get the URL at which the files will be available and substitute this url into the ENV variable ",(0,o.kt)("inlineCode",{parentName:"p"},"ASSETS_PREFIX")," for example ",(0,o.kt)("inlineCode",{parentName:"p"},"ASSETS_PREFIX=https://cdn-domain.com/my-awesome-app/")),(0,o.kt)("p",null,'If you do not need a CDN, then you can see below in the paragraph "Launching an application without a client CDN", it is worth using for test benches or not loaded applications'),(0,o.kt)("h3",{id:"deploy-application"},"Deploy application"),(0,o.kt)("p",null,"The application is launched as a normal node.js process with the node command; when starting, it is necessary to pass all the necessary ENV variables (the list of ENVs depends on the modules used by the application). If you do not add ENV variables, the application will not start. Don't forget about the variable ",(0,o.kt)("inlineCode",{parentName:"p"},"ASSETS_PREFIX")),(0,o.kt)("h2",{id:"explanation"},"Explanation"),(0,o.kt)("h3",{id:"probes"},"Probes"),(0,o.kt)("p",null,"If you deploy to kubernetes, then for these cases there are special urls for probes that you need to use"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"/healthz")," - after starting the application, it always response OK"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("inlineCode",{parentName:"li"},"/readyz")," - after starting the application, it always response OK")),(0,o.kt)("h3",{id:"launching-an-application-without-a-client-cdn"},"Launching an application without a client CDN"),(0,o.kt)("p",null,"Tramvai has a built-in static return server. It is better not to do this, for the reason that nodeJS is not the best tool for this and static will affect the application."),(0,o.kt)("p",null,"In general, everything is the same as in a regular deployment, but you need to add copying user assets to the docker image, for this:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"add copy files ",(0,o.kt)("inlineCode",{parentName:"li"},"COPY dist/client /app/public/statics")),(0,o.kt)("li",{parentName:"ul"},"change ENV variable ASSETS_PREFIX")),(0,o.kt)("p",null,"Dockerfile example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-dockerfile"},'FROM node:18-buster-slim\nWORKDIR /app\nCOPY dist/server /app/\nCOPY package.json /app/\nCOPY dist/client /app/public/statics\nENV NODE_ENV=\'production\'\n\nEXPOSE 3000\nCMD [ "node", "--max-http-header-size=80000", "/app/server.js" ]\n')),(0,o.kt)("p",null,"When starting the application, you must pass ",(0,o.kt)("inlineCode",{parentName:"p"},"ASSETS_PREFIX=/statics/"),". When the application starts, the server for serving statistics will rise and all files inside the /public/ directory will be available. Thus, the client will be able to receive data on the url /statics/payment.js"),(0,o.kt)("h3",{id:"run-locally-in-a-docker-container"},"Run locally in a docker container"),(0,o.kt)("p",null,"The device must have ",(0,o.kt)("a",{parentName:"p",href:"https://www.docker.com/products/docker-desktop"},"https://www.docker.com/products/docker-desktop")," installed and run the command ",(0,o.kt)("inlineCode",{parentName:"p"},"docker run hello-world")),(0,o.kt)("h4",{id:"we-build-the-project-in-production-mode-we-will-have-an-artifact-in-the-dist-directory"},"We build the project in production mode, we will have an artifact in the dist directory"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn build\n")),(0,o.kt)("h4",{id:"build-a-docker-application-image"},"Build a docker application image"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker build -t test/myapp .\n")),(0,o.kt)("h4",{id:"run-the-created-image"},"Run the created image"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker run --rm -e DANGEROUS_UNSAFE_ENV_FILES='true' -e ASSETS_PREFIX='http://localhost:4000/static/' -v ${PWD}/env.development.js:/app/env.development.js -v ${PWD}/dist/client:/app/static  -e DEV_STATIC=true -p 3000:3000 -p 4000:4000 -d test/myapp\n")),(0,o.kt)("p",null,"To stop the container, you need to get the CONTAINER ID, run the docker ps command and then run the command docker stop <CONTAINER ID",">"),(0,o.kt)("h4",{id:"to-stop-all-containers"},"To stop all containers"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"docker kill $(docker ps --quiet)\n")))}h.isMDXComponent=!0}}]);