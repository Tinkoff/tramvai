---
id: deploy
title: Deployment
---

## Introduction

Tramvai is a regular node.js application that can be run using standard tools available in the node.js community. Restrictions are only imposed on the file structure and the need to pass ENV variables to the application

## List of actions required to deploy the application

- build the application in production mode
- fill in assets
- build a docker container with application files
- run by passing ENV variables

### Build the project

To build the project, you must use the command (before installing the dependencies in the project)

```bash
tramvai build APP_ID
```

in APP_ID, you must pass the application identifier. After executing the command, the `dist` directory will appear with the build files for the server and client code

### Create a docker container

Recommended Dockerfile

```dockerfile
FROM node:18-buster-slim
WORKDIR /app
COPY dist/server /app/
COPY package.json /app/
ENV NODE_ENV='production'

EXPOSE 3000
CMD [ "node", "--max-http-header-size=80000", "/app/server.js" ]
```

- `FROM` - you can put a 16+ version of the node, preferably an alpine version to reduce the size

### Deploy static assets

The recommended way is to upload files to a CDN, since node.js does not do a very good job of serving static content, so there will be a lot of traffic for our infrastructure. Therefore, for production applications that clients will use, you should always use a CDN.

To do this, upload the contents of the `dist/client` folder to the CDN according to the method you choose, you get the URL at which the files will be available and substitute this url into the ENV variable `ASSETS_PREFIX` for example `ASSETS_PREFIX=https://cdn-domain.com/my-awesome-app/`

If you do not need a CDN, then you can see below in the paragraph "Launching an application without a client CDN", it is worth using for test benches or not loaded applications

### Deploy application

The application is launched as a normal node.js process with the node command; when starting, it is necessary to pass all the necessary ENV variables (the list of ENVs depends on the modules used by the application). If you do not add ENV variables, the application will not start. Don't forget about the variable `ASSETS_PREFIX`

## Explanation

### Probes

If you deploy to kubernetes, then for these cases there are special urls for probes that you need to use

- `/healthz` - after starting the application, it always response OK
- `/readyz` - after starting the application, it always response OK

### Launching an application without a client CDN

Tramvai has a built-in static return server. It is better not to do this, for the reason that nodeJS is not the best tool for this and static will affect the application.

In general, everything is the same as in a regular deployment, but you need to add copying user assets to the docker image, for this:

- add copy files `COPY dist/client /app/public/statics`
- change ENV variable ASSETS_PREFIX

Dockerfile example

```dockerfile
FROM node:18-buster-slim
WORKDIR /app
COPY dist/server /app/
COPY package.json /app/
COPY dist/client /app/public/statics
ENV NODE_ENV='production'

EXPOSE 3000
CMD [ "node", "--max-http-header-size=80000", "/app/server.js" ]
```

When starting the application, you must pass `ASSETS_PREFIX=/statics/`. When the application starts, the server for serving statistics will rise and all files inside the /public/ directory will be available. Thus, the client will be able to receive data on the url /statics/payment.js

### Run locally in a docker container

The device must have https://www.docker.com/products/docker-desktop installed and run the command `docker run hello-world`

#### We build the project in production mode, we will have an artifact in the dist directory

```bash
yarn build
```

#### Build a docker application image

```bash
docker build -t test/myapp .
```

#### Run the created image

```bash
docker run --rm -e DANGEROUS_UNSAFE_ENV_FILES='true' -e ASSETS_PREFIX='http://localhost:4000/static/' -v ${PWD}/env.development.js:/app/env.development.js -v ${PWD}/dist/client:/app/static  -e DEV_STATIC=true -p 3000:3000 -p 4000:4000 -d test/myapp
```

To stop the container, you need to get the CONTAINER ID, run the docker ps command and then run the command docker stop <CONTAINER ID\>

#### To stop all containers

```bash
docker kill $(docker ps --quiet)
```
