import React, { useState } from 'react';
import type { ErrorBoundaryComponent } from '@tramvai/react';

import styles from './error.module.css';

const RootErrorBoundary: ErrorBoundaryComponent = ({ error, url }) => {
  const [counter, setCounter] = useState(0);
  const message = `Error ${error.message} at ${url.path}`;

  return (
    <html lang="ru">
      <head>
        <title>{message}</title>
      </head>

      <body>
        <div id="page" className={styles.container}>
          Test Internal Server Error
        </div>

        <p>{counter}</p>

        <button type="button" onClick={() => setCounter((state) => state + 1)}>
          Test
        </button>
      </body>
    </html>
  );
};

// eslint-disable-next-line import/no-default-export
export default RootErrorBoundary;
