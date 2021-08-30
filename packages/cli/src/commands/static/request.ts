import createRequest from '@tinkoff/request-core';
import http from '@tinkoff/request-plugin-protocol-http';

export const request = createRequest([http()]);
