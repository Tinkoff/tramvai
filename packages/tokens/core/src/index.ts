import { createToken } from '@tinkoff/dippy';
import type { Action } from './action';

export * from './action';
export * from './command';
export * from './bundle';

export const BUNDLE_LIST_TOKEN = createToken('bundleList');
export const ACTIONS_LIST_TOKEN = createToken<Action[]>('actionsList');
export const MODULES_LIST_TOKEN = createToken('modulesList');
export const APP_INFO_TOKEN = createToken<{ appName: string; [key: string]: string }>('appInfo');
