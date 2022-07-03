import { put, select, call } from 'redux-saga/effects';
import { SeriesActions } from '../redux/seriesRedux';
import { formatSeries } from '../services/transforms';

const selectProfile = state => state.profile;

export function* getSeries(api) {
  const { country, province, area, location: { lat, lng } } = yield select(selectProfile);
  const params = { country, province, area, lat, lng }
  
  const response = yield call(api.getSeries, params);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SeriesActions.seriesError({ status, problem, text }));
  }
  yield put(SeriesActions.seriesSuccess(formatSeries(response.data.data)));
}
