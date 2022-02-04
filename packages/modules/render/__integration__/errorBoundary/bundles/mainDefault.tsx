import React from 'react';
import { createAction, createBundle } from '@tramvai/core';
import { HttpError } from '@tinkoff/errors';
import { setPageErrorEvent } from '@tramvai/module-render';
import { ErrorPageComponentSSR } from '../components/ErrorPageComponentSSR';

const PageComponent = () => {
  return (
    <main>
      <h1>Page Component</h1>
    </main>
  );
};

const DefaultErrorBoundary = () => {
  return (
    <main>
      <h1>Default Error Boundary</h1>
    </main>
  );
};

const PageErrorBoundary = () => {
  return (
    <main>
      <h1>Page Error Boundary</h1>
    </main>
  );
};

const PageActionErrorComponent = () => {
  return (
    <main>
      <h1>Page Action Error Component</h1>
    </main>
  );
};

const errorAction = createAction({
  name: 'errorAction',
  fn: (context) => {
    const error = new HttpError({
      httpStatus: 410,
    });
    context.dispatch(setPageErrorEvent(error));
  },
});

PageActionErrorComponent.actions = [errorAction];

const PageGuardErrorComponent = () => {
  return (
    <main>
      <h1>Page Guard Error Component</h1>
    </main>
  );
};

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: PageComponent,
    errorPageComponent: ErrorPageComponentSSR,
    errorBoundaryDefault: DefaultErrorBoundary,
    pageErrorBoundaryComponent: PageErrorBoundary,
    pageActionErrorComponent: PageActionErrorComponent,
    pageGuardErrorComponent: PageGuardErrorComponent,
  },
});
