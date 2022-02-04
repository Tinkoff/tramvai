import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ErrorBoundary } from './component';

/**
 * @deprecated Use UniversalErrorBoundary component
 */
export const withError = ({
  fallbackComponent,
}: { fallbackComponent?: React.ReactElement } = {}) => <T extends React.ComponentType<any>>(
  WrappedComponent: T
) => {
  function WrapperWithError(props: any) {
    return (
      <ErrorBoundary fallbackComponent={fallbackComponent}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  return hoistStatics(WrapperWithError, WrappedComponent) as T;
};
