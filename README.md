# [<img src="tools/docSite/static/img/logo/tramvai-yellow-full.svg" alt="taiga ui logo" height="32px">](https://tramvai.dev/)

Modular framework for universal React applications

---

## Features

- ✈️ **Universal**

  Creates SSR `React` applications - includes solid server with metrics, health checks and graceful degradation support

- 💉 **Dependency Injection**

  Provides simple and powerful DI system, inspired by `Angular` and `Nest.js` best practices

- 🧩 **Modular**

  Every application build from list of feature modules - doing one thing right!

- ⚡ **Fast and lightweight**

  Enforces best web-performance techniques - resources preloading and inlining, lazy hydration 🚀, modern ES bundles, tree-shakable libraries

- 🔗 **Chain of commands**

  Elegant pattern for complete control over application life-cycle - predictable flow for every HTTP request into application, running async actions in parallel, limits the duration of server-side actions

- 🧱 **Micro Frontends**

  Heavily integrated solution for Micro Frontends with SSR and Module Federation

- 🛠️ **Tooling**

  Functional CLI for generating, develop, analyze, and bundling `tramvai` applications - powered by `webpack@5`

- 🧪 **Testing**

  Complete set of unit and integration testing utilites - powered by `jest` and `testing-library`

- 🕊️ **Migrations**

  Automatic migrations with `jscodeshift` codemodes

## Get started

1. Generate new application

   ```sh
   npm init @tramvai@latest my-awesome-app
   ```

2. Run development server
   ```bash
   cd my-awesome-app && npm start
   ```
   application will be available at `http://localhost:3000/`

## Tutorials

[Pokedex application](https://tramvai.dev/docs/tutorials/pokedex-app/new-app)

## Sandboxes

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/tramvai-new-qgk90?fontsize=14&hidenavigation=1&theme=dark)
