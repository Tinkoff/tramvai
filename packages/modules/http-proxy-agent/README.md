# HttpProxyAgent

Enable support for http_proxy, https_proxy and no_proxy env variables

## Installation

You need to install `@tramvai/module-http-proxy-agent`

```bash
yarn add @tramvai/module-http-proxy-agent
```

And connect in the project

```tsx
import { createApp } from '@tramvai/core';
import { HttpProxyAgentModule } from '@tramvai/module-http-proxy-agent';

createApp({
  name: 'tincoin',
  modules: [ HttpProxyAgentModule ],
});
```

## Environment variables

- `HTTP_PROXY` - proxy url for HTTP requests
- `http_proxy` - see `HTTP_PROXY`

- `HTTPS_PROXY` - proxy url for HTTPS requests
- `https_proxy` - see `HTTPS_PROXY`

- `NO_PROXY` - list of urls patterns for which proxying is disabled
- `no_proxy` - see `NO_PROXY`

## Explanation

`HttpProxyAgentModule` mokeypatch standard NodeJS [https.Agent](https://nodejs.org/dist/latest-v16.x/docs/api/https.html#class-httpsagent) for supporting connections via forwarding proxy, if some of mentioned above env variables are presented.

Some `NO_PROXY` env specification and examples [available here](https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/#standardizing-no_proxy)

Source code forked from [node-keepalive-proxy-agent](https://github.com/mknj/node-keepalive-proxy-agent)

## Limitations

`HttpProxyAgentModule` [support only HTTPS requests](https://github.com/mknj/node-keepalive-proxy-agent/issues/28)
