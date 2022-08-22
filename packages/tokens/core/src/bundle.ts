import type { Reducer } from '@tramvai/types-actions-state-context';
import type { PageAction } from './action';

export interface BundleOptions {
  presets?: BundlePreset[];
  name: string;
  components: {
    [key: string]: any;
  };
  reducers?: Reducer<any, any>[];
  actions?: PageAction[];
}
export type BundlePreset = Partial<BundleOptions>;

export interface Bundle {
  name: string;
  components: BundleOptions['components'];
  actions?: BundleOptions['actions'];
  reducers?: BundleOptions['reducers'];
}

export type BundleImport = () => Promise<{ default: Bundle }>;
