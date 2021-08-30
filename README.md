# Tramvai

A modular framework for universal JS applications

---
## Features

- ✈️ **Universal**

  Creates SSR `React` applications - includes solid server with metrics, health checks and graceful degradation support

- 🧱 **Modular**

  Provide simple and powerful DI system - every application build from list of feature modules, best practices from `Angular` and `Nest.js` ecosystem

- ⚡ **Fast and lightweight**

  Enforce best web-performance techniques - resources preloading and inlining, lazy hydration 🚀, modern ES bundles, tree-shakable libraries

- 🔗 **Actions chain**

  Elegant pattern for complete control over application life-cycle - predictable flow for every HTTP request into application, running async actions in parallel, limits the duration of server-side actions

- 🛠️ **Tooling**

  Functional CLI for generating, develop, analyze, and bundling `tramvai` applications - powered by `webpack@5`

- 🕊️ **Migrations**

  Automatic migrations with `jscodeshift` codemodes

## Get started

1. Install CLI

    ```bash
    npm i @tramvai/cli -g
    ```

1. Generate new application
    ```bash
    tramvai new my-awesome-app
    ```

1. Run development server
    ```bash
    cd my-awesome-app && npm start
    ```
    application will be available at `http://localhost:3000/`
