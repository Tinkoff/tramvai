---
title: Memory leak
---

In case you are facing critical errors for the server like `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory` than this is probably caused by memory leak in your app.

## Local profiling

To find out root cause of the problem you need to analyze memory allocation on server over time.

### Start the app

1. You may use either `start` or `start-prod` command to profile your app, but keep in mind that `start` runs app in dev-environment that leads to higher memory consumption and additional code that may distract you from analyzing core logic of the app. However `start` is preferred when you need to make code changes and you do not need to get the exact values of memory usage as for the prod-environment.
2. Using `@tramvai/cli` you can pass a special flag [`--debug`](references/cli/base.md#debug-an-app) and pass it either to the `start` or `start-prod` command
3. You may pass any additional environment variables when calling cli commands as usual. For example, you may pass flag [`HTTP_CLIENT_CACHE_DISABLED`](references/modules/http-client.md#http-client#how-to-disable-http-request-caching) to disable http cache.
4. To pass additional flags to the running nodejs instance you may use env `NODE_OPTIONS`. E.g., if you want to limit the heap memory for the running server pass `NODE_OPTIONS="--max-old-space-size=256"`
5. If you are profiling using `start-prod` with different env values without code changes you can use start-prod command that will reuse previous builds, e.g. `tramvai start-prod -t none app --debug`

### Use the DevTools

After starting the app in debug mode you can open Chrome DevTools to be ready to take some profiling.

You may read more about how to profile memory leaks with Chrome in next links:

- https://medium.com/@basakabhijoy/debugging-and-profiling-memory-leaks-in-nodejs-using-chrome-e8ece4560dba#:~:text=Fire%20up%20the%20chrome%20browser
- https://developer.chrome.com/docs/devtools/memory-problems/#summary

### Test requests

Most of the time memory leaks are happens for every request, so you need to do some request.

1. Using browser go to the page that is handled by you app
2. Use any additional tools to make a bunch of requests, e.g. [autocannon](https://github.com/mcollina/autocannon)

### What to look

After you've started the app and took memory snapshots or memory allocations look for the data that stays in memory when it shouldn't.

#### ChildContainer

In context of the tramvai app look for the `ChildContainer` first as it is created for every request and contains the whole Request DI instance that consumes a lot of memory. It should be collected by the GC after request end, but sometimes some code may prevent it from collecting.

### Summary

1. [Start the app](#start-the-app)
2. [Start the DevTools](#use-the-devtools)
3. Check memory usage on start and take the initial memory snapshot
4. [Make some test requests](#test-requests)
5. Take another memory snapshot
6. Compare two snapshots and [look for the leaks or unusual memory consumption](#what-to-look)

### Example

1. Start app in prod-mode `yarn tramvai start-prod travelaviasearch --debug`
2. Start Chrome DevTools
3. Take the memory snapshot
4. Execute requests with `autocannon -c 20 -d 60 localhost:3000/travel/flights/`
5. Click the button `Collect garbage`
6. Take another memory snapshot
7. Compare two snapshots
8. If you want to test app with other envs stop the server and close the DevTools, then run it again with `HTTP_CLIENT_CACHE_DISABLED=true MOCKER_ENABLED=true NODE_OPTIONS="--max-old-space-size=256" yarn tramvai start-prod -t none travelaviasearch`
