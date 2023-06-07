import isArray from '@tinkoff/utils/is/array';
import { useMemo } from 'react';
import { useShallowEqual } from '@tinkoff/react-hooks';
import type { Event, EventCreatorN } from '@tramvai/types-actions-state-context';
import { useConsumerContext } from './useConsumerContext';

type ConvertEventToDispatch<Ev extends EventCreatorN<any>> = Ev extends (
  ...args: infer T
) => Event<infer P>
  ? (...args: T) => P
  : never;

export function useEvents<Ev extends EventCreatorN<any>>(event: Ev): ConvertEventToDispatch<Ev>;
export function useEvents<Ev extends Readonly<EventCreatorN<any>[]>>(
  events: Ev
): {
  [key in keyof Ev]: ConvertEventToDispatch<Ev[key]>;
};
export function useEvents(events: EventCreatorN | Array<EventCreatorN>) {
  const context = useConsumerContext();
  const eventsRef = useShallowEqual(events);

  return useMemo<any>(() => {
    if (isArray(eventsRef)) {
      return eventsRef.map((event) => (...args: any[]) => {
        const ev = event(...args);
        context.dispatch(ev);
        return ev.payload;
      });
    }

    return (...args: any[]) => {
      const ev = eventsRef(...args);
      context.dispatch(ev);
      return ev.payload;
    };
  }, [eventsRef, context]);
}
