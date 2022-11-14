import request from '@tinkoff/request-core';
import deduplicate from '@tinkoff/request-plugin-cache-deduplicate';
import http from '@tinkoff/request-plugin-protocol-http';
import { createAgent } from './agent/createAgent';

const agent = createAgent();

export const makeRequest = () => request([deduplicate(), http({ agent })]);
