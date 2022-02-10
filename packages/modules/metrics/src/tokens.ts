import { createToken } from '@tramvai/core';
import type { ModuleConfig } from './request/types';

export const METRICS_MODULE_CONFIG_TOKEN = createToken<ModuleConfig>('metrics-module-config');
