# Tramvai test React

Библиотека хелперов для тестирования React-компонентов

Тестирование компонентов реализовано с помощью библиотек [@testing-library/react](https://github.com/testing-library/react-testing-library) [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)

Если у вас используется jest для тестирования, то рассмотрите опцию добавить библиотеку [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)

> Для работы должен быть установлен отдельно `react`

## Подключение

```bash
npm i --save-dev @tramvai/test-react
```

## How to

### Тестирование компонентов

Для тестирования компонентов под капотом используется библиотека [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro)

```ts
/**
 * @jest-environment jsdom
 */
import { testComponent } from '@tramvai/test-react';

describe('test', () => {
  it('render', async () => {
    const { render, rerender, context, act, fireEvent, Wrapper } = testComponent(<Cmp id={1} />);

    // проверить рендер компонента
    expect(render.getByTestId('test').textContent).toBe('Content 1');

    // проверить рендер после обновления данных в сторе
    act(() => {
      context.dispatch(event('data'));
    });

    // взаимодействовать с компонентом
    fireEvent.click(render.getByText('Button'));

    // повторный рендеринг компонента
    rerender(<Cmp id={2} />)

    expect(render.getByTestId('test').textContent).toBe('Content 2');
  });
});
```

<p>
<details>
<summary>Больше примеров</summary>

@inline src/testComponent.spec.tsx

</details>
</p>

### Тестирование React-хуков

Для тестирования компонентов под капотом используется библиотека [@testing-library/react-hooks](https://github.com/testing-library/react-hooks-testing-library)

```ts
/**
 * @jest-environment jsdom
 */
import { testHooks } from '@tramvai/test-react';

describe('test', () => {
  it('hook', async () => {
    const { result, context, act } = testHook(() => useHook());

    // проверить результат вызова хука
    expect(result.current).toBe('result');

    // проверить результат после обновления данных в сторе
    act(() => {
      context.dispatch(event('data'));
    });
  });
});
```

<p>
<details>
<summary>Больше примеров</summary>

@inline src/testHook.spec.tsx

</details>
</p>
