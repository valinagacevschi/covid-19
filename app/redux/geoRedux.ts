import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  geoGet: ['bounds'],
  geoSuccess: ['payload'],
  geoError: ['errors'],
});

export const GeoTypes = Types;
export const GeoActions = Creators;
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
  [Types.GEO_GET as string]: request,
  [Types.GEO_SUCCESS as string]: success,
  [Types.GEO_ERROR as string]: error,
});
