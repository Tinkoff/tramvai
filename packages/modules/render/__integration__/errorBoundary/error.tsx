import React from 'react';
import type { ErrorBoundaryComponent } from '@tramvai/react';

import styles from './error.module.css';

export const Error: ErrorBoundaryComponent = ({ error, url }) => {
  const message = `Error ${error.message} at ${url.path}`;

  return (
    <html lang="ru">
      <head>
        <title>{message}</title>
      </head>
      <body>
        <h1 className={styles.title}>Root Error Boundary</h1>
      </body>
    </html>
  );
};

export default Error;
