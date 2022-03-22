import { Module } from '@tramvai/core';
import { CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN } from '@tramvai/tokens-child-app';
import { MediaStore } from '../shared/stores/media';
import { UserAgentStore } from '../shared/stores/userAgent';

@Module({
  providers: [
    {
      provide: CHILD_APP_INTERNAL_ROOT_STATE_ALLOWED_STORE_TOKEN,
      multi: true,
      useValue: [MediaStore, UserAgentStore],
    },
  ],
})
export class ClientHintsChildAppModule {}
