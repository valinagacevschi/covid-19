import { createStore, applyMiddleware } from 'redux';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { StartupActions } from './startupRedux';
import { minor } from '../config';

export default (rootReducer, rootSaga) => {
  const enhancers = [];
  const persistConfig = {
    version: minor + 1,
    key: 'ROOTX',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
    blacklist: ['startup', 'profileX', 'globalX', 'seriesX', 'geoX', 
      'symptomsX', 'messages'] 
  };
  const startup = () => store.dispatch(StartupActions.startup());
  
  const sagaMiddleware = createSagaMiddleware();
  enhancers.push(sagaMiddleware);

  if (__DEV__) {
    const SAGA_LOGGING_BLACKLIST = [
      'EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 
      'persist/PERSIST', 'persist/REHYDRATE'
    ];
    const logger = createLogger({
      predicate: (_, { type }) =>
        (__DEV__ && SAGA_LOGGING_BLACKLIST.indexOf(type) < 0)
    });
    enhancers.push(logger);
  }

  const middleware = applyMiddleware(...enhancers);
  const pReducer = persistReducer(persistConfig, rootReducer);  
  const store = createStore(pReducer, middleware);
  const persistor = persistStore(store, null, startup);
  
  if (rootSaga) {
    sagaMiddleware.run(rootSaga);
  }

  if (module.hot) {
    module.hot.accept('./', () => {
      const nextRootReducer = require('./').default
      store.replaceReducer(
        persistReducer(persistConfig, nextRootReducer)
      )
    })
  }

  return { store, persistor };
}

