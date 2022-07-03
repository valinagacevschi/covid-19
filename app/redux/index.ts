import { combineReducers } from 'redux';
import { resettableReducer } from 'reduxsauce';
import configureStore from './createStore';
import { reducer as startup } from './startupRedux';
import { reducer as profile } from './profileRedux';
import { reducer as global } from './globalRedux';
import { reducer as series } from './seriesRedux';
import { reducer as geo } from './geoRedux';
import { reducer as symptoms } from './symptomsRedux';
import { reducer as messages } from './messagesRedux';
import rootSaga from '../sagas';

const resettable = resettableReducer('RESET');

const rootReducer = combineReducers({
  startup: resettable(startup),
  profile: resettable(profile),
  global: resettable(global),
  series: resettable(series),
  geo: resettable(geo),
  symptoms: resettable(symptoms),
  messages: resettable(messages),
});

export const { store, persistor } = configureStore(rootReducer, rootSaga);
