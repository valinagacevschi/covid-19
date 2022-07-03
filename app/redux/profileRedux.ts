import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboarded: null,
  setToken: ['token'],
  setCode: ['code'],
  setPlace: ['place'],
  getLocation: null,
  setLocation: ['location'],
  update: ['params']
});

export const ProfileTypes = Types;
export const ProfileActions = Creators;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  onboarded: false,
  registered: false,
  token: null,
  firstTime: true,
  progress: 30,
  code: null,
  country: null,
  province: null,
  area: null,
  location: { lat: null, lng: null },
  fetching: false,
  error: null,
  gps: false,
});

/* ------------- Reducers ------------- */

export const onboarded = state => 
  Immutable.merge(state, { onboarded: true });

export const request = state =>
  Immutable.merge(state, { fetching: true });

export const setToken = (state, action ) => 
  Immutable.merge(state, { token: action.token });

export const setCode = (state, { code }) =>
  Immutable.merge(state, { code, registered: true });

export const setLocation = (state, { location } ) => 
  Immutable.merge(state, { location, fetching: false,  firstTime: false });

export const setPlace = (state, { place }) =>
  Immutable.merge(state, { area: place.area, country: place.country, province: place.province });

export const update = (state, { params: { country, province, area, gps, lat, lng }}) =>
  Immutable.merge(state, { country, province, area, gps, location: { lat, lng }});

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ONBOARDED as string]: onboarded,
  [Types.GET_LOCATION as string]: request,
  [Types.SET_TOKEN as string]: setToken,
  [Types.SET_CODE as string]: setCode,
  [Types.SET_LOCATION as string]: setLocation,
  [Types.SET_PLACE as string]: setPlace,
  [Types.UPDATE as string]: update,
});
