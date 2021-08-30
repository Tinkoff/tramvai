# Tramvai test jest

Библиотека хелперов для тестирования в среде [jsdom](https://github.com/jsdom/jsdom)

## Подключение

```bash
npm i --save-dev @tramvai/test-jsdom
```

## Api

### waitRaf

Позволяет подождать выполнения requestAnimationFrame калбеков в тесте

```ts
import { waitRaf } from '@tramvai/test-jsdom';

describe('test', () => {
  it('test', async () => {
    // some code with raf usage

    await waitRaf();
  });
});
```
