# PubSub (publish/subscribe)

Pubsub is a class implementing publisher/subscriber design pattern where messages are sent as promises

### subscribe - event subscription

`pubsub.subscribe('type', callback)` - subscribe to event with name `type`. `callback` accepts as arguments payload from `pubsub.publish`. `callback` can return promise which will can be awaited from call `pubsub.publish`.

### publish - event publish

`pubsub.publish('type', ...args)` - publish event with name `type`. `args` will be passed as arguments to the subscribers. Return promise which will be resolved after resolve of all subscriptions.

## Typed PubSub

PubSub can use typed events. For example: a common PubSub with many events and subscriptions.

In order to enable type checking for event subscriptions:

1. Create a new type with all event definitions:

```ts
type MyAwesomeFeatureEvents = {
  event1: (payload: number) => any;
  event2: (payload: { prop: boolean }) => any;
};
```

2. Do a typecast in code when using PubSub instance. It will enable type checks for every usage for a new typed instance

```ts
const featurePubSub = (pubSub as any) as PubSub<MyAwesomeFeatureEvents>;

// OK! 👍
featurePubSub.subscribe('event1', (payload) => console.log(1 + payload));
featurePubSub.publish('event1', 2);

// Error 👎
featurePubSub.subscribe('event3', (payload) => console.log(1 + payload)); // No such event
featurePubSub.publish('event3', 2); // НNo such event

featurePubSub.subscribe('event1', (payload) => payload.toLowerCase()); // Wrong payload type
featurePubSub.publish('event1', 'string'); // number expected
```
