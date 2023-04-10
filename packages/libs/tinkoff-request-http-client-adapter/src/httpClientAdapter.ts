import type { MakeRequest } from '@tinkoff/request-core';
import { getHeaders, getStatus } from '@tinkoff/request-plugin-protocol-http';
import { BaseHttpClient } from '@tramvai/http-client';
import type {
  HttpClient,
  HttpClientBaseOptions,
  HttpClientError,
  HttpClientRequest,
  HttpClientResponse,
} from '@tramvai/http-client';
import { mergeOptions } from './mergeOptions';

export class HttpClientAdapter extends BaseHttpClient implements HttpClient {
  private options: HttpClientBaseOptions;
  private makeRequest: MakeRequest;

  constructor({
    options,
    makeRequest,
  }: {
    options: HttpClientBaseOptions;
    makeRequest: MakeRequest;
  }) {
    super();
    this.options = options;
    this.makeRequest = makeRequest;
  }

  request<R = any>(req: HttpClientRequest): Promise<HttpClientResponse<R>> {
    // применяем дефолтные опции до вызова modifyRequest на объекте запроса
    const optionsWithDefaults = mergeOptions(this.options, req);

    const { modifyRequest, modifyResponse, modifyError, interceptors, ...reqWithDefaults } =
      optionsWithDefaults;

    let _next = (_req: HttpClientRequest): Promise<HttpClientResponse<R>> =>
      this._processMakeRequest(_req, { modifyRequest, modifyResponse, modifyError });

    if (interceptors) {
      Array.from(interceptors)
        .reverse()
        .forEach((interceptor) => {
          const _prevNext = _next;
          _next = (_req) => interceptor(_req, _prevNext as any);
        });
    }

    return _next(reqWithDefaults);
  }

  fork(forkOptions: HttpClientRequest = {}, mergeOptionsConfig: { replace?: boolean } = {}) {
    return new HttpClientAdapter({
      options: mergeOptions(this.options, forkOptions, mergeOptionsConfig),
      makeRequest: this.makeRequest,
    });
  }

  // eslint-disable-next-line sort-class-members/sort-class-members
  private _processMakeRequest = async (
    reqAfterInterceptors: HttpClientRequest,
    {
      modifyRequest,
      modifyResponse,
      modifyError,
    }: {
      modifyRequest: HttpClientBaseOptions['modifyRequest'];
      modifyResponse: HttpClientBaseOptions['modifyResponse'];
      modifyError: HttpClientBaseOptions['modifyError'];
    }
  ): Promise<HttpClientResponse> => {
    const { method, body, requestType, ...adaptedReq } = modifyRequest
      ? modifyRequest(reqAfterInterceptors)
      : reqAfterInterceptors;

    if (method) {
      adaptedReq.httpMethod = method;
    }
    if (body) {
      adaptedReq.payload = body;
    }
    if (requestType) {
      adaptedReq.type = requestType;
    }

    const res = this.makeRequest(adaptedReq);

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
      const status = getStatus(res);
      const headers = getHeaders(res);

      // Useful for logging
      const errorWithMeta = Object.assign(error as HttpClientError, {
        __meta: meta,
        status,
        headers,
      });

      throw modifyError ? modifyError(errorWithMeta, adaptedReq) : errorWithMeta;
    }
  };
}
