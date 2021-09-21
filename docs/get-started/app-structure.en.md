---
id: app-structure
title: Project structure
---

A quick overview of the structure of the application that generates by tramvai `new` command.
At the same time, we support both mono-repositories and repositories with one application.
Repository type, package manager and CI settings are selected when the command `new` executed.

### Repository type

#### Multirepo

The repository structure is designed for one application

```bash
root-directory
├── package.json - description of project dependencies
├── tramvai.json - project configuration for `@tramvai/cli`
├── env.development.js - environment variables used for local builds of the project
├── renovate.json - settings for renovatebot, which automatically creates MR in projects when there are fresh major dependency updates
├── README.md - project documentation
└── src - application code directory
    └── ...App block
```

#### Monorepo

The repository structure is designed for the presence of several applications, and separate shared libraries

```bash
root-directory
├── package.json - description of project dependencies
├── tramvai.json - project configuration for `@tramvai/cli`
├── env.development.js - environment variables used for local builds of the project
├── renovate.json - settings for renovatebot, which automatically creates MR in projects when there are fresh major dependency updates
├── README.md - project documentation
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
├── index.ts - application entry point
├── vendor.ts - description of the vendor application dependencies (react and react-dom by default)
├── polyfill.ts - polyfills used by the application (absent by default)
├── postcss.js - basic set of postcss settings 
├── bundles - list of connected bundles in the application
├── components - directory with used components by the application
│   ├── features - feature components
│   └── shared - shared components
├── layers
│   ├── layout - global wrappers used in routing
│   ├── pages - page components that are used in routing
├── modules - custom modules written for the application (absent by default)
└── reducers - global reducers, events and selectors (absent by default)
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
