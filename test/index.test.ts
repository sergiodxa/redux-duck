import { createDuck } from '../src';

describe('Redux Duck', () => {
  test('define type without app name', () => {
    const duck = createDuck('duck-name');
    expect(duck.defineType('action-name')).toBe('duck-name/action-name');
  });

  test('define type with app name', () => {
    const duck = createDuck('duck-name', 'app-name');
    expect(duck.defineType('action-name')).toBe(
      'app-name/duck-name/action-name'
    );
  });

  test('create action creator', () => {
    const duck = createDuck('duck-name', 'app-name');
    const type = duck.defineType('action-name');

    const action = duck.createAction(type);
    expect(typeof action).toBe('function');
    expect(action()).toEqual({ type });
    expect(action({ id: 1 })).toEqual({ type, payload: { id: 1 } });
  });

  test('reducer', () => {
    const duck = createDuck('duck-name', 'app-name');
    const type = duck.defineType('action-name');
    const action = duck.createAction(type);

    type CountState = { count: number };

    const reducer = duck.createReducer<CountState>(
      {
        [type]: state => {
          return {
            count: state.count + 1,
          };
        },
      },
      { count: 0 }
    );

    expect(typeof reducer).toBe('function');
    expect(reducer(undefined, action())).toEqual({ count: 1 });
    expect(reducer({ count: 2 })).toEqual({ count: 2 });
  });
});
