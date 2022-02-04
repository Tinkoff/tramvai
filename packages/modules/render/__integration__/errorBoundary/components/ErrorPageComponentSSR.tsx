import React from 'react';

export const ErrorPageComponentSSR = () => {
  throw new Error('Error Page Component SSR');
  return (
    <main>
      <h1>Error Page Component</h1>
    </main>
  );
};
