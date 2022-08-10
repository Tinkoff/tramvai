# Sentry

Integration with [Sentry](https://docs.sentry.io/). Uses `Sentry SDK` for sending error reports from client and server.

## Installation

You need to install `@tramvai/module-sentry`:

```bash
yarn add @tramvai/module-sentry
```

And connect to the project: `SentryModule`:

:::warning

Put `SentryModule` as one of the first modules in the list.

:::

```tsx
import { SentryModule } from '@tramvai/module-sentry';

createApp({
  modules: [SentryModule],
});
```

And make sure to add `SENTRY_DSN` environment on deployed stands. Otherwise module will not work.

## Explanation

### Environment variables

Required:

- `SENTRY_DSN` - [DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) of the app

Optional:

- `SENTRY_RELEASE` - information about current [app release](https://docs.sentry.io/workflow/releases/)
- `SENTRY_ENVIRONMENT` - information about [environment](https://docs.sentry.io/product/sentry-basics/environments/)
- `SENTRY_SDK_URL` - URL for downloading Sentry SDK in browser
- `SENTRY_DSN_CLIENT` - [DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) of the app for use in browser

### Sensitive Data

Before start to use the module take a closer look to the [sentry documentation](https://docs.sentry.io/platforms/javascript/data-management/sensitive-data/).

Sentry tries to [enrich error context as much as possible](https://docs.sentry.io/platforms/javascript/enriching-events/) by using [breadcrumbs](https://docs.sentry.io/platforms/javascript/enriching-events/breadcrumbs/), getting information from [additional integrations](https://docs.sentry.io/platforms/javascript/configuration/integrations/). It is all configurable but it still should be carefully monitored what data is saved in Sentry storage.

### Behaviour

Module uses _universal_ approach that let use error logging on the client and server. Integration with Sentry SDK happens on `commandLineListTokens.init`.

By default Sentry is enabled only on production and if `DSN` was provided.

#### Browser

Module uses [lazy loaded approach](https://docs.sentry.io/platforms/javascript/install/lazy-load-sentry/). This way Sentry SDK is added dynamically and only if needed, e.g. `@sentry/browser` is not bundled to the app and it is loaded lazily when requested by the app.

#### Node

:::warning

By default, sentry handlers for the express app is disabled, to enable it see [SENTRY_SERVER_ENABLE_DEFAULT_HANDLERS](#sentry_server_enable_default_handlers)

:::

Uses `@sentry/node` and [Sentry express middleware](https://docs.sentry.io/platforms/node/express/)

## How to

### Send custom error

```tsx
import { declareAction } from '@tramvai/core';
import { SENTRY_TOKEN } from '@tramvai/module-sentry';
import { loadUsers } from './users';

export default declareAction({
  name: 'loadUsers',
  async fn() {
    try {
      await loadUsers();
    } catch (e) {
      this.deps.sentry.captureException(e);
      throw e;
    }
  },
  deps: {
    sentry: SENTRY_TOKEN,
  },
});
```

### Debug locally

Sentry is disabled on local run and if you want to debug it you have to enable Sentry explicitly.

```tsx
SentryModule.forRoot({ enabled: true, debug: true });
```

Add parameter `SENTRY_DSN` to `env.development.js`.

After steps below Sentry will be enabled while local development.

### Get DSN

1. Go to the Sentry UI
2. Click on tab `Settings`
3. In the tab `Projects` pick up your project выберите свой проект
4. Choose `Client Keys (DSN)`
5. From `DSN` field copy text with `Default` .

### Upload sourcemaps

To upload sourcemaps to Sentry storage you can use [@sentry/cli](https://github.com/getsentry/sentry-cli).

:::warning

It is important to specify `--url-prefix` [in right way](https://docs.sentry.io/platforms/javascript/config/sourcemaps/#using-sentry-cli).

:::

Flag [`--rewrite`](https://docs.sentry.io/cli/releases/#sentry-cli-sourcemaps) is used to reduce size of the files to upload and perform checks for the sourcemaps correctness.

Example script:

```sh
set -eu -o pipefail -x

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
VERSION=${SENTRY_RELEASE:-"${PACKAGE_VERSION}-${CI_COMMIT_SHA}"}
export SENTRY_PROJECT="${APP}"
export SENTRY_URL="${SENTRY_URL_TEST}"
export SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN_TEST}"
sentry-cli releases files $VERSION upload-sourcemaps --rewrite --url-prefix "~/" ./server/ & \
sentry-cli releases files $VERSION upload-sourcemaps --rewrite --url-prefix "~/platform/" ./assets/
```

In order to generate sourcemaps for server specify `"sourceMapServer": true` to `configurations` to app's `tramvai.json`.

## Exported tokens

#### `SENTRY_TOKEN`

Ready to use instance of Sentry that was created with Node SDK or Browser SDK

### `SENTRY_OPTIONS_TOKEN`

Configuration options for Sentry either for [Node](https://docs.sentry.io/platforms/node/configuration/) or for [Browser](https://docs.sentry.io/platforms/javascript/configuration/) environment

### `SENTRY_REQUEST_OPTIONS_TOKEN`

Configuration options for the [request data parser](https://docs.sentry.io/platforms/node/express/) for the express middleware

### `SENTRY_FILTER_ERRORS`

Can be used to pass function to perform filtering on error objects before sending it to Sentry. Process is described in [Sentry docs](https://docs.sentry.io/platforms/javascript/configuration/filtering/). Function accepts arguments `event` and `hint` for method `beforeSend`.

### `SENTRY_SERVER_ENABLE_DEFAULT_HANDLERS`

Enables sentry default handlers for the express app.

### `SENTRY_LAZY_LOADING`

Enables lazy loading for the sentry bundle in browser.
