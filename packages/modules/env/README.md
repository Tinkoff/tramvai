# Env

The env module is used to retrieve global application environment variables in runtime and pass these parameters to the client.
With a pre-defined list of variables used by the application, dynamically extended and validated at application startup

## Installation

Already supplied inside `@tramvai/module-common` and does not need to be installed if module-common is connected.

Otherwise, you need to install `@tramvai/module-environment`

## Explanation

### Dynamically generated list of used env variables

All the parameters used in the application are registered by implementing the `ENV_USED_TOKEN` token in the DI and it is assumed that each module individually registers only the env parameters it needs. In this case, when a module is connected, there will be automatic validation of all passed parameters that are necessary for the application to work

```tsx
import { provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [
        { key: 'DEBUG_MODULE' },
        { key: 'DEBUG_MODULE_URL' },
      ],
      multi: true,
    }),
  ],
})
export class MyModule {}
```

In the above example, the module registers several env tokens, which will be initialized and will be available in `environmentManager.get('DEBUG_MODULE')`. In doing so, the `optional` parameter has been passed, which indicates that the variables are not required for the application to work.

### Validation of environment variables values

When the application starts, it checks the tokens that were registered in the DI and passed to env at startup. If all required env variables have not been passed to the application, the application will crash.

It is also possible to write validators for env values, which will run when the application is initialized.

```tsx
import { provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: ENV_USED_TOKEN,
      useValue: [
        {
          key: 'MY_ENV',
          validator: (env) => {
            if (!env.includes('https')) {
              return 'Incorrect link format. The link should contain https';
            }
          },
        },
      ],
      multi: true,
    }),
  ],
})
export class MyModule {}
```

### Functionality works on the server and in the browser

All env variables will be available both on the server and in the browser without any additional actions or settings. Env variables that have `dehydrate: true` are automatically passed to the browser

### Priority of obtaining values for env variables

Since it is possible to overwrite the values of the variables, the variables are replaced according to certain rules

The replacement rules are arranged in order of priority, from lower to higher:

- Parameters set in tokens `{ key: 'ENV_PARAM', value: 'env value' }`
- Parameters written in `env.development.js` file
- Passing application launch parameters `MY_ENV=j node server.js`

## API

<p>
<details>
<summary>Exported tokens and TS interface</summary>

@inline ../../tokens/common/src/env.ts

</details>
</p>

## How to

### How to read data in an application

Suppose we registered the parameter `CONFIG_API` used by env with the `ENV_USED_TOKEN` token, now we need to connect environmentManager in the application and read the data:

```tsx
import { provide } from '@tramvai/core';

@Module({
  providers: [
    provide({
      provide: 'MY_SERVICE',
      useClass: class MyService {
        constructor({ environmentManager }) {
          console.log(environmentManager.get('CONFIG_API'));
        }
      },
      deps: {
        environmentManager: ENV_MANAGER_TOKEN,
      },
    }),
  ],
})
export class MyModule {}
```

This code will work both on the server and in the browser

### How you can simply pass parameters in local development

To do this, create a file `env.development.js` in the root of the project and write all env variables for the application. When the application is initialized, this file will be read.

#### Peculiarities of using env.developmen.js in production builds

The [twelve factors](https://12factor.net/ru/config) application stores the configuration in environment variables, so by default when `process.env.NODE_ENV === 'production'` EnvironmentManger will not read the `env.development.js` file.

If you want to test the application locally with `NODE_ENV=production`, you can pass the flag `DANGEROUS_UNSAFE_ENV_FILES='true'` so that EnvironmentManger will read the `env.development.js` file and not have to enter all variables by hand.

### How to pass env parameters to the application during the deploys

To do this, pass env parameters when starting the application. For example in Docker you can do this with the parameter -e `docker run -e MY_ENV_VAR=/ my-image`.

### How to view all env variables of an application

> This method allows you to see only client variables

To get a list of variables, there is a `/papi/apiList` method

Request example: `http://localhost:3000/${appName}/papi/apiList`

### How to make an ENV variable optional?

To do this, pass `optional: true` parameter. For example { key: 'DEBUG_MODULE', optional: true }
