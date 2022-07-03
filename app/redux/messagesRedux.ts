import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  addMessage: ['message'],
  delMessage: ['message'],
});

export const MessagesTypes = Types;
export const MessagesActions = Creators;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  payload: {},
});

/* ------------- Reducers ------------- */

const add = (state, action) => 
  Immutable.merge(state, { payload: {...state.payload, [action.message.id]: action.message } });
  
const del = (state, action) => {
  const payload = state.payload;
  payload.delete[action.message.id];
  Immutable.merge(state, { payload });
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_MESSAGE as string]: add,
  [Types.DEL_MESSAGE as string]: del,
});
