export type FSA = {
  type: ActionType;
  payload?: any;
};

type AppName = string;
type DuckName = string;
type ActionName = string;
type ActionType = string;

type CaseFn<State> = (state: State, action?: FSA) => State;

type Case<State> = {
  [type: string]: CaseFn<State>;
};

const defaultAction: FSA = { type: '@@INVALID' };

export function createDuck(name: DuckName, app?: AppName) {
  function defineType(type: ActionName): ActionType {
    if (app) {
      return `${app}/${name}/${type}`;
    }
    return `${name}/${type}`;
  }

  function createReducer<State>(cases: Case<State>, defaultState: State) {
    return function reducer(state = defaultState, action = defaultAction) {
      for (const caseName in cases) {
        if (action.type === caseName) return cases[caseName](state, action);
      }
      return state;
    };
  }

  function createAction(type: ActionType) {
    return function actionCreator<Payload>(payload?: Payload): FSA {
      const action: FSA = {
        type,
        payload,
      };

      return action;
    };
  }

  return {
    defineType,
    createReducer,
    createAction,
  };
}
