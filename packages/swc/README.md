# Swc integration

This package contains of next things:

- swc packages that is used by @tramvai/cli
- tramvai specific swc plugins

## Installation

```sh
npx tramvai add --dev @tramvai/swc-integration
```

## API

There is no public API for use in this package. It is used internally in @tramvai/cli.

## Explanation

This package exists only as a helper package to developers who want to test swc as a replacement of babel. By default, tramvai comes without it as swc integration requires a lot of code that is still experimental and is not required by most apps, but with this package you can easily add support for swc.

The main advantage of using swc over babel as a transpiler is speed - swc is much faster than babel for transpilation that implies faster builds and rebuilds in development and production modes.

## How to

### Enable swc support in @tramvai/cli

Refer to docs of [`@tramvai/cli`](references/cli/experiments.md#transpilation)

## Development

[Swc doc](https://swc.rs/docs/plugin/ecmascript/getting-started)

1. Install [Rust](https://www.rust-lang.org/tools/install)
2. Run command `rustup target add wasm32-wasi` to install required toolchain to build wasm targets.
3. Install clippy as additional tool for code check - `rustup component add clippy`

### Build

- To build in dev mode i.e. for testing locally run `cargo build-wasi`
- To build in prod mode i.e. for publish run `cargo build-wasi --release`

### Testing

- To run all tests for all plugins run `cargo test` from the swc folder
- To run tests for single plugin either run `cargo test` from plugin directory or run `cargo test <plugin_name>`

### Formatting

1. Add `rustfmt` - `rustup component add rustfmt`
2. Run formatter - `cargo fmt`

### VS code

1. Install [rust-analyzer extension](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
2. To make the extension work do either of two:
   - Open `packages/swc` directory as a separate project in Vs Code
   - Add to **workspace** VsCode settings `"rust-analyzer.linkedProjects": ["Cargo.toml"]` - the value should be an relative path to the `Cargo.toml` file inside swc dir.
3. It is desirable to set clippy as a checker for rust code. To do so set `clippy` to setting `rust-analyzer.checkOnSave.command`

### Contributing

1. Make changes to the source code
2. Make sure the tests are passing with `cargo test`
3. Commit a release version of swc plugins, you can do it either:
   - by building it locally with command `cargo build-wasi --release`. But this requires specific os and rust versions, and therefore should be done inside docker container, using image `rust:1.65.0`
   - pushing your code changes and creating merge request. Merge request will fail because it'll detect changes in built files but it'll provide these built files through gitlab artifacts for job `swc-integration build check`. You can download this artifact and commit files from it to your branch.
