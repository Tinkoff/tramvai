import React, { Component } from 'react';
import type { Url } from '@tinkoff/url';
import { FallbackError } from './fallback';
import type { ERROR_BOUNDARY_TOKEN } from './tokens';

type AnyError = Error & { [key: string]: any };

export interface UniversalErrorBoundaryFallbackProps {
  url: Url;
  error: AnyError;
}

export interface UniversalErrorBoundaryProps {
  url: Url;
  error?: AnyError | null;
  fallback?: React.ComponentType<UniversalErrorBoundaryFallbackProps>;
  errorHandlers?: typeof ERROR_BOUNDARY_TOKEN | null;
  /**
   * @deprecated
   */
  fallbackFromDi?: React.ReactElement | null;
  children?: React.ReactNode;
}

interface State {
  error: AnyError | null;
  url: Url;
}

type Props = UniversalErrorBoundaryProps;

export class UniversalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: props.error || null,
      url: props.url,
    };
  }

  static displayName = 'UniversalErrorBoundary';

  // Reference and explanation here - https://github.com/remix-run/remix/blob/main/packages/remix-react/errorBoundaries.tsx#L35
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.url !== state.url) {
      return { error: props.error || null, url: props.url };
    }
    return { error: props.error || state.error, url: state.url };
  }

  static getDerivedStateFromError(error: AnyError) {
    return { error };
  }

  componentDidCatch(error: AnyError, errorInfo: React.ErrorInfo) {
    const { errorHandlers } = this.props;

    if (errorHandlers) {
      errorHandlers.forEach((handler) => {
        handler(error, errorInfo);
      });
    }
  }

  render() {
    const { children, fallback: Fallback, fallbackFromDi } = this.props;
    const { url, error } = this.state;

    if (!error) {
      return children;
    }
    if (Fallback) {
      return <Fallback url={url} error={error} />;
    }
    if (fallbackFromDi) {
      return fallbackFromDi;
    }
    return <FallbackError />;
  }
}
