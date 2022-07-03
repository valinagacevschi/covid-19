import { put, call, select } from 'redux-saga/effects';
import { GeoActions } from '../redux/geoRedux';

const selectProfile = state => state.profile;


export function* getGeo(api, action) {
  const { country, province, area, location: { lat, lng } } = yield select(selectProfile);
  const params = { country, province, area, lat, lng, bounds: action.bounds }
  const response = yield call(api.getGeo, params);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(GeoActions.geoError({ status, problem, text }));
  }
  yield put(GeoActions.geoSuccess(response.data));
}
