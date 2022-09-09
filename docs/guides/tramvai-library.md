---
id: tramvai-library
title: Creating a tramvai library
---

Adding a new library or module to the `tramvai` repository is detailed in the [Contribute section](contribute/contribute.md)

This guide contains a set of tips for developing individual `tramvai` packages in application repositories,
also, many teams maintain separate monoreps with common packages for a number of applications, divided into different repositories.

### Prerequisites

Let's consider all important cases using the example of creating a new `tramvai` module.
Let's say the module will provide a new HTTP client to work with the Github `API`.

### Package name

It is highly discouraged to use the `@tramvai` and `@tramvai-tinkoff` scopes outside the `tramvai` repository.
If our application is called `tincoin`, you can, for example, select one of these scopes:

- `@tincoin`
- `@tramvai-tincoin`
- `@tincoin-core`

For modules, the prefix is ​​usually `module-`, for example: `@tramvai-tincoin/module-github-api-client`

### Versioning

The choice of a versioning strategy is entirely yours.
We definitely recommend following `semver`, and we can recommend using [unified versioning](concepts/versioning.md) if:

- you support monorep with core libraries
- these libraries can be linked
- and these packages are used in applications all together (or most of them)

### Dependencies

Dealing with library dependencies is not an easy task, and there is no ideal solution, but there are a number of tips to make it easier to manage dependencies.
The best place to start is by dividing dependencies into different types:

#### Framework

Examples of such dependencies are `react` and `react-dom`, `@tramvai/*` and `@tramvai-tinkoff/*`.
If we write `babel` or `eslint` plugin, it can be `@babel/core` and `eslint`.

Typically, an end user, such as a `tramvai` application, is required to install a dependency framework,
without them it simply won't work.

Therefore, our library should set them to `peerDependencies`, with the most free versions, for example, if the package is tied to the basic functionality of `tramvai`, and uses React hooks:

```json
{
  "peerDependencies": {
    "@tramvai/core": "*",
    "react": ">=16.8",
    "react-dom": ">=16.8"
  }
}
```

#### Singleton

A number of dependencies must be strictly one in the application.
Any duplicates are a minus. increase the weight of the application bundle, but libraries such as `react` or `@tinkoff/logger` require a single copy in our application.

For them, the rule applies as with the framework, you need to install them in `peerDependencies`, with the most free versions:

```json
{
  "peerDependencies": {
    "@tinkoff/logger": "*"
  }
}
```

#### Popular

Many packages are popular enough that chances are they are already being used in the final application.
An example of such dependencies is - `date-fns`, `lru-cache`, `@tinkoff/dippy`

For them, the rule applies as with the framework, you need to install them in `peerDependencies`, with the most free versions:

```json
{
  "peerDependencies": {
    "@tinkoff/dippy": "*",
    "date-fns": ">=2",
    "lru-cache": "*"
  }
}
```

#### Specific

Let's say our new tramvai module delivers unique functionality to the application that requires a third-party library (or even another package in your monorepo)

If we are developing a service to work with the Github API, it might be the `@octokit/rest` package.

In this case, you need to put the library in `dependencies`, and you can leave the standard range using `^`:

```json
{
  "dependencies": {
    "@octokit/rest": "^18.0.0"
  }
}
```

#### Development

A dependency may be involved in building your package - for example, `rollup` or `@tramvai/build`.
The dependency is required to run library tests.
The dependency contains the taipings required for the build.

In all these cases, even if either is already in `peerDependencies`, it is worth adding a more specific version to `devDependencies`, for example:

```json
{
  "devDependencies": {
    "@tramvai/build": "^2.5.0",
    "@types/react": "^17.0.0",
    "react": "^17.0.0"
  }
}
```

#### Exclusion

Of course, there are exceptional cases.

For example, tramvai provides many test utilities where all the main `@tramvai` dependencies were in `peerDependencies`.
As soon as these utilities began to be used not in repositories with applications, but in monoreps with core packages, the problem of missing dependencies appeared, and we moved almost everything from `peerDependencies` to `dependencies`

Proceed according to the situation and always think about the usability of your product :)

### Build

It is assumed that the final assembly of packages in the context of the application will be done by `@tramvai/cli`.
Therefore, to publish packages written in `TypeScript`, it suffices to use` tsc`, and publish many compiled `.js` and` .d.ts` files.

But building packages into bundles before publishing, for example via `rollup` or` @tramvai/build`, gives a number of possibilities:

- preliminary tree-shaking will cut off all unnecessary, this will have a positive effect on the assembly of the application
- you can make several bundles for different environments, in CJS or ES modules formats
- you can make a separate bundle for the browser build, separate for the server one - top for libraries with SSR support

Detailed documentation on using `@tramvai/build` is available in [documentation](references/tools/build.md)

#### Tree-shaking

Some of useful articles about tree-shaking:
- [Webpack guide](https://webpack.js.org/guides/tree-shaking/)
- ["How To Make Tree Shakeable Libraries" article](https://blog.theodo.com/2021/04/library-tree-shaking/)

Summarizing all the optimizations needed to create tree-shakable libraries:

- Prevent `TypeScript` **decorators** usage

  Explanation: `Terser` can't remove unused exports in transpiled code with decorators, both `Babel` or `tsc` add utility functions, potentially with side-effects for `Terser`

- Prevent **static properties** usage for `React` functional components

  Explanation: `Terser` can't remove unused components in transpiled code when more than one static properties are used

- Use **ES modules** for server and browser build, **CJS** only for backward compatibility

- Split the library logic into **small modules**

- **Preserve file structure** of this modules during the bundling

  Explanation: `Webpack` can remove unused code from modules graph, and we don't have to worry about removing this code with `Terser`

- Add `"sideEffects": false` field to `package.json` (or specify an array of files that cannot be cut - `"sideEffects": ["some-global.css"]`)

- Always **test tree-shaking** of your packages on the default webpack production build, add the magic comment `/* @__PURE__ */` if necessary

  Explanation: `/* @__PURE__ */` helps `Terser` to understand that the called function has no side effects

#### Modern ES code

Reference articles:
- ["Serve modern code to modern browsers"](https://web.dev/codelab-serve-modern-code/)
- ["Bringing Modern JavaScript to Libraries"](https://dev.to/garylchew/bringing-modern-javascript-to-libraries-432c)

Transpiling the source code into **ES2019** for the browser build will help deliver significantly less code to the client.
For backward compatibility with older browsers, you need to transpile `node_modules` with modern code via `Babel`, when building your application to production.
`@tramvai/cli` will do this transpilation automatically for `tramvai` applications.

#### @tramvai/build

The `@tramvai/build` tool out of the box gives you some of this optimizations:

- **CJS** and **ES modules** builds
- **Modern JS code**
- **File structure preservation**
- Support for separate **browser build**

So, this tool is recommended by `tramvai` team for building any packages used by any SSR applications.

[Get started with @tramvai/build](https://tramvai.dev/docs/references/tools/build/#get-started)
