import { AnyAction } from 'redux';
import { createDuck } from '../src';

describe('Redux Duck', () => {
  describe('Define Type', () => {
    test('Without App Name', () => {
      const duck = createDuck('duck-name');
      expect(duck.defineType('action-name')).toBe('duck-name/action-name');
    });

    test('With App Name', () => {
      const duck = createDuck('duck-name', 'app-name');
      expect(duck.defineType('action-name')).toBe(
        'app-name/duck-name/action-name'
      );
    });
  });

  describe('Action Creator', () => {
    test('No Error', () => {
      const duck = createDuck('duck-name', 'app-name');
      const type = duck.defineType('action-name');

      const action = duck.createAction(type);
      expect(typeof action).toBe('function');
      expect(action()).toEqual({
        type,
        error: false,
        meta: undefined,
        payload: undefined,
      });
      expect(action({ id: 1 })).toEqual({
        type,
        payload: { id: 1 },
        meta: undefined,
        error: false,
      });
      expect(action({ id: 1 }, { analytics: 'random' })).toEqual({
        type,
        payload: { id: 1 },
        meta: { analytics: 'random' },
        error: false,
      });
    });

    test('Error', () => {
      const duck = createDuck('duck-name', 'app-name');
      const type = duck.defineType('action-name');

      const action = duck.createAction(type, true);
      expect(typeof action).toBe('function');
      expect(action()).toEqual({
        type,
        error: true,
        meta: undefined,
        payload: undefined,
      });
      expect(action({ id: 1 })).toEqual({
        type,
        payload: { id: 1 },
        meta: undefined,
        error: true,
      });
      expect(action({ id: 1 }, { analytics: 'random' })).toEqual({
        type,
        payload: { id: 1 },
        meta: { analytics: 'random' },
        error: true,
      });
    });
  });

  test('Create Reducer', () => {
    const duck = createDuck('duck-name', 'app-name');
    const type = duck.defineType('action-name');
    const action = duck.createAction(type);

    const reducer = duck.createReducer(
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
    expect(reducer({ count: 2 }, (undefined as unknown) as AnyAction)).toEqual({
      count: 2,
    });
  });

  describe('Errors', () => {
    test('No Cases', () => {
      const duck = createDuck('duck-name', 'app-name');
      expect(() => duck.createReducer({}, '')).toThrowError(
        'You should pass at least one case name when creating a reducer.'
      );
    });

    test('Zero Valid Cases', () => {
      const duck = createDuck('duck-name', 'app-name');
      expect(() => duck.createReducer({ undefined: s => s }, '')).toThrowError(
        'All of your action types are undefined.'
      );
    });

    test('Only One Valid', () => {
      const duck = createDuck('duck-name', 'app-name');
      expect(() =>
        duck.createReducer({ valid: s => s, undefined: s => s }, '')
      ).toThrowError(
        'One or more of your action types are undefined. Valid cases are: valid.'
      );
    });

    test('More Than One Valid', () => {
      const duck = createDuck('duck-name', 'app-name');
      expect(() =>
        duck.createReducer(
          { valid: s => s, undefined: s => s, anotherValid: s => s },
          ''
        )
      ).toThrowError(
        'One or more of your action types are undefined. Valid cases are: valid, anotherValid.'
      );
    });
  });
});
