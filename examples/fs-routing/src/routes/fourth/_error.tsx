import type { ErrorBoundaryComponent } from '@tramvai/react';

export const ErrorBoundary: ErrorBoundaryComponent = ({ error, url }) => {
  return (
    <>
      <h3>An error occurred during render route {url.pathname}!</h3>
      <p>Current url: {url.path}</p>
      <p>Error: {error.message}</p>
    </>
  );
};

export default ErrorBoundary;
