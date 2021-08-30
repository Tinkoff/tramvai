import { createToken } from '@tinkoff/dippy';
import type { ConfigEntry } from '../../typings/configEntry/common';
import type { ConfigManager } from '../../config/configManager';
import type { Env } from '../../typings/Env';

export const CLI_ROOT_DIR_TOKEN = createToken<string>('cli rootDir');
export const CONFIG_ROOT_DIR_TOKEN = createToken<string>('config rootDir');

export const CONFIG_ENV_TOKEN = createToken<Env>('config env');
export const CONFIG_ENTRY_TOKEN = createToken<ConfigEntry>('config entry');
export const CONFIG_MANAGER_TOKEN = createToken<ConfigManager>('config manager');
