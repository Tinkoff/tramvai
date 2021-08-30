import { createAction } from '@tramvai/core';
import { set } from '../store';

export const innerAction = createAction({
  name: 'innerAction',
  fn: (context) => {
    console.log('execute innerAction');
    return context.dispatch(set('innerAction'));
  },
  // conditions не задан - экшен будет выполняться по умолчанию:
  // если экшен задан как глобальный (в приложении, бандле или странице),
  // то экшен сначала попытается выполниться на сервере - если успел выполниться, то на клиенте повторно выполняться не будет
  // если же не экшен не успел выполниться в лимит, то он запуститься на клиенте,
  // повторные запуски при переходе на страницу с этим экшеном выполнятся не будут, т.к. последнее успешное выполнение запоминается
  // если же экшен вызывается явно через context то такой экшен будет всегда выполняться (лимит выполнения все равно влияет,
  // и данные не всегда могут быть доступны при ssr, но экшен всегда попытается выполниться)
});

export const innerServerAction = createAction({
  name: 'innerServerAction',
  fn: (context) => {
    console.log('execute innerServerAction');
    return context.dispatch(set('innerServerAction'));
  },
  // этот экшен может быть выполнен только на сервере
  conditions: {
    onlyServer: true,
  },
});

export const innerBrowserAction = createAction({
  name: 'innerBrowserAction',
  fn: (context) => {
    console.log('execute innerBrowserAction');
    return context.dispatch(set('innerBrowserAction'));
  },
  // этот экшен может быть выполнен только на клиенте
  conditions: {
    onlyBrowser: true,
  },
});
