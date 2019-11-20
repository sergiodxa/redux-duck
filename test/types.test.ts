// This example code explains how to setup app "Pond" with two ducks, "Alfred" and "Winnie"

import { FSAAuto as FSA } from 'flux-standard-action';

import { createDuck, DuckBuilder } from '../src';

type Food = string;

// State Interfaces

export interface AlfredState {
  readonly belly: Food[];
  readonly happy: boolean;
}

export interface WinnieState {
  readonly home: boolean;
}

// Action Types

enum AlfredActions {
  EAT = 'pond/alfred/EAT',
  SLEEP = 'pond/alfred/SLEEP',
}
enum WinnieActions {
  GO_TO_WORK = 'pond/winnie/GO_TO_WORK',
  RETURN_HOME = 'pond/winnie/RETURN_HOME',
}

// Action Structures

type AlfredAction =
  | FSA<
      AlfredActions.EAT,
      {
        readonly food: Food;
      },
      {
        comment: string;
      }
    >
  | FSA<AlfredActions.SLEEP>;

type WinnieAction =
  | FSA<WinnieActions.GO_TO_WORK>
  | FSA<WinnieActions.RETURN_HOME>;

// Duck Initialization

const initialAlfred: AlfredState = {
  belly: [],
  happy: true,
};
const initialWinnie: WinnieState = {
  home: true,
};

// Global Configuration

type PondAction = AlfredAction | WinnieAction;

type PondDuckBuilder = DuckBuilder<PondAction>;

// Duck Builders

const alfredBuilder: PondDuckBuilder = createDuck('alfred', 'pond');
const winnieBuilder: PondDuckBuilder = createDuck('winnie', 'pond');

// Ducks

// In practice Alfred and Winnie should be their on modules.
// Here we just define an object for the respective exports.
//
// The module exports should match the "Redux Reducer Bundles"
// specification https://github.com/erikras/ducks-modular-redux
//
// TypeScript modules can not currently implement interfaces
// https://github.com/microsoft/TypeScript/issues/420

const winnieExports = {
  WinnieActions,
  default: winnieBuilder.createReducer<WinnieState>(
    {
      [WinnieActions.GO_TO_WORK]: state => ({
        ...state,
        home: false,
      }),
      [WinnieActions.RETURN_HOME]: state => ({
        ...state,
        home: true,
      }),
      // Alfred doesn't export any action types so
      // Winnie's state can not change based on them.
    },
    initialWinnie
  ),
  goToWork: winnieBuilder.createAction(WinnieActions.GO_TO_WORK),
  returnHome: winnieBuilder.createAction(WinnieActions.RETURN_HOME),
};

const alfredExports = {
  default: alfredBuilder.createReducer<AlfredState>(
    {
      [AlfredActions.EAT]: (state, { payload: { food } }) => ({
        ...state,
        belly: [...state.belly, food],
      }),
      [AlfredActions.SLEEP]: state => ({
        ...state,
        belly: [],
      }),
      // Winnie's action types are exported and
      // can therefore cause changes in Alfred.
      [winnieExports.WinnieActions.GO_TO_WORK]: state => ({
        ...state,
        happy: false,
      }),
      [winnieExports.WinnieActions.RETURN_HOME]: state => ({
        ...state,
        happy: true,
      }),
    },
    initialAlfred
  ),
  eat: alfredBuilder.createAction(AlfredActions.EAT),
  sleep: alfredBuilder.createAction(AlfredActions.SLEEP),
};

describe('Redux Duck', () => {
  test('Type Definitions', () => {
    expect(winnieExports).toBeDefined();
    expect(alfredExports).toBeDefined();
  });
});
