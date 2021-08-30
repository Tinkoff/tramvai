import { format } from '@tinkoff/url';
import type { Request } from '@tinkoff/request-core';
import requestFactory from '@tinkoff/request-core';
import http from '@tinkoff/request-plugin-protocol-http';

const request = requestFactory([http()]);

type QueueReuestsOptions<T> = {
  requestsOptions: T[];
  makeRequest: (requestOptions: T) => Promise<unknown>;
  /**
   * Количество одновременно совершаемых реквестов.
   * @default 2
   */
  maxSimultaneous?: number;
};

export async function queueRequests<T>(options: QueueReuestsOptions<T>) {
  const { maxSimultaneous = 2, makeRequest, requestsOptions } = options;

  const req = async (option: T) => {
    try {
      await makeRequest(option);
      return {
        option,
        result: 'resolved',
      };
    } catch {
      return {
        option,
        result: 'rejected',
      };
    }
  };

  const queue = [];
  const result: Array<ReturnType<typeof req>> = [];

  for (const option of requestsOptions) {
    const promise = req(option);

    result.push(promise);

    const queuedPromise = promise.then(() => {
      const index = queue.indexOf(queuedPromise);

      return queue.splice(index, 1);
    });

    queue.push(queuedPromise);

    if (queue.length >= maxSimultaneous) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.race(queue);
    }
  }

  return Promise.all(result);
}

export function createRequestsOptions(options: {
  urls: string[];
  port: string;
  userAgents: string[];
}): Request[] {
  const { urls, port } = options;

  return urls.reduce((requestOptions, url) => {
    const ip = generateRandomIPv4Adress();

    requestOptions.push(
      ...options.userAgents.map(
        (userAgent): Request => ({
          url: format({
            hostname: 'localhost',
            port,
            path: url.replace(/:\w+/g, '0'),
          }),
          headers: {
            'User-Agent': userAgent,
            'X-Real-IP': ip,
          },
        })
      )
    );

    return requestOptions;
  }, []);
}

function generateRandomIPv4Adress() {
  const from = 0;
  const to = 255;
  const length = 4;
  const bytes = [];

  for (let i = 0; i < length; i++) {
    bytes.push(generateRandomNumberFromRange(from, to));
  }

  return bytes.join('.');
}

function generateRandomNumberFromRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function sendWarmUpRequest(options: Request): Promise<void> {
  return request(options);
}
