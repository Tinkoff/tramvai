import type { ContextState } from '@tinkoff/request-core';
import request from '@tinkoff/request-core';
import deduplicate from '@tinkoff/request-plugin-cache-deduplicate';
import http from '@tinkoff/request-plugin-protocol-http';
import circuitBreaker from '@tinkoff/request-plugin-circuit-breaker';
import { createAgent } from './agent/createAgent';

const agent = createAgent();

export const makeRequest = () =>
  request([
    deduplicate(),
    circuitBreaker({
      failureThreshold: 75,
      minimumFailureCount: 3,
      isSystemError: () => true,
      getKey: (state: ContextState) => state.request.path,
    }),
    http({ agent }),
  ]);
