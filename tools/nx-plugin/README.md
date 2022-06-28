# tools-nx-build

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build tools-nx-build` to build the library.

## API

### Generate project.json

Run command `nx g @tramvai/nx-plugin:project` to generate `project.json` to every publishable package in workspace

### Build package

- Run command `nx run <package_name>:build-publish` to build specific package
- Run command `nx run-many --target=build-publish --all` to build all packages in workspace
