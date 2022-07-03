import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  seriesGet: null,
  seriesSuccess: ['payload'],
  seriesError: ['errors'],
});

export const SeriesTypes = Types;
export const SeriesActions = Creators;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  payload: null,
  fetching: false,
  error: null,
});

/* ------------- Reducers ------------- */

const request = (state) => Immutable.merge(state, { fetching: true });

const success = (state, action) => 
  Immutable.merge(state, { payload: action.payload, error: false, fetching: false });

const error = (state, { error }) => 
  Immutable.merge(state, { fetching: false, error });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SERIES_GET as string]: request,
  [Types.SERIES_SUCCESS as string]: success,
  [Types.SERIES_ERROR as string]: error,
});
