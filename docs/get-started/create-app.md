---
id: create-app
title: Сreate tramvai application
sidebar_position: 2
---

In this tutorial, we will create a new application using the tramvai framework.

For quick development, we will use the console utility **`@tramvai/cli`**

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/tramvai-new-qgk90?fontsize=14&hidenavigation=1&theme=dark)

### System setup

[NodeJS version 10+](https://nodejs.org/en/download) is required for tramvai and @tramvai/cli to work

### Generate application

Now we need to generate the application with `tramvai`

```sh
npm init @tramvai new-app # or npx @tramvai/create new-app
```

After starting, you need to select settings - project template, CI settings and package manager. For a quick start, the default settings are fine.

Then the command will generate a starter project with basic modules in the new-app directory

### Run application

Now we need to run our project in development mode, for easy development and to check that our project is working. To do this, execute the command

```bash
cd new-app && npm start
```

This command will start a server in dev mode that will monitor the server and client code. After executing the command, you can go to the address `http://localhost:3000/` and see the lifted clean application

### Project structure and application initialization process

The entry point of the project is `src/index.ts`, which creates an instance of the tramvai application and connects the necessary modules. The project has already connected basic modules that implement the following functionality:

- Getting routes (from the admin panel or static routes)
- Rendering the application on the server and client
- Starting the server for the application
- Providing services for working with external / internal API

> In this case, it is not necessary to use modules from the base tramvai set, you can write your own implementations that implement the interfaces of the base modules

When the application starts, the modules' dependencies are initialized and the commands from the chain of actions are executed, during which data requests from the API, rendering, etc. occur.

### Additional links

The links provide information on the structure of the project and the basic modules required for the full-fledged operation of the application.

- [Project structure](get-started/app-structure.md)
- [Required modules](get-started/core-modules.md)
