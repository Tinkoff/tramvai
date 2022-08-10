---
id: how-create-action
title: How to create an action?
---

Let's consider next case: on our page we need to display information about interest on deposits. Wherein:

- these numbers change often and for the client we made a method in the API, into which we have to go for data.
- we have SEO and we need to give this data in the HTML page

We'll cover the following steps:

1. Creating an action
2. Connection in the application

## Create an action

Import `declareAction` and write a function to load data from api and send data to store.

```tsx
import { declareAction } from '@tramvai/core';
import { loadDepositConfig } from './deposit/reducer';

export const loadDepositAction = declareAction({
  name: 'load-deposit-config',
  async fn() {
    const data = await this.deps.apiClient.request({ method: 'deposit_config ' });
    return this.dispatch(loadDepositConfig(data));
  },
  deps: {
    apiClient: 'tinkoffApiClient',
  },
});
```

We have created an action that requires the `tinkoffApiClient` provider to work, this action makes a request for the data and saves the received data to the side.

## Run action for a specific page

We have created an action and want to connect it to the application. It is important for us that the action is executed on the server, and the server is waiting for execution. In this case, the data is needed only on a specific page, so we add it to the static `actions` field of the desired page.

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

After that, when the user opens the route, the server will automatically launch the action linked to DepositPage and the data will be loaded

## What else is worth reading

- [About declareAction](references/tramvai/core.md#declareAction)
- [How do actions work](concepts/action.md)
