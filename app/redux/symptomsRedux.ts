import Immutable from 'seamless-immutable';
import { createReducer, createActions } from 'reduxsauce';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  symptomsGet: null,
  symptomsSuccess: ['payload'],
  symptomsError: ['error'],
  symptomLogsGet: null,
  symptomLogsSuccess: ['logs'],
  symptomReply: ['params'],
  summaryReply: ['params'],
  testReply: ['params'],
  symptomReplySuccess: null,
  symptomsResetScores: null,
});

export const SymptomsTypes = Types;
export const SymptomsActions = Creators;

export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({ 
  payload: [],
  logs: [],
  scores: {},
  fetching: null,
  error: null,
});

/* ------------- Reducers ------------- */

const request = (state) => Immutable.merge(state, { fetching: true });

const success = (state, action) => 
  Immutable.merge(state, { payload: action.payload, error: false, fetching: false });

const successLogs = (state, action) => 
  Immutable.merge(state, { logs: action.logs, error: false, fetching: false });

const error = (state, { error }) => 
  Immutable.merge(state, { fetching: false, error });

const updateScores = (state, { params }) => {  
  const { code, result } = params;
  const id = code || 0;
  const score = (state.scores[id] || 0) + Math.pow(10, result);
  const scores = { ...state.scores, [id]: score };
  return Immutable.merge(state, { scores });
}  

const resetScores = (state) => Immutable.merge(state, { scores: {} });

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SYMPTOMS_GET as string]: request,
  [Types.SYMPTOMS_SUCCESS as string]: success,
  [Types.SYMPTOM_LOGS_GET as string]: request,
  [Types.SYMPTOM_LOGS_SUCCESS as string]: successLogs,
  [Types.SYMPTOMS_ERROR as string]: error,
  [Types.SYMPTOM_REPLY as string]: updateScores,
  [Types.SUMMARY_REPLY as string]: resetScores,
  // [Types.SYMPTOMS_RESET_SCORES]: resetScores,
});
