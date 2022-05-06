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

    const res = this.makeRequest<R>(adaptedReq);

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

  fork(forkOptions: HttpClientRequest = {}, mergeOptionsConfig: { replace?: boolean } = {}) {
    return new HttpClientAdapter({
      options: mergeOptions(this.options, forkOptions, mergeOptionsConfig),
      makeRequest: this.makeRequest,
    });
  }
}
