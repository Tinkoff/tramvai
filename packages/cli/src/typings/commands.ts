import type { Provider } from '@tinkoff/dippy';

export interface Command {
  name: string;
  providers: Provider[];
}
