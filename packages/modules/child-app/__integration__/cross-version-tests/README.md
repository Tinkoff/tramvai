# Child app cross version testing

Cross version testing is used to catch compatibility issues between different versions of tramvai modules when building an app that uses child apps (tramvai specific microfrontends).

## Explanation

### How does it work?

For every specific version separate directory is created that will contain specific version of tramvai dependencies. Thanks to tramvai cli options `resolveSymlinks=false` any symlinked files will be resolved, but the dependencies that these files will require will be resolved based to initial directory i.e. cli will load specific versions of tramvai dependencies instead of latest versions resolved from repository itself.

By creating different apps and by specifying proper cli execution we may run different versions of tramvai rootApp and childApps and then test that they are compatible.

## How to

### Add new specific version for testing

1. Create new directory with version specifier in `cross-version-tests`
2. Create new package.json file and add every tramvai dependency that is used in test but with custom version (the dependencies list should match dependencies list in `examples/child-app/package.json`)
3. Install dependencies
4. Create symlinks in new directory that will point to child-app example. Use command `ln -s ../../../../../../examples/child-app/${entry}/ ./${entry}` in new directory for next entries:
   - `child-apps`
   - `mocks`
   - `root-app`
   - `shared`
5. Additionally copy next files to new directory from `examples/child-app`: `tramvai.json`, `env.development.js` with appropriate modifications if required by specific version
6. Copy the file `./latest/cli.ts` to new directory and make modification to it if required by specific versions
7. Add new version to test cases inside `child-app.test.ts`
8. Add installation for new deps in ci

### Execute cross version tests locally

By default only repository versions of apps is checked when running integration tests.

To run cross version tests:

- install dependencies in every dir inside `cross-version-tests` expect for `latest` dir
- run integrations tests with env `CHILD_APP_TEST_CROSS_VERSION`

### Run different versions locally

- to run app that uses latest repository versions of deps:
  - go to `examples/child-app`
  - `yarn start:root` to run root-app
  - `yarn start:children` to run child apps
- to run specific version of deps:
  - go to `./cross-versions-tests/${version}`
  - `yarn start:root` to run root-app
  - `yarn start:children` to run child apps

By combining different directories from which commands is executed you can check how work different versions of root-app and child-apps
