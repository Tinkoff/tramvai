import type React from 'react';
import { createToken } from '@tinkoff/dippy';
import type { UniversalErrorBoundaryFallbackProps } from './UniversalErrorBoundary';

type ErrorBoundaryHandler = (error: Error, errorInfo: React.ErrorInfo) => void;

export const ERROR_BOUNDARY_TOKEN = createToken<ErrorBoundaryHandler>(
  'reactErrorBoundaryHandlers',
  {
    multi: true,
  }
);

export const ROOT_ERROR_BOUNDARY_COMPONENT_TOKEN = createToken<
  React.ComponentType<UniversalErrorBoundaryFallbackProps>
>('rootErrorBoundaryComponent');

/**
 * @deprecated
 */
export const ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN = createToken<React.ReactElement>(
  'errorBoundaryFallbackComponent'
);
