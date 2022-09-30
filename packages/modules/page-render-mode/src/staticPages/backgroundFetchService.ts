import fetch from 'node-fetch';
import { format } from '@tinkoff/url';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';
import type { STATIC_PAGES_BACKGROUND_FETCH_ENABLED } from '../tokens';

const userAgentByDeviceType = {
  /** Chrome on Mobile */
  'mobile-modern':
    'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.3071.125 Mobile Safari/537.36',
  /** Old Chrome on Mobile */
  'mobile-default':
    'Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.3071.125 Mobile Safari/537.36',
  /** Chrome on Mac OS */
  'desktop-modern':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.3987.87 Safari/537.36',
  /** Old Chrome on Mac OS */
  'desktop-default':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.3987.87 Safari/537.36',
};

type Logger = ExtractDependencyType<typeof LOGGER_TOKEN>;
type BackgroundCacheEnabled = ExtractDependencyType<typeof STATIC_PAGES_BACKGROUND_FETCH_ENABLED>;

export class BackgroundFetchService {
  private requests = new Set<string>();

  private log: ReturnType<Logger>;
  private backgroundFetchEnabled: BackgroundCacheEnabled;

  constructor({
    logger,
    backgroundFetchEnabled,
  }: {
    logger: Logger;
    backgroundFetchEnabled: BackgroundCacheEnabled;
  }) {
    this.log = logger('static-pages');
    this.backgroundFetchEnabled = backgroundFetchEnabled;
  }

  enabled() {
    return this.backgroundFetchEnabled();
  }

  async revalidate({
    key,
    path,
    port,
    deviceType,
    modern,
  }: {
    key: string;
    path: string;
    port: string;
    deviceType: string;
    modern: string;
  }) {
    if (this.requests.has(key)) {
      return;
    }

    const revalidateUrl = format({
      hostname: 'localhost',
      port,
      path,
    });

    this.requests.add(key);

    this.log.debug({
      event: 'background-fetch-init',
      key,
      revalidateUrl,
    });

    return fetch(revalidateUrl, {
      headers: {
        'User-Agent': userAgentByDeviceType[`${deviceType}-${modern}`],
        'X-Tramvai-Static-Page-Revalidate': 'true',
      },
      timeout: 10000,
    })
      .then(async (response) => {
        const body = await response.text();
        const headers = response.headers.raw();
        const { status } = response;

        this.log.debug({
          event: status >= 500 ? 'background-fetch-5xx' : 'background-fetch-success',
          status,
          key,
        });

        return {
          body,
          headers,
          status,
        };
      })
      .catch((error) => {
        this.log.warn({
          event: 'background-fetch-error',
          error,
          key,
        });
      })
      .finally(() => {
        this.requests.delete(key);
      });
  }
}
