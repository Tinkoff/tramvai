import { TramvaiCoreDecorator } from './decorators/tramvaiCoreDecorator';
import { RouterDecorator } from './decorators/routerDecorator';
import { ActionsDecorator } from './decorators/actionsDecorator';
import { ReactQueryDecorator } from './decorators/reactQueryDecorator';

export const decorators = [
  ReactQueryDecorator,
  ActionsDecorator,
  RouterDecorator,
  TramvaiCoreDecorator,
];
