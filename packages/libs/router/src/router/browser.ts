import type { Options } from './abstract';
import { ClientRouter } from './client';
import type { Navigation, HookName } from '../types';
import { logger } from '../logger';
import { RouteTree } from '../tree/tree';

const DELAY_CHECK_INTERVAL = 50;
export class Router extends ClientRouter {
  protected delayedNavigation: Navigation;
  protected delayedPromise: Promise<void>;
  protected delayedResolve: () => void;
  protected delayedReject: (error: Error) => void;

  constructor(options: Options) {
    super(options);
    this.tree = new RouteTree(options.routes);

    this.history.setTree(this.tree);
  }

  async rehydrate(navigation: Navigation) {
    return this.resolveIfDelayFound(super.rehydrate(navigation));
  }

  async start() {
    await super.start();

    if (this.delayedNavigation) {
      const { delayedNavigation } = this;

      this.delayedNavigation = null;

      return this.flattenDelayedNavigation(delayedNavigation);
    }
  }

  protected async run(navigation: Navigation) {
    // if router is not started yet delay current navigation without blocking promise resolving
    if (!this.started) {
      this.delayNavigation(navigation);
      return;
    }
    // if we have already running navigation delay current one and call it later
    if (this.currentNavigation) {
      return this.delayNavigation(navigation);
    }

    return this.flattenDelayedNavigation(navigation);
  }

  protected delayNavigation(navigation: Navigation) {
    this.delayedNavigation = navigation;

    logger.info({
      event: 'delay-navigation',
      navigation,
    });

    if (this.delayedPromise) {
      return this.delayedPromise;
    }

    // resolve promise only after latest navigation has been executed
    this.delayedPromise = new Promise((resolve, reject) => {
      this.delayedResolve = resolve;
      this.delayedReject = reject;
    });

    return this.delayedPromise;
  }

  protected commitNavigation(navigation: Navigation) {
    // if we have parallel navigation do not update current url, as it outdated anyway
    if (navigation.cancelled) {
      logger.debug({
        event: 'delay-ignore-commit',
        navigation,
      });

      return;
    }

    return super.commitNavigation(navigation);
  }

  protected async runGuards(navigation: Navigation) {
    // drop checking guards if we have delayed navigation
    if (navigation.cancelled) {
      logger.debug({
        event: 'delay-ignore-guards',
        navigation,
      });
      return;
    }

    return super.runGuards(navigation);
  }

  protected async runHooks(hookName: HookName, navigation: Navigation) {
    // drop hook calls if we have an other navigation delayed
    // except only for case when current navigation already happened
    // and we should synchronize this update with app
    // (in case app has some logic for currently showing url on afterNavigate or afterRouteUpdate)
    if (navigation.cancelled && this.lastNavigation !== navigation) {
      logger.debug({
        event: 'delay-ignore-hooks',
        navigation,
      });

      return;
    }

    try {
      await super.runHooks(hookName, navigation);
    } catch (error) {
      return this.notfound(navigation);
    }
  }

  private async resolveIfDelayFound(task: Promise<any>) {
    let delayResolve: Function;
    const timer = setInterval(() => {
      if (this.delayedNavigation) {
        if (
          this.delayedNavigation.type === 'navigate' ||
          this.delayedNavigation.type === this.currentNavigation?.type
        ) {
          logger.info({
            event: 'delay-navigation-found',
            navigation: this.delayedNavigation,
          });

          // set cancelled flag
          if (this.currentNavigation) {
            this.currentNavigation.cancelled = true;
            this.currentNavigation = null;
          }

          // resolve current navigation to start new navigation asap
          delayResolve();
        } else {
          // updateCurrentRoute should happen only after currentNavigation, so resolve it first to prevent dead-lock
          this.delayedResolve();
        }
      }
    }, DELAY_CHECK_INTERVAL);

    await Promise.race([
      task,
      new Promise((resolve) => {
        delayResolve = resolve;
      }),
    ]);

    clearInterval(timer);
    delayResolve();
  }

  private async flattenDelayedNavigation(navigation: Navigation) {
    const flatten = async (nav: Navigation) => {
      await this.resolveIfDelayFound(super.run(nav));

      // if new navigation has been called while this navigation lasts
      // call new navigation execution
      if (this.delayedNavigation) {
        const { delayedNavigation } = this;

        logger.info({
          event: 'delay-navigation-run',
          navigation: delayedNavigation,
        });

        this.delayedNavigation = null;

        return flatten(delayedNavigation);
      }
    };

    return flatten(navigation)
      .then(
        () => {
          this.delayedResolve?.();
        },
        (err) => {
          this.delayedReject?.(err);
        }
      )
      .finally(() => {
        this.delayedPromise = null;
        this.delayedResolve = null;
        this.delayedReject = null;
      });
  }
}
