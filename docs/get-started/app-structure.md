---
id: app-structure
title: Project structure
sidebar_position: 3
---

A quick overview of the structure of the application that generates by tramvai `new` command.
At the same time, we support both monorepositories and repositories with one application.
Repository type, package manager and testing framework settings are selected when the command `new` executed.

We recommend follow [feature-sliced methodology](https://feature-sliced.design/) guidlines to structure application code.

### Repository type

#### Multirepo

The repository structure is designed for one application

```bash
root-directory
├── tramvai.json - project configuration for `@tramvai/cli`
├── env.development.js - environment variables used for local builds of the project
└── src - application code directory
    └── App block
```

#### Monorepo

The repository structure is designed for the presence of several applications, and separate shared libraries

```bash
root-directory
├── tramvai.json - project configuration for `@tramvai/cli`
├── env.development.js - environment variables used for local builds of the project
├── apps - directory with applications
│   ├── App block
│   ├── App block
└── packages - a directory with various libraries / modules that will be shared between applications
    ├── Lib block
    └── Lib block
```

### Blocks

#### Application

```bash
app-directory
├── index.ts - application entry point, where all tramvai modules are connected
├── vendor.ts - file with vendor dependencies, will be extracted into a separate js chunk
├── polyfill.ts - polyfills used by the application (absent by default)
├── postcss.js - postcss configuration object 
├── shared - reused modules of the application
└── routes - application pages
```

<!-- #### Library

```bash
@todo
``` -->

### Additional links

The following links provide detailed definitions of terms `bundle`, `module` and a description of the settings `tramvai.json`

- [Module](concepts/module.md)
- [Bundle](concepts/bundle.md)
- [Tramvai CLI settings](references/cli/base.md)
