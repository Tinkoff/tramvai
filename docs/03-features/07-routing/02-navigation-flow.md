---
id: flow
title: Navigation Flow
---

`tramvai` router is universal, and work both on server and client sides. But navigation flow is different for all environments and router modules. Also, router has it is own lifecycle, but this flow is embedded in `commandLineRunner` lifecycle.

## Server navigation

At server-side, router navigation will be executed at [resolve_user_deps](03-features/06-app-lifecycle.md#resolve_user_deps) command. Router `hooks` and `guards` will be launched in the process:

![Diagram](/img/router/navigate-flow-server.drawio.svg)

:::info

Router will run page actions at [resolve_page_deps](03-features/06-app-lifecycle.md#resolve_page_deps) stage.

:::

## Client initialization

After page load, router rehydration will be executed at [customer_start](03-features/06-app-lifecycle.md#customer_start) command. Only `guards` will be launched in the process:

![Diagram](/img/router/rehydrate-client.drawio.svg)

:::info

Router will run page actions (failed on server or client-side only) at [clear](03-features/06-app-lifecycle.md#clear) stage.

:::

## Client SPA navigation

All client navigations with SPA router have a lifecycle, similar to server-side flow. Router `hooks` and `guards` will be launched in the process:

![Diagram](/img/router/navigate-flow-client-spa.drawio.svg)

:::info

Router will run `commandLineRunner` stages `resolve_user_deps`, `resolve_page_deps` and `spa_transition` sequentially at `beforeNavigate` hook, and stage `after_spa_transition` on `afterNavigate` hook.

And as you can see, actions behaviour depends on `SPA actions mode`. This mode allows you to control when to execute actions - before target page rendering or after. More information about SPA Mode in [Documentation how to change SPA actions mode](03-features/07-routing/09-how-to.md#setting-when-actions-should-be-performed-during-spa-transitions)

:::

## Client NoSPA navigation

This flow is simple - just a hard reload for any navigations:

![Diagram](/img/router/navigate-flow-client-no-spa.drawio.svg)
