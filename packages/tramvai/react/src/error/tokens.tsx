import type React from 'react';
import { createToken } from '@tinkoff/dippy';

type ErrorBoundaryHandler = (error: Error, errorInfo: React.ErrorInfo) => void;

export const ERROR_BOUNDARY_TOKEN = createToken<ErrorBoundaryHandler[]>(
  'reactErrorBoundaryHandlers',
  {
    multi: true,
  }
);

export const ERROR_BOUNDARY_FALLBACK_COMPONENT_TOKEN = createToken<React.ReactElement>(
  'errorBoundaryFallbackComponent'
);
