import type { FASTIFY_RESPONSE, EARLY_HINTS_MANAGER_TOKEN } from '@tramvai/tokens-server-private';
import type { PageResource, RESOURCES_REGISTRY } from '@tramvai/tokens-render';

type EarlyHintsInterface = typeof EARLY_HINTS_MANAGER_TOKEN;
type Response = typeof FASTIFY_RESPONSE;
type ResourcesRegistry = typeof RESOURCES_REGISTRY;

interface ConstructorPayload {
  response: Response;
  resourcesRegistry: ResourcesRegistry;
}

export class EarlyHintsManager implements EarlyHintsInterface {
  private sentHints = new Set<string>();
  private readonly response: Response;
  private readonly resourcesRegistry: ResourcesRegistry;

  constructor(payload: ConstructorPayload) {
    this.response = payload.response;
    this.resourcesRegistry = payload.resourcesRegistry;
  }

  public async flushHints(): Promise<void> {
    const hints = this.getHints();

    await this.writeToSocket(hints);
  }

  private getHints(): Array<string> {
    return this.resourcesRegistry.getPageResources().reduce<Array<string>>((acc, resource) => {
      let resourceHint: string | null = null;
      let cdnHint: string | null = null;

      if (resource.type === 'preconnectLink') {
        resourceHint = `Link: <${resource.payload}>; rel=preconnect`;
      }

      if (resource.type === 'preloadLink') {
        const as = this.getAsAttribute(resource);

        resourceHint = `Link: <${resource.payload}>; rel=preload;${as}`;
        cdnHint = this.getCdnHintForResource(resource);
      }

      if (resource.type === 'style' && resource.attrs?.['data-critical'] === 'true') {
        resourceHint = `Link: <${resource.payload}>; rel=preload; as=style`;
        cdnHint = this.getCdnHintForResource(resource);
      }

      // prevent scripts preloading because of potential large numbers of JS chunks for every page
      // still check JS chunks for preconnects
      if (resource.type === 'script' && resource.attrs?.['data-critical'] === 'true') {
        cdnHint = this.getCdnHintForResource(resource);
      }

      if (this.doesHintUniq(cdnHint)) {
        acc.push(cdnHint);
        this.sentHints.add(cdnHint);
      }

      if (this.doesHintUniq(resourceHint)) {
        acc.push(resourceHint);
        this.sentHints.add(resourceHint);
      }

      return acc;
    }, []);
  }

  private writeToSocket(hints: Array<string>): Promise<void> {
    return new Promise((resolve) => {
      const { socket } = this.response.raw;

      // Socket will be null if the connection has been closed already
      if (socket === null || hints.length === 0) {
        resolve();

        return;
      }

      const message = this.getHttpMessage(hints);

      socket.write(message, 'ascii', () => {
        resolve();
      });
    });
  }

  private getHttpMessage(payload: Array<string>): string {
    const endOfLine = '\r\n';
    const result = ['HTTP/1.1 103 Early Hints', ...payload];

    // There must be an empty line between HTTP messages.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
    return `${result.join(endOfLine)}${endOfLine.repeat(2)}`;
  }

  private getAsAttribute(resource: PageResource): string {
    return resource.attrs?.as !== undefined ? ` as=${resource.attrs.as}` : '';
  }

  private getCdnHintForResource(resource: PageResource): string | null {
    const match = resource.payload.match(/https:\/\/[^/'"]+/gi);

    return match === null ? null : `Link: <${match[0]}>; rel=preconnect`;
  }

  private doesHintUniq(hint: string | null): boolean {
    return hint !== null && !this.sentHints.has(hint);
  }
}
