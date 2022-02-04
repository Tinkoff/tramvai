import React, { useState, useEffect } from 'react';

export const ErrorPageComponentClient = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(true);
  }, []);

  if (error) {
    throw new Error('Error Page Component Client');
  }

  return (
    <main>
      <h1>Error Page Component Client</h1>
    </main>
  );
};
