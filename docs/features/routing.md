---
id: routing
title: Introduction
---

At the lowest level, routing is based on the [@tinkoff/router](references/libs/router.md) library, which provides convenient hooks for all stages of the router lifecycle. Special modules are involved in integrating the router into the application. Basic functionality provides ability to use static routes but modules are extensible to integrate with some external router provider.

To use all these features in the application, it is enough to install and enable [@tramvai/module-router](references/modules/router.md)

## Base modules

- [NoSpaRouterModule](references/modules/router.md) - creates a router instance, initializes a router for routing and synchronizes it with a router, registers actions, bundles, validators, redirects and other features to the corresponding router hooks.
- [SpaRouterModule](references/modules/router.md) - same as previous plus switches the router to use the History API on the client.
