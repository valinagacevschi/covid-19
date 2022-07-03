import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startup: null,
  update: null,
});

export const StartupTypes = Types;
export const StartupActions = Creators;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  rehydrated: false,
});

/* ------------- Reducers ------------- */

export const startup = state => 
  Immutable.merge(state, { rehydrated: true });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STARTUP as string]: startup,
});
