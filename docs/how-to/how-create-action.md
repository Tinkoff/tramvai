---
id: how-create-action
title: Как создать экшен?
---

Рассмотрим на основе кейса: у нас на странице нужно выводить информацию о процентах по депозитам. При этом:

- эти числа часто меняются и для клиента сделали метод в API, в который мы должны ходить за данными.
- у нас есть SEO и нам нужно отдавать эти данные в HTML странице

Мы рассмотрим следующие этапы:

1. Создание экшена
2. Подключение в приложении

## Создание экшена

Подключаем `createAction` и добавляем функцию по загрузки данных из api и отправки данных в store.

```tsx
import { createAction } from '@tramvai/core';
import { loadDepositConfig } from './deposit/reducer';

export const loadDepositAction = createAction({
  name: 'load-deposit-config',
  fn: async (context, payload, deps) => {
    const data = await deps.apiClient.request({ method: 'deposit_config ' });
    return context.dispatch(loadDepositConfig(data));
  },
  deps: {
    apiClient: 'tinkoffApiClient',
  },
});
```

Мы создали экшен, которому требуется для работы провайдер `tinkoffApiClient`, этот экшен делает запрос за данными и сохраняет полученные данные в стор.

## Выполнение для конкретной страницы

Мы создали экшен и хотим подключить его в приложение. Нам важно, что бы экшен выполнялся на сервере, и сервер дожидался выполнения. При этом данные нужны только на конкретной странице, поэтому мы добавляем его в статическое поле `actions` нужной страницы.

```javascript
import react, { Component } from 'react';
import { loadDepositAction } from './loadDepositAction';
import { DepositInfo } from './DepositInfo';

class DepositPage extends Component {
  static actions = [loadDepositAction];
  render() {
    return (
      <div>
        <DepositInfo />
      </div>
    );
  }
}
```

После этого, при открытии роута пользователем, сервер автоматически запустит экшен привязанный к DepositPage и загрузится данные

## Что еще стоит прочитать

- [О createAction](references/tramvai/create-action.md)
- [Как работают экшены](concepts/action.md)
