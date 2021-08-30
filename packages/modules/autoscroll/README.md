# Autoscroll

Компонент с автопрокруткой к началу страницы или к якорю в URL при SPA-переходах

Поведение такое же как в гайде по [react-router](https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-tops)

## Подключение

Необходимо установить `@tramvai/module-autoscroll`

```bash
yarn add @tramvai/module-autoscroll
```

Подключить в проекте `AutoscrollModule`

```tsx
import { createApp } from '@tramvai/core';
import { AutoscrollModule } from '@tramvai/module-autoscroll';

createApp({
  name: 'tincoin',
  modules: [AutoscrollModule],
});
```

Если нужно отключить подскрол для отдельных страниц - при переходе `navigate` нужно указать `navigateState.disableAutoscroll = true`

```tsx
import { useNavigate } from '@tramvai/module-router';

function Component() {
  const navigateToWithoutScroll = useNavigate({
    url: '/url/',
    navigateState: { disableAutoscroll: true },
  });

  return <Button onClick={navigateToWithoutScroll} />;
}
```

`behavior: smooth` поддерживается не во всех браузерах (например, плавный подскролл не работает в Safari). При необходимости подключите полифил `smoothscroll-polyfill` в свое приложение.
