import { put, call, select } from 'redux-saga/effects';
import { ProfileActions } from '../redux/profileRedux';
import { getLocationAsync } from '../services/utils';
import { GlobalActions } from '../redux/globalRedux';

const selectProfile = state => state.profile;

export function* setToken(api, action) {  
  const { token } = action;
  const { code, country, province, area } = yield select(selectProfile);
  const params = { code, token, country, province, area };
  const response = yield call(api.saveToken, params);
  
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    console.log('ERROR', status, problem, text);
  }
}

export function* setCode(api, action) {
  const { code } = action;
  const { token, country, province, area } = yield select(selectProfile);
  const params = { code, token, country, province, area };
  const response = yield call(api.saveToken, params);
  
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    console.log('ERROR', status, problem, text);
  }
}

export function* getLocation() {
  const location = yield call(getLocationAsync);
  yield put(ProfileActions.setLocation(location || { lat: null, lng: null }));
  yield put(GlobalActions.currentGet());
}
