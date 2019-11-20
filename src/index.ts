type AppName = string;
type DuckName = string;
type ActionName = string;
type ActionType = string;

export type FSA<Payload = undefined, Meta = undefined> = {
  type: ActionType;
  payload?: Payload;
  meta?: Meta;
  error?: boolean;
};

type CaseFn<State> = (state: State, action?: FSA) => State;

type Case<State> = {
  [type: string]: CaseFn<State>;
};

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

export function createDuck(name: DuckName, app?: AppName) {
  function defineType(type: ActionName): ActionType {
    if (app) {
      return `${app}/${name}/${type}`;
    }
    return `${name}/${type}`;
  }

  function createReducer<State>(cases: Case<State>, defaultState: State) {
    validateCases(Object.keys(cases));

    return function reducer(state = defaultState, action = defaultAction) {
      for (const caseName in cases) {
        if (action.type === caseName) return cases[caseName](state, action);
      }
      return state;
    };
  }

  function createAction<Payload, Meta = undefined>(
    type: ActionType,
    isError = false
  ) {
    return function actionCreator(
      payload?: Payload,
      meta?: Meta
    ): FSA<Payload, Meta> {
      return { type, payload, error: isError, meta };
    };
  }

  return {
    defineType,
    createReducer,
    createAction,
  };
}
