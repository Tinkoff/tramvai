/**
 * @jest-environment jsdom
 */
import { createMockStore } from '@tramvai/test-mocks';
import { testComponent } from '@tramvai/test-react';
import { createEvent } from '@tramvai/state';
import { useEvents } from '@tramvai/state';

it('should dispatch single event', async () => {
  const event = createEvent('testEvent');
  const store = createMockStore();

  const Cmp = () => {
    const dispatchEvent = useEvents(event);

    return <button type="button" aria-label="test" onClick={() => dispatchEvent()} />;
  };

  jest.spyOn(store, 'dispatch');

  const { render } = testComponent(<Cmp />, { store });

  expect(store.dispatch).not.toHaveBeenCalled();

  const button = await render.findByLabelText('test');

  button.click();

  expect(store.dispatch).toHaveBeenCalledWith({
    type: 'testEvent',
  });
});

it('should dispatch multiple events', async () => {
  const event1 = createEvent('testEvent1');
  const event2 = createEvent('testEvent2');
  const event3 = createEvent('testEvent3');
  const store = createMockStore();

  const Cmp = () => {
    const [dispatchEvent1, dispatchEvent2, dispatchEvent3] = useEvents([event1, event2, event3]);

    return (
      <>
        <button type="button" aria-label="test-1" onClick={() => dispatchEvent1()} />
        <button type="button" aria-label="test-2" onClick={() => dispatchEvent2()} />
        <button type="button" aria-label="test-3" onClick={() => dispatchEvent3()} />
      </>
    );
  };

  jest.spyOn(store, 'dispatch');

  const { render } = testComponent(<Cmp />, { store });

  expect(store.dispatch).not.toHaveBeenCalled();

  const button1 = await render.findByLabelText('test-1');

  button1.click();

  expect(store.dispatch).toHaveBeenCalledWith({
    type: 'testEvent1',
  });

  const button3 = await render.findByLabelText('test-3');

  button3.click();

  expect(store.dispatch).toHaveBeenCalledWith({
    type: 'testEvent3',
  });
});
