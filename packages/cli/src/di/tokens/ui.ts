import { createToken } from '@tinkoff/dippy';

export const UI_SHOW_BANNER_TOKEN = createToken<boolean>('ui showBanner');
export const UI_SHOW_PROGRESS_TOKEN = createToken<boolean>('ui showProgress');
export const UI_OS_NOTIFY_TOKEN = createToken<boolean>('ui osNotify');
