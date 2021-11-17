import type { MakeRequest } from '@tinkoff/request-core';
import { getHeaders, getStatus } from '@tinkoff/request-plugin-protocol-http';
import type {
  HttpClient,
  HttpClientBaseOptions,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
} from '@tramvai/http-client';
import { mergeOptions } from './mergeOptions';

export class HttpClientAdapter implements HttpClient {
  private options: HttpClientBaseOptions;
  private tinkoffRequest: MakeRequest;

  constructor({
    options,
    tinkoffRequest,
  }: {
    options: HttpClientBaseOptions;
    tinkoffRequest: MakeRequest;
  }) {
    this.options = options;
    this.tinkoffRequest = tinkoffRequest;
  }

  async request<R = any>(req: HttpClientRequest): Promise<HttpClientResponse<R>> {
    // применяем дефолтные опции до вызова modifyRequest на объекте запроса
    const optionsWithDefaults = mergeOptions(this.options, req);

    const { modifyRequest, modifyResponse, modifyError, ...reqWithDefaults } = optionsWithDefaults;

    const { method, body, requestType, ...adaptedReq } = modifyRequest
      ? modifyRequest(reqWithDefaults)
      : reqWithDefaults;

    if (method) {
      adaptedReq.httpMethod = method;
    }
    if (body) {
      adaptedReq.payload = body;
    }
    if (requestType) {
      adaptedReq.type = requestType;
    }

    const res = this.tinkoffRequest<R>(adaptedReq);

    try {
      const payload = await res;
      const status = getStatus(res);
      const headers = getHeaders(res);

      const resToModify = {
        payload,
        status,
        headers,
      };

      return modifyResponse ? modifyResponse(resToModify) : resToModify;
    } catch (error) {
      const meta = res.getExternalMeta();
      // Useful for logging
      const errorWithMeta = Object.assign(error as HttpClientError, { __meta: meta });

      throw modifyError ? modifyError(errorWithMeta, adaptedReq) : errorWithMeta;
    }
  }

  get(
    path: string,
    payload: Pick<HttpClientRequest, 'query' | 'headers'> = {},
    config: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'> = {}
  ) {
    return this.request({
      path,
      ...payload,
      ...config,
      method: 'GET',
    });
  }

  post<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ) {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'POST',
    });
  }

  put<R = any>(
    path: string,
    payload?: Pick<HttpClientRequest, 'query' | 'body' | 'headers'>,
    config?: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'>
  ) {
    return this.request<R>({
      path,
      requestType: 'json',
      ...payload,
      ...config,
      method: 'PUT',
    });
  }

  delete<R = any>(
    path: string,
    payload: Pick<HttpClientRequest, 'query' | 'headers'> = {},
    config: Omit<HttpClientRequest, 'url' | 'query' | 'body' | 'headers'> = {}
  ) {
    return this.request<R>({
      path,
      ...payload,
      ...config,
      method: 'DELETE',
    });
  }

  fork(forkOptions: HttpClientRequest = {}, mergeOptionsConfig: { replace?: boolean } = {}) {
    return new HttpClientAdapter({
      options: mergeOptions(this.options, forkOptions, mergeOptionsConfig),
      tinkoffRequest: this.tinkoffRequest,
    });
  }
}
