# Tramvai test jest

Set of helpers for testing in [jsdom environment](https://github.com/jsdom/jsdom)

## Installation

```bash
npm i --save-dev @tramvai/test-jsdom
```

## Api

### waitRaf

Wait for execution of `requestAnimationFrame` callback

```ts
import { waitRaf } from '@tramvai/test-jsdom';

describe('test', () => {
  it('test', async () => {
    // some code with raf usage

    await waitRaf();
  });
});
```
