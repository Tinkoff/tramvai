import type { TramvaiAction, Action } from '@tramvai/types-actions-state-context';

export interface BundleOptions {
  presets?: BundlePreset[];
  name: string;
  components: {
    [key: string]: any;
  };
  reducers?: any[];
  actions?: (Action | TramvaiAction<any, any, any>)[];
}
export type BundlePreset = Partial<BundleOptions>;

export interface Bundle {
  name: string;
  components: BundleOptions['components'];
  actions?: BundleOptions['actions'];
  reducers?: BundleOptions['reducers'];
}

export type BundleImport = () => Promise<{ default: Bundle }>;
