---
id: how-enable-modern
title: How to enable modern mode for an application?
---

:::note

The feature now is enabled by default.

:::

Instructions on how to enable `modern' code assembly in the application. This is to ensure that new browsers get the code without the various transformations that are needed for legacy browsers. This way we reduce the amount of code and improve the performance of the application.

[Read more about the modern bundle from smashingmagazine](https://www.smashingmagazine.com/2018/10/smart-bundling-legacy-code-browsers/)

## Configuring tramvai.json

We need to enable building code for modern versions of browsers. To do this, add the `modern: true` parameter to tramvai.json:

```json
{
  "projects": {
    "tincoin": {
      "name": "tincoin",
      "root": "src",
      "type": "application",
      "modern": true
    }
  }
}
```

After that, `@tramvai/cli` will build two versions of each js file: ES5 and ES2017

After these steps, we will build statics for 2 packs of browsers and `RenderModule` will give the ES2017-compatible code for modern browsers.
