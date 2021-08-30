import { createReducer, createEvent } from '@tramvai/state';
import type { MediaInfo } from '../../types';

export interface Media extends MediaInfo {
  supposed?: boolean;
  synchronized?: boolean;
}

export const setMedia = createEvent<Media>('setMedia');

const initialState: Media = {
  height: 0,
  width: 0,
  isTouch: false,
  retina: false,
  synchronized: false,
};

export const MediaStore = createReducer('media', initialState).on(setMedia, (state, media) => {
  return {
    ...state,
    ...media,
  };
});
