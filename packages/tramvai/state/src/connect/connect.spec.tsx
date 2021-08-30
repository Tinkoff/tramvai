/**
 * @jest-environment jsdom
 */
import React from 'react';
import { testComponent } from '@tramvai/test-react';
import { waitRaf } from '@tramvai/test-jsdom';

import all from '@tinkoff/utils/array/all';
import identity from '@tinkoff/utils/function/identity';

import { BaseStore, createReducer, connect } from '@tramvai/state';

describe('connect integration tests', () => {
  const nodeEnv = process.env.NODE_ENV;

  process.env.NODE_ENV = 'production'; // в девелопе есть проверки работы mapStateToProps, не проверяем их

  afterAll(() => {
    process.env.NODE_ENV = nodeEnv;
  });

  it('test mapStateToProps calls in child component', async () => {
    class Store extends BaseStore<{ id: number }> {
      static storeName = 'test';

      state = { id: 1 };

      inc() {
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ id: this.state.id + 1 });
      }
    }

    const childMapState = jest.fn((state, props) => ({}));
    const rootMapState = jest.fn((state) => ({ id: state.test && state.test.id }));

    const Child = connect(['test'], childMapState)((props: any) => <div />);
    @connect(['test'], rootMapState)
    class Root extends React.Component<any, any> {
      // eslint-disable-next-line react/state-in-constructor
      state = { mounted: false };

      componentDidMount() {
        this.setState({ mounted: true });
      }

      render() {
        return (
          <>
            <Child rootId={this.props.id} childId={1} />
            {this.state.mounted && <Child rootId={this.props.id} childId={2} />}
          </>
        );
      }
    }

    const checkMapState = all(([state, props]) => state.test.id === props.rootId);

    const { context } = testComponent(<Root />, { stores: [Store] });
    expect(rootMapState).toHaveBeenCalledWith({ test: { id: 1 } }, undefined);
    expect(checkMapState(childMapState.mock.calls)).toBeTruthy();

    context.getStore(Store).inc();
    await waitRaf();

    expect(rootMapState).toHaveBeenCalledWith({ test: { id: 2 } }, undefined);
    expect(checkMapState(childMapState.mock.calls)).toBeTruthy();
  });

  it('should buffer changes in store', async () => {
    const reducer = createReducer<any>('test', {}).on('test', (state, [k, v]) => {
      return {
        ...state,
        [k]: v,
      };
    });

    const mapState = jest.fn((state, arg) => state);
    @connect(['test'], mapState)
    class Cmp extends React.Component<any, any> {
      render() {
        return null;
      }
    }
    const { context } = testComponent(<Cmp />, { stores: [reducer] });

    expect(mapState).toHaveBeenCalledWith({ test: {} }, {});
    mapState.mockClear();

    const store = context.getStore(reducer);

    store.handle(['a', 1], 'test');
    store.handle(['b', 2], 'test');
    store.handle(['c', 3], 'test');

    await waitRaf();
    store.handle(['d', 4], 'test');
    store.handle(['f', 5], 'test');

    expect(mapState).toHaveBeenCalledWith({ test: { a: 1, b: 2, c: 3 } }, {});
    expect(mapState).toHaveBeenCalledTimes(1);

    await waitRaf();
    expect(mapState).toHaveBeenCalledWith({ test: { a: 1, b: 2, c: 3, d: 4, f: 5 } }, {});
    expect(mapState).toHaveBeenCalledTimes(2);
  });

  it('should ignore optional stores if they not set', () => {
    class Store extends BaseStore<{}> {
      static storeName = 'test';
    }

    class StoreOne extends Store {
      static storeName = 'one';
    }

    class StoreTwo extends Store {
      static storeName = 'two';
    }

    const Cmp = connect(
      ['one', 'two', { store: 'optional', optional: true }],
      identity
    )(() => <div />);

    expect(() => {
      testComponent(<Cmp />, { stores: [StoreOne, StoreTwo] });
    }).not.toThrow();
  });

  it('mapState of child should have been called after mapState of parent component', async () => {
    class Store extends BaseStore<{ id: number }> {
      static storeName = 'test';

      state = { id: 1 };

      inc() {
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ id: this.state.id + 1 });
      }
    }

    class StoreOne extends Store {
      static storeName = 'one';
    }

    class StoreTwo extends Store {
      static storeName = 'two';
    }

    let calls = [];
    const mapState = (name) => (state) => {
      calls.push({ name, state });
    };

    const Child = connect(['one', 'two'], mapState('child'))(() => <div />);

    const Root = connect(['one'], mapState('root'))(() => <Child />);

    const { context } = testComponent(<Root />, { stores: [StoreOne, StoreTwo] });

    expect(calls).toEqual([
      { name: 'root', state: { one: { id: 1 }, two: { id: 1 } } },
      { name: 'child', state: { one: { id: 1 }, two: { id: 1 } } },
    ]);

    const stores = {
      one: context.getStore(StoreOne),
      two: context.getStore(StoreTwo),
    };

    calls = [];
    stores.one.inc();
    await waitRaf();

    expect(calls).toEqual([
      { name: 'root', state: { one: { id: 2 }, two: { id: 1 } } },
      { name: 'child', state: { one: { id: 2 }, two: { id: 1 } } },
    ]);

    /* тут дочерний компонент обновляется раньше и вот почему (см. файл ./connectAdvanced):
    1. child подписан на два стора one и two, когда root только на one
    2. если сначала изменяется стор two, то child первым подписывается на обновление через scheduling
    3. потом обновляется стор one и root добавляет свое обновление через scheduling (two уже подписан и ожидает когда scheduling
выполнит его обновление)
    4. child первым начинает выполнять перерендер, и из-за того что при рассчете mapStateToProps берется самое актуальное состояние -
child также в этом апдейте получает обновление стора one
    5. в итоге получаем что дочерний компонент получил обновление стора one раньше чем родительский

    Проблема также актуальна если компоненты подписаны на одни и теже сторы, но у дочернего поменялись какие-то ownProps из-за
    другого родителя в дереве с подписками на другие сторы
     */
    calls = [];
    stores.two.inc();
    stores.one.inc();
    await waitRaf();

    expect(calls).toEqual([
      { name: 'child', state: { one: { id: 3 }, two: { id: 2 } } },
      { name: 'root', state: { one: { id: 3 }, two: { id: 2 } } },
    ]);
    //
  });
});
