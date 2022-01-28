---
id: universal
title: Separating code for server and client
---

The tramvai framework and its core components are universal and work equally well in all environments. tramvai cli collects server and client code into separate assemblies. At the same time, it is required to manually control the execution of user code in the required environment. The main mechanisms for this are package.json, dependency injection and direct checks in the code against the environment.


Learn more about how webpack picks the right files for different `target`, [in this article](https://www.jonathancreamer.com/how-webpack-decides-what-entry-to-load-from-a-package-json/).

User code that depends on the environment can be divided into several types:

- Application code
- npm libraries
- tramvai modules and DI providers

### Application code

To execute branches of code or in specific environments, several checks can be used:

#### process.env

When building a project, tramvai cli sets two variables indicating the environment - `process.env.SERVER` and `process.env.BROWSER`. Webpack will automatically remove code with a condition that does not match the current environment, for example, the following code will not be included in the server bundle:

```javascript
if (process.env.BROWSER) {
  console.log(window.innerWidth, window.innerHeight);
}
```

To exclude code from a production build, regardless of the environment, you can use the variable `process.env.NODE_ENV`:

```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('отладочная информация');
}
```

To exclude imported libraries from the assembly, you need to replace the top-level `import` with `require` inside the condition:

```javascript
if (process.env.BROWSER) {
  const logger = require('@tinkoff/logger');
  const log = logger('debug');

  log.info(window.location.href);
}
```

#### typeof window

For additional optimizations, the [babel plugin](https://github.com/FormidableLabs/babel-plugin-transform-define) is used, which turns `typeof window` from the server assembly to `'undefined'`, and from the client assembly to `'object'`, which allows webpack to cut out unnecessary code, for example, the following condition works similarly to checking `process.env.BROWSER`:

```javascript
if (typeof window !== 'undefined') {
  console.log(window.innerWidth, window.innerHeight);
}
```

#### package.json

If we needed to replace a whole file, and not specific lines of code, we can move it to a separate folder, describe the implementation for all environments, and add `package.json`:

```javascript
// module.server.js
export const CONSTANT = 'SERVER_SIDE';
```

```javascript
// module.client.js
export const CONSTANT = 'CLIENT_SIDE';
```

Next, in `package.json`, you need to tell the bundler which code to use for different environments. The `main` field is used for the server bundle, and the `browser` field is used for the client bundle:

```json
{
  "main": "./module.server.js",
  "browser": "./module.client.js"
}
```

### npm packages

To create a library, the implementation of which should be different on the server and the client, you need to maintain a common export interface, and configure `package.json` in the same way as in the previous example. For example, the library exports the class `Library`, and the constant `LIBRARY_CONSTANT`.

Let's create two entry points to our library - `server.js` и `client.js`:

```javascript
// server.js
export class Library {
  constructor() {
    // ...
  }
}

export const LIBRARY_CONSTANT = 'SERVER_SIDE_LIBRARY';
```

```javascript
// client.js
export class Library {
  constructor() {
    // ...
  }
}

export const LIBRARY_CONSTANT = 'CLIENT_SIDE_LIBRARY';
```

Next, in `package.json`, you need to tell the bundler which code to use for different environments. The `main` field is used for the server bundle, and the `browser` field is used for the client bundle:

```json
{
  "name": "library",
  "version": "0.1.0",
  "main": "server.js",
  "browser": "client.js",
  "dependencies": { ... }
}
```

After publishing the library, you can import it into the tramvai application, and not worry about which implementation we get:

```javascript
import { LIBRARY_CONSTANT } from 'library';

// when starting the application via tramvai start, we will see 'SERVER_SIDE_LIBRARY' in the terminal, and 'CLIENT_SIDE_LIBRARY' in the browser console
console.log(LIBRARY_CONSTANT);
```

### tramvai modules

New functionality in the tramvai application is added using modules, and as a rule, the behavior of these modules is radically different in different environments, for example:

- Rendering the application to a string on the server and hydrating the real DOM on the client
- Start https server
- Service worker initialization

For this reason, in the tramvai repository, the standard tramvai module template generated via the `npm run generate: module` command immediately separates the module entry points into `server.js` and `client.js` using `package.json`

Let's analyze this using the example of creating a module that adds a service to the application for working with `cookie`:

This service should have a common interface:

```tsx
export interface ICookie {
  get(key);
  set(key, value);
}
```

And different implementations for server and client environments:

```tsx
// src/cookie.server.ts
// server-side implementation requires Request and Response objects to work with cookies
export class Cookie implements ICookie {
  constructor({ req, res }) {
    // ...
  }
  get(key) {
    // ...
  }
  set(key, value) {
    // ...
  }
}
```

```tsx
// src/cookie.client.ts
// the client implementation accesses the Window object directly
export class Cookie implements ICookie {
  get(key) {
    // ...
  }
  set(key, value) {
    // ...
  }
}
```

Add a service to DI using modules:

```tsx
// src/server.ts
import { Module, Scope, provide } from '@tramvai/core';
import { REQUEST, RESPONSE } from '@tramvai/tokens-common';
import { Cookie } from './cookie.server';

@Module({
  providers: [
    provide({
      provide: 'cookie',
      useClass: Cookie,
      scope: Scope.REQUEST,
      deps: {
        req: REQUEST,
        res: RESPONSE,
      },
    }),
  ],
})
export class CookieModule {}
```

```tsx
// src/client.ts
import { Module, Scope, provide } from '@tramvai/core';
import { Cookie } from './cookie.client';

@Module({
  providers: [
    provide({
      provide: 'cookie',
      useClass: Cookie,
      scope: Scope.SINGLETON,
    }),
  ],
})
export class CookieModule {}
```

Configure `package.json`:

```json
{
  "name": "@tramvai/module-cookie",
  "version": "0.1.0",
  "main": "lib/server.js",
  "browser": "lib/client.js",
  "dependencies": { ... }
}
```

After importing the module into the application, we get universal access to cookies, and do not think about the environment when using:

```tsx
import { createApp, commandLineListTokens, provide } from '@tramvai/core';
import { CookieModule } from '@tramvai/module-cookie';

createApp({
  name: 'app',
  modules: [
    // ...
    CookieModule,
  ],
  providers: [
    // ...
    provide({
      provide: commandLineListTokens.init,
      useFactory: ({ cookie }) => {
        console.log('wuid', cookie.get('wuid'));
      },
      deps: {
        cookie: 'cookie',
      },
    }),
  ],
  // ...
});
```
