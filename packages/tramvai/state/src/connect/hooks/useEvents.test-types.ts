import { createEvent } from '../../createEvent/createEvent';
import { useEvents } from './useEvents';

describe('single event', () => {
  it('no options', () => {
    const event = createEvent('event');

    const dispatch = useEvents(event);

    dispatch();
    // @ts-expect-error
    dispatch('test');
    // @ts-expect-error
    dispatch(0);
    // @ts-expect-error
    dispatch({} as any);
  });

  it('one argument', () => {
    const event = createEvent('event', (a: number) => a);

    const dispatch = useEvents(event);

    // @ts-expect-error
    dispatch();
    // @ts-expect-error
    dispatch('test');
    dispatch(5);
    // @ts-expect-error
    dispatch(2, 3);
  });

  it('two arguments', () => {
    const event = createEvent('event', (a: string, b: boolean) => a);

    const dispatch = useEvents(event);

    // @ts-expect-error
    dispatch();
    // @ts-expect-error
    dispatch('test');
    // @ts-expect-error
    dispatch(5);
    // @ts-expect-error
    dispatch(2, 3);
    dispatch('test', false);
  });

  it('three arguments', () => {
    const event = createEvent('event', (a: boolean, b: string, c: number) => a);

    const dispatch = useEvents(event);

    // @ts-expect-error
    dispatch();
    // @ts-expect-error
    dispatch('test');
    // @ts-expect-error
    dispatch(5);
    // @ts-expect-error
    dispatch(2, 3);
    // @ts-expect-error
    dispatch('efef', 'fesf', 'fesf');
    dispatch(false, 'test', 3);
  });

  it('more arguments', () => {
    const event = createEvent('event', (a: number, b: string, c: boolean, d: boolean) => d);
    const dispatch = useEvents(event);

    dispatch();
    dispatch(2);
    dispatch(3, 4);
  });
});

describe('multiple events', () => {
  it('different events', () => {
    const event1 = createEvent('test-1');
    const event2 = createEvent('test-2', (a: number) => true);
    const event3 = createEvent('test-3', (a: string, b: boolean) => a);

    const [dispatchEvent1, dispatchEvent2, dispatchEvent3] = useEvents([
      event1,
      event2,
      event3,
    ] as const);

    dispatchEvent1();
    // @ts-expect-error
    dispatchEvent1('test');

    // @ts-expect-error
    dispatchEvent2();
    dispatchEvent2(3);

    // @ts-expect-error
    dispatchEvent3();
    dispatchEvent3('test', true);
  });
});
