import React from 'react';

export const RootErrorBoundary = ({ error, url }) => {
  return (
    <html lang="ru">
      <head>
        <title>
          Error {error.message} at {url.path}
        </title>
      </head>
      <body>
        <h1>Root Error Boundary</h1>
      </body>
    </html>
  );
};
