import { META_PRIORITY_DEFAULT } from './constants';

export const defaultPack = {
  title: 'Tramvai',
};

export const metaDefaultPack = (data) => (walker) => {
  walker.updateMeta(META_PRIORITY_DEFAULT, data);
};
