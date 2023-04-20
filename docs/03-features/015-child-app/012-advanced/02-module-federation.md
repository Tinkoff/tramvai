---
id: module-federation
title: Module Federation (shared dependencies)
---

## Explanation

Child-apps utilizes [Module Federation](https://webpack.js.org/concepts/module-federation/) feature of webpack.

That allows child-apps:
- share dependencies between child-apps and root-app
- fallbacks to loading dependencies on request if implementation for dependency was not provided before or version of the dependency not satisfies request

The list of default shared dependencies is very short as it can increase bundle size in cases when child-apps are not used.

The following dependencies are shared by default:
- react core packages (react, react-dom, react/jsx-runtime)
- @tramvai/react
- @tinkoff/dippy
- @tramvai/core

To add additional dependency follow [instructions](#add-dependency-to-shared-list)

### FAQ about shared dependencies

- **How shared dependencies look like?**. It mostly the implementation details but some info below might be useful for understanding:
  - if shared dependency is provided in root-app the dependency will built in the initial chunk of root-app and dependency will be available without any additional network requests (these dependencies are marked as `eager` in moduleFederation config)
  - if shared dependency is missing in the root-app then additional network request will be executed to some of child-app static files to load dependency code (the highest available version of dependency from all of child-apps will be loaded) i.e. additional js file with the name of shared dependency will be loaded on child-app usage.
- **How does shared dependencies affects root-app build?**. Using shared dependency slightly increases the generated bundle size. So it is preferred to make the list of shared dependencies as small as possible.
- **How versions of shared dependencies are resolved?**. Module federation will prefer to use the highest available version for the dependency but only if it satisfies the semver constraints of the all consumers. So it is preferred to use higher versions of the dependencies in the root-app and do not upgrade dependency versions in the child-apps without special need.
- **Dependency is added to list of shared but is not used by the app code**. Such dependency will not be provided and will not be available for consumption by other apps in that case.
- **How css is shared?**. Currently css are fully separated between root-app and child-app and child-app buid generates only single css file for the whole child-app
- **If two modules are using same shared dependency and root-app doesn't provide this dependency will the code for dep be loaded twice?**. It depends. On the client-side module federation will try to make only single network request, but with SSR it becomes a little more complicated and it is hard to resolve everything properly on server-side so sometimes it may lead to two network requests for different versions of the same dependency.
- **If version in child-app and root-app are not semver compatible**. Then child-app will load it's own version in that case as root-app cannot provide compatible version
- **Can I make sure the shared dependency is initialized only once across consumers?**. Yes, you can pass an object with `singleton` property instead of bare string in the tramvai.json config for shared dependency.
- **Should I add only high level wrapper of the dependencies I need to provide the list of all dependencies that I want to share?**. Better try different setups and see the output bundle size as it depends. The main rule is provide all of modules that might be imported by app code and that use the same low-level libraries. E.g. to share react-query integration add `@tramvai/module-react-query` and `@tramvai/react-query` to the shared dependencies
- **When building child-app I see two chunks related to the same package**. It happens due to some of caveats how module federation works. But anyway most of the time only single chunk will be used for the package, so just ignore the fact that in generated files you see two chunks.

## Usage

### Add dependency to shared list

:::tip

To get most of the sharing dependencies add dependency both for root-apps that uses child-apps with the dependency and child-apps that uses the dependency

:::

In tramvai.json add new `shared` field

```json
{
  "projects": {
    "root-app": {
      "name": "root-app",
      "root": "root-app",
      "type": "application",
      "hotRefresh": {
        "enabled": true
      },
      "shared": {
        "deps": [
          "@tramvai/react-query",
          "@tramvai/module-react-query",
          { "name": "@tramvai/state", "singleton": true }
        ]
      }
    },
    "child-app": {
      "name": "child-app",
      "root": "child-app",
      "type": "child-app",
      "shared": {
        "deps": [
          "@tramvai/react-query",
          "@tramvai/module-react-query",
          { "name": "@tramvai/state", "singleton": true },
        ]
      }
    }
  }
}
```

In order to choose what dependencies should be shared:
- use `tramvai analyze` command to explore the output bundle and how different options affects it
- try different dependencies and see what is loading on the page when child-app is used
- validate how adding shared dependency affects root-app bundle size through `trmavai analyze`
