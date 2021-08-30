import each from '@tinkoff/utils/array/each';
import find from '@tinkoff/utils/array/find';
import findIndex from '@tinkoff/utils/array/findIndex';

import type { Route, NavigationRoute } from '../types';
import { getParts, parse } from './utils';
import { PartType } from './types';
import { HISTORY_FALLBACK_REGEXP } from './constants';

type Parameterized = {
  key: string;
  paramName: string;
  regexp?: RegExp;
  optional?: boolean;
  tree: Tree;
};

interface Tree {
  route?: Route;
  children: {
    [part: string]: Tree;
  };
  parameters: Array<Parameterized>;
  wildcardRoute?: Route;
  historyFallbackRoute?: Route;
}

const createTree = (route?: Route): Tree => {
  return {
    route,
    children: Object.create(null),
    parameters: [],
  };
};

const createNavigationRoute = (
  route: Route,
  pathname: string,
  params?: Record<string, string>
): NavigationRoute => {
  return {
    ...route,
    actualPath: pathname,
    params: params ?? {},
  };
};

export class RouteTree {
  private tree: Tree;

  constructor(routes?: Route[]) {
    this.tree = createTree();

    each((route) => this.addRoute(route), routes);
  }

  // eslint-disable-next-line max-statements
  addRoute(route: Route) {
    const parts = getParts(route.path);
    let currentTree = this.tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      const parsed = parse(part);

      if (parsed.type === PartType.historyFallback) {
        currentTree.historyFallbackRoute = route;
        return;
      }

      if (parsed.type === PartType.wildcard) {
        currentTree.wildcardRoute = route;
        return;
      }

      if (parsed.type === PartType.parameter) {
        const { paramName, regexp, optional } = parsed;

        // prevent from creating new entries for same route
        const found = find((par) => par.key === part, currentTree.parameters);

        if (found) {
          currentTree = found.tree;
        } else {
          const parameter = {
            key: part,
            paramName,
            regexp,
            optional,
            tree: createTree(),
          };

          if (regexp && !optional) {
            // insert parameters with regexp before
            const index = findIndex((par) => !par.regexp, currentTree.parameters);

            currentTree.parameters.splice(index, 0, parameter);
          } else {
            currentTree.parameters.push(parameter);
          }

          currentTree = parameter.tree;
        }
      } else {
        if (!currentTree.children[part]) {
          currentTree.children[part] = createTree();
        }

        currentTree = currentTree.children[part];
      }
    }

    currentTree.route = route;
  }

  getRoute(pathname: string) {
    return this.findRoute(pathname, 'route');
  }

  getWildcard(pathname: string) {
    return this.findRoute(pathname, 'wildcardRoute');
  }

  getHistoryFallback(pathname: string) {
    const route = this.findRoute(pathname, 'historyFallbackRoute');

    return (
      route && {
        ...route,
        // remove <history-fallback> from path
        actualPath: route.path.replace(HISTORY_FALLBACK_REGEXP, '') || '/',
      }
    );
  }

  // eslint-disable-next-line max-statements
  private findRoute(
    pathname: string,
    propertyName: 'route' | 'wildcardRoute' | 'historyFallbackRoute'
  ): NavigationRoute | undefined {
    // we should use exact match only for classic route
    // as special routes (for not-found and history-fallback) are defined for whole subtree
    const exactMatch = propertyName === 'route';
    const parts = getParts(pathname);

    const queue: Array<[currentTree: Tree, index: number, params?: Record<string, string>]> = [
      [this.tree, 0],
    ];

    while (queue.length) {
      const [currentTree, index, params] = queue.pop();

      const { children, parameters } = currentTree;
      // this flag mean we can only check for optional parameters
      // as we didn't find static route for this path, but still may find
      // some inner route inside optional branch
      // the value of parameter will be empty in this case ofc
      let optionalOnly = false;

      if (index >= parts.length) {
        if (currentTree[propertyName]) {
          return createNavigationRoute(currentTree[propertyName], pathname, params);
        }

        // here we cant check any options except for optional parameters
        optionalOnly = true;
      }

      // first add to queue special routes (not-found or history-fallback) to check it after other cases, as it will be processed last
      if (!exactMatch && currentTree[propertyName]) {
        queue.push([currentTree, parts.length, params]);
      }

      const part = parts[index];
      const child = children[part];

      // then add checks for only optional
      for (const param of parameters) {
        const { optional, tree } = param;

        if (optional) {
          queue.push([tree, index, params]);
        }
      }

      if (optionalOnly) {
        continue;
      }

      // for non-optional cases
      for (let i = parameters.length - 1; i >= 0; i--) {
        const param = parameters[i];
        const { paramName, tree, regexp } = param;

        const match = regexp?.exec(part);
        const paramValue = regexp ? match?.[1] : part;

        if (paramValue) {
          queue.push([tree, index + 1, { ...params, [paramName]: paramValue }]);
        }
      }

      if (child) {
        // add checks for static child subtree last as it will be processed first after queue.pop
        queue.push([child, index + 1, params]);
      }
    }
  }
}
