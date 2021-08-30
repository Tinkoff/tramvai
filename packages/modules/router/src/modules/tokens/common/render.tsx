import React from 'react';
import { Provider } from '@tinkoff/router';

export const provideRouter = ({ router }) => (render) => {
  return <Provider router={router}>{render}</Provider>;
};
