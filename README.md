# redux-duck

![CI Status](https://github.com/sergiodxa/redux-duck/workflows/CI/badge.svg)
![Publish Status](https://github.com/sergiodxa/redux-duck/workflows/Publish/badge.svg)
![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=sergiodxa/redux-duck)
[![Maintainability](https://api.codeclimate.com/v1/badges/be75f5fbab018e9e27fa/maintainability)](https://codeclimate.com/github/sergiodxa/redux-duck/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/be75f5fbab018e9e27fa/test_coverage)](https://codeclimate.com/github/sergiodxa/redux-duck/test_coverage)
![license](https://badgen.net/github/license/sergiodxa/redux-duck)
![releases](https://badgen.net/github/releases/sergiodxa/redux-duck)
![npm version](https://badgen.net/npm/v/sergiodxa/redux-duck)
![dependencies](https://badgen.net/david/dep/sergiodxa/redux-duck)

Helper function to create Redux modules using the [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux/) proposal.

## Installation

```sh
yarn add redux-duck
```

## API

### Create duck

```ts
import { createDuck } from "redux-duck";

const myDuck = createDuck("duck-name", "application-name");
```

- `createDuck` receive 2 arguments, the second argument is optional.
- The first argument is the duck name.
- The second, and optional, argument is the application or module name.

### Define action types

```ts
const ACTION_TYPE = myDuck.defineType("ACTION_TYPE");
```

- `defineType` receive just one argument.
- The argument is the name of the action.
- The result should be an string like `application-name/duck-name/ACTION_TYPE` or `duck-name/ACTION_TYPE` if the application or module name was not defined.

### Create action creators

```ts
const actionType = myDuck.createAction(ACTION_TYPE, false);
```

- `createAction` receive two arguments, the second argument is optional.
- The first argument is the action type.
- The second, and optional, argument is if the action will be an error one.
- This argument should be the defined action type string.
- It will return a function who will receive the action payload and meta data and return a valid (FSA compilant) action object.
- The action creator will receive two optional arguments, one with the action payload and another with the action meta data.

### Create reducer

```ts
const initialState = {
  list: Immutable.List(),
  data: Immutable.Map()
};

const reducer = myDuck.createReducer(
  {
    [ACTION_TYPE]: (state, action) => ({
      ...state,
      list: state.list.push(action.payload.id),
      data: state.map.set(action.payload.id + "", action.payload)
    })
  },
  initialState
);
```

- `createReducer` receive two arguments, both required.
- The first argument is an object with the possible action cases.
- The second argument is the reducer initial state.
- The first argument should use the previously defined _action types_ as keys.
- Each key in the first argument object should be a function who will receive the current state and the dispatched action as arguments and return the updated state.
