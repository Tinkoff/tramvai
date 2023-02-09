import noop from '@tinkoff/utils/function/noop';
import { useMemo, useContext, useState, useEffect, Suspense, memo } from 'react';
import type { ChildAppReactConfig } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_RENDER_TOKEN } from '@tramvai/tokens-child-app';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { useDi, UniversalErrorBoundary } from '@tramvai/react';
import { useUrl } from '@tramvai/module-router';
import { RenderContext } from './render-context';

const FailedChildAppFallback = ({
  config: { name, version, tag, fallback: Fallback },
}: {
  config: ChildAppReactConfig;
}) => {
  const logger = useDi(LOGGER_TOKEN);

  const log = logger('child-app:render');
  // On client-side hydration errors will be handled in `hydrateRoot` `onRecoverableError` property,
  // and update errors will be handled in Error Boundaries.
  //
  // Also, this component never be rendered at client-side, and we check environment only for safety
  // (server errors logic described here https://github.com/reactjs/rfcs/blob/main/text/0215-server-errors-in-react-18.md).
  //
  // On server-side, we still use `renderToString`,
  // and need to manually log render errors for components, wrapped in Suspense Boundaries.
  if (typeof window === 'undefined') {
    log.error({
      event: 'failed-render',
      message: 'child-app failed to render, will try to recover during hydration',
      name,
      version,
      tag,
    });
  }

  return Fallback ? <Fallback /> : null;
};

const ChildAppWrapper = ({
  name,
  version,
  tag,
  props,
  fallback: Fallback,
}: ChildAppReactConfig) => {
  const renderManager = useContext(RenderContext);
  const logger = useDi(LOGGER_TOKEN);

  const log = logger('child-app:render');
  const [maybeDi, maybePromiseDi] = useMemo(() => {
    return renderManager!.getChildDi({ name, version, tag });
  }, [name, version, tag, renderManager]);

  const [di, setDi] = useState(maybeDi);
  const [promiseDi, setPromiseDi] = useState(maybePromiseDi);

  useEffect(() => {
    if (!di && promiseDi) {
      // any errors with loading child-app should be handled in some other place
      promiseDi
        .then(setDi)
        .finally(() => setPromiseDi(undefined))
        .catch(noop);
    }
  }, [di, promiseDi]);

  if (!di && promiseDi) {
    // in case child-app was not rendered on ssr
    // and we have to wait before it's loading
    return Fallback ? <Fallback /> : null;
  }

  if (!di) {
    log.error({
      event: 'not-found',
      name,
      version,
      tag,
      message: 'child-app was not initialized',
    });

    if (process.env.__TRAMVAI_CONCURRENT_FEATURES || typeof window !== 'undefined') {
      throw new Error(
        `Child-app was not initialized, check the loading error for child-app "${name}"`
      );
    }

    return Fallback ? <Fallback /> : null;
  }

  try {
    const Cmp = di.get({ token: CHILD_APP_INTERNAL_RENDER_TOKEN, optional: true });

    if (!Cmp) {
      log.error({
        event: 'empty-render',
        message: 'Child-app does not provide render token',
        name,
        version,
        tag,
      });

      return null;
    }

    return <Cmp di={di} props={props} />;
  } catch (error: any) {
    log.error({
      event: 'get-render',
      message: 'Cannot get render token from child-app',
      error,
      name,
      version,
      tag,
    });

    return null;
  }
};

export const ChildApp = memo((config: ChildAppReactConfig) => {
  const { fallback } = config;
  const url = useUrl();

  const result = (
    <UniversalErrorBoundary url={url} fallback={fallback as any}>
      <ChildAppWrapper {...config} />
    </UniversalErrorBoundary>
  );

  if (process.env.__TRAMVAI_CONCURRENT_FEATURES) {
    return <Suspense fallback={<FailedChildAppFallback config={config} />}>{result}</Suspense>;
  }

  return result;
});
