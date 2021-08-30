import { useCallback } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';
import { useRouter } from './useRouter';
import type { NavigateOptions } from '../../types';

interface UseNavigate {
  (rootOptions: Partial<NavigateOptions> | string): () => Promise<void>;
  (): (specificOptions: NavigateOptions | string) => Promise<void>;
}

const convertToNavigateOptions = (options: Partial<NavigateOptions> | string) => {
  return typeof options === 'string' ? { url: options } : options;
};

export const useNavigate: UseNavigate = (rootOptions?: Partial<NavigateOptions> | string) => {
  const router = useRouter();
  const rootOpts = useShallowEqual(convertToNavigateOptions(rootOptions));

  return useCallback(
    (specificOptions?: NavigateOptions | string) => {
      const opts = rootOpts ?? convertToNavigateOptions(specificOptions);

      return router.navigate(opts);
    },
    [rootOpts, router]
  );
};
