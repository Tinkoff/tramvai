import { createToken } from '@tinkoff/dippy';
import type { PageAction } from './action';

export * from './action';
export * from './command';
export * from './bundle';

export const BUNDLE_LIST_TOKEN = createToken('bundleList');
export const ACTIONS_LIST_TOKEN = createToken<PageAction[]>('actionsList');
export const MODULES_LIST_TOKEN = createToken('modulesList');
export const APP_INFO_TOKEN = createToken<{ appName: string; [key: string]: string }>('appInfo');
