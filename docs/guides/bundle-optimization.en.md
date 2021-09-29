---
id: bundle-optimization
title: Bundle optimization
---

[@tramvai/cli](references/cli/base.md) use `webpack` for building an application, and configures most of the well-known optimizations for production builds - code minification and obfuscation, CSS and image optimization, code splitting, hashes for efficient static caching - and allows you to customize some optimization stages.

## Code Splitting

Providing the client with the minimum required JavaScript code is one of the most important things in optimizing web applications. Separating entry points when building bundles and dynamically importing modules and using these bans based on routing / custom actions are the main mechanisms for splitting code. When assembling many bundles and dynamic chunks, the problem of code duplication between them arises, which allows you to solve [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)

Tramvai applications have a number of features - a single entry point (`platform.js` at the exit), dynamic import at the level of each [bundle](concepts/bundle.md), a separate assembly of the vendor chunk. For an application that has several tramvai bundles for different pages, each page will load at least the `platform.js` chunk with the common framework and modules code, and the `{bundleName} .js` chunk with the unique code for the page. Duplicates can be in chunks created under tramvai bundles (for example, ui-kit components), and it is desirable to move this code into common chunks.

The CLI offers three strategies for splitting code - one common chunk, many granular shared chunks, and disabling the SplitChunksPlugin.

### Disabling SplitChunksPlugin

For applications that have only one tramvai bundle for all pages, or separate the bundle for the desktop and mobile versions, in most cases, code separation is not required, and it is worth setting the option `"commonChunk": false`:

```json
{
  "projects": {
    "{appName}": {
      "commands": {
        "build": {
          "configurations": {
            "commonChunk": false
          }
        }
      }
    }
  }
}
```

**Why not leave the common chunk if it doesn't interfere?** The problem is in third-party libraries that can use dynamic `import` under the hood, while the application may not use this code, but it may end up in the common chunk, which will be loaded on every page.

Also, if your application is serving multiple pages and separating the code at the page component level via [@tramvai/react lazy](how-to/how-create-async-component.md), it makes sense to consider other strategies, since duplicates will appear in dynamic chunks of pages.

### Common Chunk

The strategy is included in the CLI by default, all common code from bundles and dynamic chunks is moved to common-chunk.js. The `commonChunkSplitNumber` parameter allows you to specify the minimum number of chunks this code should use in order to move it to common.

For applications with a lot of bundles, `common-chunk.js` can include a huge amount of code that is not needed on every single page, and it is worth either increasing the `commonChunkSplitNumber` or using the Granular Chunks strategy. Example configuration to increase the minimum number of chunks using shared code:


```json
{
  "projects": {
    "{appName}": {
      "commands": {
        "build": {
          "configurations": {
            "commonChunkSplitNumber": 5
          }
        }
      }
    }
  }
}
```

**How to choose a suitable number of `commonChunkSplitNumber`?** Alternatively, the number can be calculated using the formulas `commonChunkSplitNumber = bundles / 3` or `commonChunkSplitNumber = bundles / 2`, where bundles is the number of tramvai bundles that are connected to a specific application, but most likely each application will be better viewed separately.

### Granular Chunks

[A detailed description of using the strategy in Next.js and Gatsby.js](https://web.dev/granular-chunking-nextjs/)

The strategy is enabled through the `granularChunks` parameter, allows you to move the common code into many small chunks, for efficient caching of the common code, and loading only the necessary code on each page. The balance is achieved due to the fact that the common code between at least two (default settings) chunks is placed in a separate chunk with a unique name, and there will be such chunks from one for all the others, to one for every two chunks.

Disadvantages of this strategy: significantly more js scripts can be loaded on one page, up to several dozen, which does not significantly affect performance when using HTTP / 2; and less efficient gzip / brotli archiving, which is not so noticeable compared to the reduction in the amount of source code.

The `granularChunksSplitNumber` parameter allows you to override the default number of shared chunks (`2`), if for some reason you need to reduce the number of resulting chunks:

```json
{
  "projects": {
    "{appName}": {
      "commands": {
        "build": {
          "configurations": {
            "granularChunks": true,
            "granularChunksSplitNumber": 3
          }
        }
      }
    }
  }
}
```
