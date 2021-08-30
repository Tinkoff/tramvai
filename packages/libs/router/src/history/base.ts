import type { Navigation, HistoryOptions, NavigationType } from '../types';
import type { RouteTree } from '../tree/tree';

export type Listener = (arg: {
  url: string;
  type?: NavigationType;
  navigateState?: any;
  replace?: boolean;
  history?: boolean;
}) => Promise<void>;

export abstract class History {
  protected listener?: Listener;
  protected tree?: RouteTree;

  init(navigation: Navigation): void {}

  abstract save(navigation: Navigation): void;

  abstract go(to: number, options?: HistoryOptions): Promise<void>;

  listen(listener: Listener): void {
    this.listener = listener;
  }

  setTree(tree: RouteTree): void {
    this.tree = tree;
  }
}
