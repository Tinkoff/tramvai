# @tinkoff/package-manager-wrapper

A wrapper for javascript package manager.

## How To

### Get project package manager

```ts
import { resolvePackageManager } from '@tinkoff/package-manager-wrapper';

const packageManager = resolvePackageManager({ rootDir: process.cwd() });

packageManager.install();
```
