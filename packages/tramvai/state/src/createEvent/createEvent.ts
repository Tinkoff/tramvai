import isString from '@tinkoff/utils/is/string';
import identity from '@tinkoff/utils/function/identity';
import type {
  AnyEventCreator,
  AnyPayloadTransformer,
  EmptyEventCreator,
  EventCreator0,
  EventCreator1,
  EventCreator2,
  EventCreator3,
  EventCreatorN,
  PayloadTransformer0,
  PayloadTransformer1,
  PayloadTransformer2,
  PayloadTransformer3,
  PayloadTransformerN,
} from './createEvent.h';

export function createEvent(description: string): EmptyEventCreator;
export function createEvent<A1>(description: string): EventCreator1<A1>;

/**
 * Creates an event creator that accepts no arguments ([[EventCreator0]]).
 *
 * @typeparam Payload Type of event payload
 * @param description Event description
 * @param payloadCreator Optional payload creator
 */
export function createEvent<Payload>(
  description: string,
  payloadCreator: PayloadTransformer0<Payload>
): EventCreator0<Payload>;

export function createEvent(
  description: string,
  payloadCreator: undefined | null
): EventCreator1<any>;

/**
 * Creates an event creator that accepts and transforms single argument ([[EventCreator1]]).
 *
 * @typeparam A1 Type of event creator argument
 * @typeparam Payload Type of event payload
 * @param description Event description
 * @param payloadCreator Payload creator
 */
export function createEvent<A1, Payload>(
  description: string,
  payloadCreator: PayloadTransformer1<A1, Payload>
): EventCreator1<A1, Payload>;

/**
 * Creates an event creator that accepts and transforms two arguments ([[EventCreator2]]).
 *
 * @typeparam A1 Type of event creator first argument
 * @typeparam A2 Type of event creator second argument
 * @typeparam Payload Type of event payload
 * @param description Event description
 * @param payloadCreator Payload creator
 */
export function createEvent<A1, A2, Payload>(
  description: string,
  payloadCreator: PayloadTransformer2<A1, A2, Payload>
): EventCreator2<A1, A2, Payload>;

/**
 * Creates an event creator that accepts and transforms three arguments ([[EventCreator2]]).
 *
 * @typeparam A1 Type of event creator first argument
 * @typeparam A2 Type of event creator second argument
 * @typeparam A3 Type of event creator third argument
 * @typeparam Payload Type of event payload
 * @param description Event description
 * @param payloadCreator Payload creator
 */
export function createEvent<A1, A2, A3, Payload>(
  description: string,
  payloadCreator: PayloadTransformer3<A1, A2, A3, Payload>
): EventCreator3<A1, A2, A3, Payload>;

export function createEvent<Payload>(
  description: string,
  payloadCreator: PayloadTransformerN<Payload>
): EventCreatorN<Payload>;

export function createEvent(
  eventName: string,
  payloadCreator: AnyPayloadTransformer | unknown = identity
): AnyEventCreator {
  if (process.env.NODE_ENV !== 'production') {
    if (!isString(eventName) || !eventName.length) {
      throw new Error(`eventName should be not empty string, got '${eventName}'`);
    }
  }

  const type = eventName;

  const eventCreator: any = (...args: any[]) => {
    return {
      type,
      payload: (payloadCreator as any)(...args),
      store: eventCreator.store,
    };
  };

  eventCreator.getType = () => type;
  eventCreator.toString = () => type;

  return eventCreator;
}

export const isEventCreator = (eventCreator: any): eventCreator is AnyEventCreator => {
  return typeof eventCreator === 'function' && 'getType' in eventCreator;
};
