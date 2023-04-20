---
id: known-issues
title: Known Issues
---

### This Suspense boundary received an update before it finished hydrating

When `React` >= `18` version is used, child-app will be wrapped in `Suspense` boundary for [Selective Hydration](https://github.com/reactwg/react-18/discussions/130). This optimization can significantly decrease Total Blocking Time metric of the page.

There is one drawback of this optimization - if you will try rerender child-app during selective hydration, `React` will switch to deopt mode and made full client-rendering of the child-app component. Potential ways to fix this problem [described here](https://github.com/facebook/react/issues/24476#issuecomment-1127800350). `ChildApp` component already wrapped in `React.memo`.

Few advices to avoid this problem:

- Memoize object, passed to child-app `props` property
- Prevent pass to child-app properties, which can be changed during hydration, for example at client-side in page actions

### Shared dependency are still loaded although the root-app shares it

Refer to the [FAQ](#faq-about-shared-dependencies) about the details. In summary:
- it is more reliable to provide shared dependency from the root-app than relying on sharing between several child-apps
- make sure all versions of the shared dependencies are semver compatible

### Token with name already created!

The issue happens when `@tinkoff/dippy` library is shared due to fact that root-app and child-apps will have separate instances of the same tokens packages with the same naming.

For now, just ignore that kind of warnings during development. In producation these warnings won't be shown

### Possible problems with shared dependency

#### react-query: No QueryClient set, use QueryClientProvider to set one

The issue may happen if there are different instances of `@tramvai/module-react-query` and `@tramvai/react-query` and therefore internal code inside `@tramvai/react-query` resolves React Context that differs from the QueryClient Provided inside `@tramvai/module-react-query`

To resolve the issue:
- when defining shared dependencies add both `@tramvai/module-react-query` and `@tramvai/module-react-query`
- make sure that both packages are used in the root-app (or none) as both instances should resolve to one place and if it isn't apply then for example `@tramvai/react-query` might instantiate with different React Context
- another option would be to add underlying library `@tanstack/react-query` to both child-app and root-app shared dependencies to make sure that required React Context is created only in single instance
