import { useUrl } from '@tramvai/module-router';

export const ErrorCmp = () => {
  const { query } = useUrl();

  const env = typeof window === 'undefined' ? 'server' : 'client';

  if (query.renderError === env || query.renderError === 'all') {
    throw new Error(`error during render on ${env}`);
  }

  return (
    <>
      <div id="error">Child App</div>
    </>
  );
};
