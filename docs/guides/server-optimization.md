---
id: server-optimization
title: Server optimization
---

## Introduction

In most server applications there is a set of resources that can be optimized:
- CPU
- Memory
- Network

And there are a common set of metrics that can be used to measure application performance:
- Latency
- Throughput

Node.js with Server-Side Rendering have some specifics:
- Node.js is single-threaded and doesn't like long blocking tasks
- SSR unfortunately is long blocking task

SSR especially suffer for CPU limits in Kubernetes clusters - https://medium.com/pipedrive-engineering/how-we-choked-our-kubernetes-nodejs-services-932acc8cc2be

This guide will contain a set of recommended optimizations to make your application faster and more reliable in all self-hosted environments:
- [K8s limits](#k8s-limits)
- [Request Limiter](#request-limiter)
- [Semi space size](#semi-space-size)
- [Agent keepAlive](#agent-keepalive)
- [`libuv` threads](#libuv-threads)
- [DNS resolve cache](#dns-resolve-cache)

## Optimizations

### K8s limits

**TL;DR**: provide **1000m - 1150m** CPU limit/request

Low CPU limits can significantly slow down your application response time because of CPU throttling. More information why:
- https://medium.com/pipedrive-engineering/how-we-choked-our-kubernetes-nodejs-services-932acc8cc2be
- https://web.archive.org/web/20220317223152/https://amixr.io/blog/what-wed-do-to-save-from-the-well-known-k8s-incident/

Node.js is single-threaded, but can use multiple threads for Garbage Collector or DNS resolve. Because of that, optimal configuration is **1150m** CPU limit/request. Minimal recommended configuration is **1000m** CPU limit/request.

There is a one disadvantage - with this CPU limits, if you maintain a sufficient number of instances with good latency and throughput, you may experience poor CPU utilization. Nevertheless, this represents a trade-off between effective CPU usage and low latency.

### Request Limiter

**TL;DR**: connect `@tramvai/module-request-limiter` to your application

Unexpected traffic spikes can make your application unresponsive. A blocked event loop will prevent your application from processing new and current requests, while memory usage may increase and lead to Out-of-Memory (OOM) errors.

`@tramvai/module-request-limiter` module can monitor your application's health and dynamically limit the number of requests handled concurrently by the application. It will automatically start working once connected to the application.

When the application is overloaded, the module will return a **429** error to the client. You can handle this error at the load balancer level and return [Client-Side Rendering fallback](03-features/010-rendering/05-csr.md#csr-fallback) or some page fallback cache.

More information:
- [`@tramvai/module-request-limiter` documentation](references/modules/request-limiter.md)
- [Article "How to scale SSR applications"](https://medium.com/its-tinkoff/ssr-applications-at-scale-d57892719024)

### Semi space size :rocket:

**TL;DR**: set Node.js `--max_semi_space_size` parameter to **64mb**

During application performance profiling, you may observe that your code spends a significant amount of time on Garbage Collector (GC) work. By default, GC work too frequently, and we can reduce the number of GC runs by increasing the size of the semi space. This optimization will reduce the CPU workload and make your event loop less busy, resulting in faster response times, especially in the 95th and 99th percentiles.

One small disadvantage of this optimization is that it slightly increases the memory usage of your application.

A good balance between performance and memory usage is achieved with a semi space size of **64mb**. Another possible value for this parameter is **128mb**, but it may not provide a significant improvement in performance and will increase the memory usage of your application. It is recommended to test this parameter in your specific application.

For setting this parameter you need to run `server.js` using the `node` command with the `--max_semi_space_size` parameter. This command is typically located in the `Dockerfile`:

```Dockerfile title="Dockerfile"
FROM node:18-buster-slim
WORKDIR /app
COPY dist/server /app/
COPY package.json /app/
ENV NODE_ENV='production'

EXPOSE 3000
// highlight-next-line
CMD [ "node", "--max_semi_space_size=64", "/app/server.js" ]
```

More information:
- https://www.alibabacloud.com/blog/better-node-application-performance-through-gc-optimization_595119
- https://github.com/nodejs/node/issues/42511

### Agent keepAlive :rocket:

**TL;DR**: use `@tramvai/module-http-client` module

One of the best network optimizations is to use `keepAlive` connections. This will reduce the number of DNS resolves and TCP connections and reduce the time to establish a connection.

`@tramvai/module-http-client` module automatically create `http` and `https` agents with `keepAlive: true` parameter.

If you don't use this module, you can create your own agents with `keepAlive: true` parameter:

```ts
import http from 'http';
import https from 'https';

const options = {
  keepAlive: true,
  scheduling: 'lifo',
};

const httpAgent = new http.Agent(options);
const httpsAgent = new https.Agent(options);

fetch('http://example.com', { agent: httpAgent });
fetch('https://example.com', { agent: httpsAgent });
```

More information:
- [`@tramvai/module-http-client` documentation](03-features/09-data-fetching/02-http-client.md)
- [keepAlive parameter](https://nodejs.org/api/http.html#new-agentoptions)
- https://community.ops.io/lob_dev/stop-wasting-connections-use-http-keep-alive-1ckg

### `libuv` threads

**TL;DR**: set env variable `UV_THREADPOOL_SIZE` to **8**

One of possible Node.js bottlenecks is APIs that use `libuv` thread pool, one of them is DNS resolve. By default, `libuv` thread pool size is **4**, and it can be not enough for heavy loaded application - requests from application will be queued, incoming requests also will be queued, memory usage will be increased, and at result response time will be increased or application can run out of memory.

From our experience, optimal `libuv` thread pool size is **8**, but it can be different for your application.

You can increase `libuv` thread pool size by setting `UV_THREADPOOL_SIZE` env variable:
```
UV_THREADPOOL_SIZE=8
```

More information:
- [about UV_THREADPOOL_SIZE](https://nodejs.org/docs/latest-v18.x/api/cli.html#uv_threadpool_sizesize)
- [about `libuv` thread pool](https://docs.libuv.org/en/latest/threadpool.html)

### DNS resolve cache

**TL;DR**: connect `@tramvai/module-dns-cache` to your application

DNS resolve can block application event loop and require a free threads from `libuv` thread pool, and DNS lookup cache can help solve this problems and speed up your server-side HTTP requests to external API's.

Possible disadvantages of DNS lookup cache - it can lead to lookup errors if DNS record was changed, so long caches TTL is not recommended.

Also, DNS lookup cache optimization effect can be not so significant, if `keepAlive` connections are used, because number of DNS resolves will be reduced.

More information:
- [`@tramvai/module-dns-cache` documentation](references/modules/dns-cache.md)
- [`cacheable-lookup` documentation](https://github.com/szmarczak/cacheable-lookup)
- [about DNS resolving](https://httptoolkit.com/blog/configuring-nodejs-dns/)

## Metrics

One of the important metrics to show how your Node.js application is busy is [Event Loop Lag](https://davidhettler.net/blog/event-loop-lag/). Tramvai measure event loop lag by [prom-client](https://github.com/siimon/prom-client), and make an additional measurement with `setTimeout`.

[Full metrics list available in Metrics module documentation](references/modules/metrics.md#metrics-list)

## Profiling

Best way to optimize application CPU or memory usage is to profile it with Chrome Devtools or [Clinic.js](https://clinicjs.org/)

### CPU profiling

[Complete guide to tramvai apps CPU profiling](guides/cpu-profiling.md)

### Memory profiling

[Complete guide to tramvai apps memory leak debugging](mistakes/memory-leak.md)
