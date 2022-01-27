import type { EventEmitter } from 'events';
import type { Compiler } from 'webpack';
import type { BuildType } from '../../../typings/build/Builder';

const PLUGIN_NAME = 'builder-webpack events';

export const emitWebpackEvents = (
  compiler: Compiler,
  eventEmitter: EventEmitter,
  type: BuildType
) => {
  compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
    eventEmitter.emit('invalid', type);
  });

  compiler.hooks.done.tap(PLUGIN_NAME, () => {
    eventEmitter.emit('done', type);
  });

  compiler.hooks.watchClose.tap(PLUGIN_NAME, () => {
    eventEmitter.emit('close', type);
  });
};
