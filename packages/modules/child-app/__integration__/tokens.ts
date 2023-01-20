import { createToken } from '@tramvai/core';
import type { HttpClient } from '@tramvai/module-http-client';

export const FAKE_API_CLIENT = createToken<HttpClient>('fakeApiClient');
