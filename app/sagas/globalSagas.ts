import { put, select, call } from 'redux-saga/effects';
import { GlobalActions } from '../redux/globalRedux';
import { ProfileActions } from '../redux/profileRedux';
import { SeriesActions } from '../redux/seriesRedux';

const selectProfile = state => state.profile;

export function* getCurrent(api) {
  const { country, province, area, location: { lat, lng } } = yield select(selectProfile);
  const params = { country, province, area, lat, lng }
  const response = yield call(api.getCurrent, params);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(GlobalActions.currentError({ status, problem, text }));
  }
  
  yield put(GlobalActions.currentSuccess(response.data));
  yield put(ProfileActions.update(response.data));
  yield put(SeriesActions.seriesGet());
}

export function* getNewest(api) {
  const { country, province, area, location: { lat, lng } } = yield select(selectProfile);
  const params = { country, province, area, lat, lng }
  const response = yield call(api.getNewest, params);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(GlobalActions.newestError({ status, problem, text }));
  }
  yield put(GlobalActions.newestSuccess(response.data));
}
