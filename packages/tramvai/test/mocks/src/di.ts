import type { Provider } from '@tinkoff/dippy';
import { createContainer } from '@tinkoff/dippy';

interface Options {
  providers?: Provider[];
}

/**
 * Создаёт di-сontainer
 *
 * @param providers - список провайдеров, которые будут добавлены в создаваемый di-контейнер
 */
export const createMockDi = ({ providers = [] }: Options = {}) => {
  return createContainer(providers);
};
