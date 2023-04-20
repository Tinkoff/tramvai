---
id: get-started
title: Get Started
---

## New Child App

`@tramvai/cli` can generate new Child App template from scratch.

:hourglass: Run in your shell:

```sh
npm init @tramvai@latest fancy-child
```

:hourglass: Choose `Microfrontend implemented by tramvai child-app`

:hourglass: Follow next steps of setup based on your needs

After that in directory `fancy-child` will be generated new Child App from template with all necessary setup and installed dependencies.

## Development

Child App development process is connected with Root App development - you need to use Root App for micro frontend preview, because Root App is responsible for loading Child App and provide it with all necessary dependencies.

:hourglass: Run Child App in watch mode:

```
cd fancy-child && npm start
```

:hourglass: [Connect Child App in Root Application](03-features/015-child-app/010-connect.md)

:hourglass: Run Root App in development mode and link it with our running Child App:

```bash
CHILD_APP_DEBUG=fancy-child npx tramvai start root-app
```

:hourglass: Open Root App page with connected Child App, e.g. `http://localhost:3000/fancy-child/`

More detailed examples you can find in [Connect Child App](03-features/015-child-app/010-connect.md#development) page.

## Testing

#### Unit

You may use helper library [@tramvai/test-child-app](references/tramvai/test/child-app.md) that creates mock application in order to test child-app behaviour in the app.

#### Integration Tests

Full testing requires to run standalone app that will reuse your app.

1. Create test app in your repository. Also you may use `@tramvai/test-trandapp` for generating simple app without hassle (not yet available in open-source).
2. Using [@tramvai/test-integration](references/tramvai/test/integration.md) and [@tramvai/test-pw](references/tramvai/test/playwright.md) you may perform any kind of tests including testing in browser.

## Deploy

:::info

Child-app is built ignoring `modern` option in tramvai config. This is because we don't know the actual environment that will load the child-app and this environment may require legacy support

:::

1. Build your child-app with command `tramvai build [name]`
2. Copy generated files from `./dist/child-app` (by default) to the external cdn
3. Provide link to the cdn itself through token `CHILD_APP_RESOLVE_BASE_URL_TOKEN` or env `CHILD_APP_EXTERNAL_URL`

## Debug

If your are facing any problems while developing or using Child App use next instructions first.

1. Check the logs with key `child-app` that may lead to source of problems
2. If there is not enough logs enable all `child-app` logs - [how to display logs](03-features/014-logging.md#display-logs)
