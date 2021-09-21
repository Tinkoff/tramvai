---
id: routing
title: Introduction
---

At the lowest level, routing is based on the [@tinkoff/router](references/libs/router.md) library, which provides convenient hooks for all stages of the router lifecycle. Special modules are involved in integrating the router into the application. It is expected that all application routes are described in the admin area, but it is possible to set static routes at the application code level.

[NoSpaRouterModule](references/modules/router.md) creates a router instance, initializes a router for routing and synchronizes it with a router, registers actions, bundles, validators, redirects and other features to the corresponding router hooks.

[SpaRouterModule](references/modules/router.md) switches the router to use the History API on the client.

To use all these features in the application, it is enough to install and enable [@tramvai/module-router](references/modules/router.md)
