---
id: core-modules
title: Required modules
sidebar_position: 4
---

Some modules provide basic functionality `tramvai`, without which the application will not work.
Below is a list of such modules with a short description, a detailed description is in the [modules](references/modules/common.md) section.
Modules marked as `optional` are not required, but used in many applications.

### Connecting a new module

Connecting a module to an application consists of two steps:

#### Installing a module

```bash
npm install @tramvai/module-common
```

#### Adding to application

```tsx
import { CommonModule } from '@tramvai/module-common';

createApp({
  name: 'new-app',
  modules: [
    CommonModule,
    // ...
  ],
  // ...
});

```

### CommonModule

The most basic module, which should always be connected and at the same time should be set to the first in the list of modules (the position of the module determines the priority of the providers included in the DI - the lower the module, the higher the priority of its providers, therefore the presence of a CommonModule as the first module will allow other modules to override which one of basic tramvai functionality).

Contains:

- implementation of actions
- bundle manager
- in-app cache manager
- team commander
- application component register
- context
- base logger
- module manager
- pubsub
- server request and response manager
- state-manager

### RenderModule

The module responsible for rendering the application. Renders a React app on the server and builds the entire html page. On the client, it hydrates the layout on the first render and updates the render when the application route changes.

### RouterModule

Application routing: allows you to get information about the current route, make spa transitions, etc. Used by other modules for their work (for example, RenderModule uses it to determine which components should be rendered now). Allows you to set fixed routes in the application through the RouterModule.forRoot method. If fixed routes are not specified, then the ApiClientModule will be required to load data from the admin panel.

### ServerModule

The module is a starting server based on express. Also adds work with papi methods

### HttpClientModule

Module for working with HTTP requests.

### ErrorIntercepterModule (optional)

Adds interceptions of global errors and logging of such errors.

### LogModule (optional)

This is not required. Replaces the implementation from CommonModule. However, with this module, the logs will be better formatted, filtered and it will be possible to send logs from the client to the api logs.

### SeoModule (optional)

Adds meta tags to the page, based on the route or explicitly given data in the application.

### CacheWarmupModule (optional)

A module for warming up caches on the server when launching an application in production.

### Additional links

The following links contain descriptions of terms `action`, `dependency injection` и `state management`

- [Action](concepts/action.md)
- [Dependency Injection](concepts/di.md)
- [State management](references/tramvai/state/base.md)
