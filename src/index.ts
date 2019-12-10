import { Reducer, Action, AnyAction } from 'redux';
import {
  FSA,
  FSAWithPayload,
  FSAWithPayloadAndMeta,
} from 'flux-standard-action';

export type AppName = string;
export type DuckName = string;
export type ActionName = string;

export type ActionType = string; // AppName/DuckName/ActionName or just DuckName/ActionName

// Ducks define FSA actions
export type ActionCreator<
  A extends FSA<any, any, any> = FSA<any, any, any>
> = A extends FSAWithPayloadAndMeta<any, any, any>
  ? (a: A['payload'], b: A['meta']) => A
  : A extends FSAWithPayload<any, any, any>
  ? (a: A['payload']) => A
  : A extends FSA
  ? (a?: A['payload'], b?: A['meta']) => A
  : never;

// Ducks can listen for any actions (FSA or not)
export type ActionHandlers<S = any, A extends Action = AnyAction> = {
  [T in A['type']]?: (x: S, y: Extract<A, { type: T }>) => S;
};

export interface DuckBuilder<AppAction extends Action = AnyAction> {
  defineType: (a: ActionName) => ActionType;
  createAction: <T extends string & AppAction['type']>(
    a: T,
    b?: boolean
  ) => ActionCreator<Extract<AppAction, FSA<T, any, any>>>;
  createReducer: <S>(
    a: ActionHandlers<S, AppAction>,
    b: S
  ) => Reducer<S, AppAction>;
}

const defaultAction: FSA = { type: '@@INVALID' };

function validateCases(cases: ActionType[]): void {
  if (cases.length === 0) {
    throw new Error(
      'You should pass at least one case name when creating a reducer.'
    );
  }

  const validCases = cases.filter(caseName => caseName !== 'undefined');

  if (validCases.length === 0) {
    throw new Error('All of your action types are undefined.');
  }

  if (validCases.length !== Object.keys(cases).length) {
    throw new Error(
      `One or more of your action types are undefined. Valid cases are: ${validCases.join(
        ', '
      )}.`
    );
  }
}

export function createDuck(name: DuckName, app?: AppName): DuckBuilder {
  return {
    defineType: function(type) {
      if (app) {
        return `${app}/${name}/${type}`;
      }
      return `${name}/${type}`;
    },

    createReducer: function(cases, defaultState) {
      validateCases(Object.keys(cases));

      return function reducer(state = defaultState, action = defaultAction) {
        for (const caseName in cases) {
          if (action.type === caseName) {
            const handler = cases[caseName];
            if (typeof handler === 'undefined') {
              throw new Error(`missing handler for ${caseName}`);
            }
            return handler(state, action);
          }
        }
        return state;
      };
    },

    createAction: function(type, isError = false) {
      return function actionCreator(payload?, meta?) {
        return { type, payload, error: isError, meta };
      };
    },
  };
}
