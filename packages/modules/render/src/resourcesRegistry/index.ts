import toArray from '@tinkoff/utils/array/toArray';
import type { RESOURCES_REGISTRY } from '@tramvai/tokens-render';
import type { RESOURCE_INLINER } from '../resourcesInliner';

type ResourceRegistry = typeof RESOURCES_REGISTRY;
type PageResource = ReturnType<ResourceRegistry['getPageResources']>[0];

export class ResourcesRegistry implements ResourceRegistry {
  private resources: Set<PageResource> = new Set();
  private resourceInliner: typeof RESOURCE_INLINER;

  constructor({ resourceInliner }) {
    this.resourceInliner = resourceInliner;
  }

  register(resourceOrResources: PageResource | PageResource[]): void {
    toArray(resourceOrResources).forEach((resource) => {
      this.resources.add(resource);
    });
  }

  getPageResources(): PageResource[] {
    return Array.from(this.resources.values())
      .reduce((acc, resource) => {
        if (this.resourceInliner.shouldInline(resource)) {
          Array.prototype.push.apply(acc, this.resourceInliner.inlineResource(resource));
        } else {
          acc.push(resource);
        }
        return acc;
      }, [])
      .filter((resource: PageResource) => this.resourceInliner.shouldAddResource(resource));
  }
}
