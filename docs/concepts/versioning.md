# Versioning

Most of the libraries in the `tramvai` repository are bundled into a unified versioning.

All current versions of libraries are stored in release tags, in `package.json` versions are used - stubs `0.0.0-stub`.

The versioning of `tramvai` libraries follows [semver](https://semver.org/lang/ru/). For versions that start with zero (`0.x.x`), the major (` major`) is the second digit in the version, and the minor (`minor`) is the third digit - `0.major.minor`. Thus, on a `BREAKING CHANGE` commit, package version `1.0.0` will go up to `2.0.0`, and package version `0.1.0` will go up to `0.2.0`.

Library versions are updated according to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Unified versioning

Most of the libraries in the `tramvai` repository are combined into end-to-end versioning - these are `core` packages, tram modules and tokens, everything that is included in the `@tramvai` and `@tramvai-tinkoff` scopes. The release and publication of these libraries occurs at the same time, even if the changes affect only one package from the list.
You can see this approach in [Angular](https://angular.io/guide/releases), and with some restrictions, in monorepositories using [Lerna](https://github.com/lerna/lerna#fixedlocked-mode-default)

The main advantage of unified versioning is that compatibility between packages of the same version is guaranteed.

Previously, the user had only one way to raise the framework version without losing compatibility between packages - to install all packages to their latest version.
Now, you can specify a common target version for each `tramvai` library, or use the [tramvai update](how-to/tramvai-update.md) command.

One of the drawbacks of this approach is that any update of a package from the unified list requires raising versions and publishing all these packages from the list, which significantly slows down CI.

## Storing versions in release tags

One of the reasons for storing a version in release tags is the protected `master` branch, which we cannot automatically make changes to after the release and update of package versions.

Storing versions in release tags does not in itself provide any advantage, and we use it together with stub versions of packages in the source `package.json` files.
 
Let's say we had a package with dependencies:

```json
{ 
  "name": "@tramvai/foo", 
  "version": "0.1.0", 
  "dependencies": { 
    "@tramvai/bar": "^1.1.0", 
    "@tramvai/baz": "^2.0.0" 
  } 
}
```

Previously, every big Merge Request was accompanied by conflicts if package versions were updated in the master branch, and the affected libraries in MR contained changes in dependencies.

Now, our package looks like this:

```json
{ 
  "name": "@tramvai/foo", 
  "version": "0.0.0-stub", 
  "dependencies": { 
    "@tramvai/bar": "0.0.0-stub", 
    "@tramvai/baz": "0.0.0-stub" 
  } 
}
```

The version `0.0.0-stub` will never cause merge conflicts, and the calculation of real versions occurs only in CI - when creating a new release tag and publishing, inside the `pvm` library.
