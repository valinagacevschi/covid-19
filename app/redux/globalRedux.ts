import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  currentGet: null,
  currentSuccess: ['payload'],
  currentError: ['errors'],
  newestGet: null,
  newestSuccess: ['newest'],
  newestError: ['errors'],
});

export const GlobalTypes = Types;
export const GlobalActions = Creators;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  payload: null,
  newest: null,
  fetching: false,
  error: null,
});

/* ------------- Reducers ------------- */

const request = (state) => Immutable.merge(state, { fetching: true });

const success = (state, action) => 
  Immutable.merge(state, { payload: action.payload, error: false, fetching: false });

const newest_success = (state, action) => 
  Immutable.merge(state, { newest: action.newest, error: false, fetching: false });

const error = (state, { error }) => 
  Immutable.merge(state, { fetching: false, error });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CURRENT_GET as string]: request,
  [Types.CURRENT_SUCCESS as string]: success,
  [Types.CURRENT_ERROR as string]: error,
  [Types.NEWEST_GET as string]: request,
  [Types.NEWEST_SUCCESS as string]: newest_success,
  [Types.NEWEST_ERROR as string]: error,
});
