---
id: new-app
title: Create application
---

## Introduction

In this tutorial we will create a `tramvai` application using the main features of the framework.

For interactivity we will use the wonderful public API - [pokeapi](https://pokeapi.co/) as a backend.

And we will create a real `Pokedex`!

## Creating a new application

For development, build and code generation there is a special CLI [@tramvai/cli](references/cli/base.md)

:hourglass: Generate a template for the new application, name it `pokedex`:

```bash
npm init @tramvai@latest pokedex
```

During the execution of the command you will need to select a base template, a package manager and a test framework. The command will create a new `pokedex` directory, and generate an application skeleton in it, then install the dependencies.

:hourglass: Go to the application folder, and run application in `development` mode:

```bash
cd pokedex && npm start
```

The `npm start` under the hood will execute the `tramvai start pokedex` command, which will build the server and client code of the application, and start the server at `http://localhost:3000/`

:::note

Most `tramvai` commands run [automatic migrations](features/migration.md) and tramvai libraries version checking in the application, so do not be scared of unexpected logs after running `npm start`. Of course, migrations and version checks are not necessary for a freshly created application, but these actions may be useful for future upgrades.

:::

:hourglass: Go to [http://localhost:3000/](http://localhost:3000/)

After loading, you will see a welcome page with the header **Tramvai 🥳**

## Application structure

A detailed overview of the application structure can be found in [Project structure](01-get-started/02-quick-start.md#application-structure) and in the `README.md` file of our new application.

We recommend using [feature-sliced methodology](https://feature-sliced.design/) to structure the code, which may be overkill for small demonstration applications, but will have a good effect on the structure of the application when it is further developed.

**[Next lesson](02-tutorial/02-add-page.md)**
