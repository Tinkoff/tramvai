export type Event<Payload = void> = {
  readonly type: string;
  readonly payload: Payload;
};

export type BaseEventCreator<Payload> = {
  getType(): string;
};

export type EmptyEventCreator = BaseEventCreator<void> & (() => Event<void>);

export type EventCreator0<Payload> = BaseEventCreator<Payload> & (() => Event<Payload>);

export type EventCreator1<A1, Payload = A1> = BaseEventCreator<Payload> &
  ((arg1: A1) => Event<Payload>);

export type EventCreator2<A1, A2, Payload = A1> = BaseEventCreator<Payload> &
  ((arg1: A1, arg2: A2) => Event<Payload>);

export type EventCreator3<A1, A2, A3, Payload = A1> = BaseEventCreator<Payload> &
  ((arg1: A1, arg2: A2, arg3: A3) => Event<Payload>);

export type EventCreatorN<Payload = any> = BaseEventCreator<Payload> &
  ((...args: any) => Event<Payload>);

export type PayloadTransformer0<Payload> = () => Payload;

export type PayloadTransformer1<A1, Payload> = (arg1: A1) => Payload;

export type PayloadTransformer2<A1, A2, Payload> = (arg1: A1, arg2: A2) => Payload;

export type PayloadTransformer3<A1, A2, A3, Payload> = (arg1: A1, arg2: A2, arg3: A3) => Payload;

export type PayloadTransformerN<Payload> = (...args: any) => Payload;

/**
 * @private
 */
export type AnyEventCreator<Payload = any> =
  | EmptyEventCreator
  | EventCreator1<any, Payload>
  | EventCreator2<any, any, Payload>
  | EventCreator3<any, any, any, Payload>;

/**
 * @private
 */
export type AnyPayloadTransformer =
  | PayloadTransformer0<any>
  | PayloadTransformer1<any, any>
  | PayloadTransformer2<any, any, any>
  | PayloadTransformer3<any, any, any, any>;

export type EventCreators = {
  [K: string]: AnyEventCreator;
};
