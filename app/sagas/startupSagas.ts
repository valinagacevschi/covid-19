import { put, call, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga'
import { SymptomsActions } from '../redux/symptomsRedux';
import { Updates } from 'expo';
import * as Sentry from 'sentry-expo';

const timer = () => eventChannel(emitter => {
  const interval = setInterval(() => { emitter(0); }, 300000);
  return () => { clearInterval(interval) }
})

export function* startup() {
  yield put(SymptomsActions.symptomsGet());
  yield put(SymptomsActions.symptomLogsGet());
  const channel = yield call(timer);
  yield takeEvery(channel, updateApp);
}

export function* updateApp() {
  try {
    yield put(SymptomsActions.symptomsGet());
    if (__DEV__) {
      return;
    }
    const update = yield call(Updates.checkForUpdateAsync);
    if (update.isAvailable) {
      const { isNew } = yield call(Updates.fetchUpdateAsync);
      if (isNew) {
        yield call(Updates.reloadFromCache);
      }
    }
  } catch (e) {
    Sentry.captureException(new Error(`Exception in updateApp ${JSON.stringify(e)}`));
  }
}
