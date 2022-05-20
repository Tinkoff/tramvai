import concat from '@tinkoff/utils/array/concat';
import mergeWith from '@tinkoff/utils/object/mergeWith';
import omit from '@tinkoff/utils/object/omit';
import type { BundlePreset, BundleOptions, Bundle } from '@tramvai/tokens-core';

const mergePlan = (x: any, y: any): any => {
  if (Array.isArray(x) && Array.isArray(y)) {
    return concat(x, y);
  }
  if (typeof x === 'object' && typeof y === 'object') {
    return mergeWith(mergePlan, x, y);
  }

  return y;
};
const mergeOptions = /* #__PURE__*/ mergeWith(mergePlan);

const mergePresets = (presets?: BundlePreset[]): BundlePreset => {
  if (!presets || !presets.length) {
    return {};
  }

  const result = presets.map((preset) =>
    mergeOptions(mergePresets(preset.presets), omit(['presets'], preset))
  );

  if (result.length === 1) {
    return result[0];
  }

  return mergeOptions(...result);
};

export function createBundle(options: BundleOptions): Bundle {
  let presets: BundlePreset = {};
  if (options.presets) {
    presets = mergePresets(options.presets);
  }

  return mergeOptions(presets, options);
}
