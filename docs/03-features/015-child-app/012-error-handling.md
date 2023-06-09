---
id: error-handling
title: Error Handling
---

### Error while loading child-app configs

Child-app configs might be loaded with providers for multi token `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` that are implemented in custom modules or in the app code.

Error that were raised in custom providers will be logged as errors under `child-app:resolution-config` key. After that there errors will be ignored and won't affect other resolutions, but the configs that could be loaded with that provider will be lost.

### Child-app with specified name was not found

There is 2 causes that may lead to missing child-app in config:

- configs defined through `CHILD_APP_RESOLUTION_CONFIGS_TOKEN` was failed and therefore there is no info about used child-app
- wrong naming of child-app

In any of that causes the error about missing child-app will be logged and the render for it will just return null.

If you are facing that problem first check the logs about errors for loading child-app configs than check that naming is right and such child-app exists in your configs.

### Failed to load child-app code

Request to child-app code can fail by various causes.

If request has failed on server side the script tag with link to child-app client code will still be added to the html in order to try to load the child-app on client side. It will render fallback if provided or null on SSR (wrapped in Suspense for react@18) in that case and will try to resolve and render the child-app on the client.

If request has failed on client side it will render [fallback](#fallback) passing error or the default errorBoundary component.

### Error during child-app render

Errors that happens inside child-app's render function

If render has failed on server side it will render fallback if provided or null otherwise. It may then proper rehydrated on client side.

If render has failed on client side it will render fallback with error if provided or default errorBoundary component

### Error in commandLine handler

Any errors inside child-app commandLine execution will be logged and won't affect the execution of the root-app.
