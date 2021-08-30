import { createBundle } from '@tramvai/core';
import { store } from '../store';
import { bundleInLimit, bundleOutLimit } from '../actions/bundle';
import { Page } from '../components/Page';

export const mainDefault = createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: Page,
  },
  // укажем наш стор, чтобы он сразу проинициализировался и был подписан на свои события диспатча
  reducers: [store],
  // экшены можно указать как часть бандла - тогда эти экшены будут выполняться для всех страниц этого бандла
  actions: [bundleInLimit, bundleOutLimit],
});
