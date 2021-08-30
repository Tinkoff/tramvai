import type { Url } from '@tinkoff/url';
import { ClientRouter } from './client';
import type { Navigation } from '../types';

const omitHash = (url: Url) => url.href.replace(/#.*$/, '');

export class NoSpaRouter extends ClientRouter {
  protected run(navigation: Navigation) {
    const { type, fromUrl, url } = navigation;

    // support only updateCurrentRoute or hash navigations
    if (type === 'updateCurrentRoute' || omitHash(url) === omitHash(fromUrl)) {
      return super.run(navigation);
    }

    return this.notfound(navigation);
  }

  // do not call any hooks as it is only supports url updates with hash
  protected async runHooks() {}
}
