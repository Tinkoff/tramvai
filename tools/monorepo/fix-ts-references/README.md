# @tinkoff-monorepo/fix-ts-references

All of the dependencies for linked packages in monorepo should be specified in `tsconfig.references` file in order to let `tsc` to build packages and their dependencies in the right order within single compilation pass.

## Install

```
yarn add fix-ts-references
```

## Usage

```
npx fix-ts-references --fix
```

Script will do next:

With flag `--fix`:

1. Remove references from references list for package if dependency has been removed from `package.json`
2. Add new references to references list for package if dependency has been added to `package.json`
3. Setting `tsconfig.compilerOptions.rootDir=./src` if it is not set
4. Remove reference from project reference solution if package has been removed from repository
5. Add reference to project reference solution if package has been added to the repository

Without flag `--fix` will just show list of errors
