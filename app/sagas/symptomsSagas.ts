import { put, call, select } from 'redux-saga/effects';
import SymptomsActions from '../redux/symptomsRedux';

const selectProfile = state => state.profile;

export function* getSymptoms(api) {
  const response = yield call(api.getSymptoms);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SymptomsActions.symptomsError({ status, problem, text }));  
  }
  yield put(SymptomsActions.symptomsSuccess(response.data));
}

export function* getSymptomLogs(api) {
  const response = yield call(api.getSymptomLogs);
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SymptomsActions.symptomsError({ status, problem, text }));  
  }
  yield put(SymptomsActions.symptomLogsSuccess(response.data));
}

export function* symptomReply(api, action) {
  const { params } = action;
  const { code, country, province, area } = yield select(selectProfile);
  const response = yield call(api.symptomReply, { 
    symptom_log: params,
    profile: { code,  country,  province,  area }
  });
  
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SymptomsActions.symptomsError({ status, problem, text }));  
  }
  yield put(SymptomsActions.symptomReplySuccess());
}

export function* summaryReply(api, action) {
  const { params } = action;
  const { code, country, province, area } = yield select(selectProfile);
  const response = yield call(api.summaryReply, { 
    summary_log: params,
    profile: { code,  country,  province,  area }
  });
  
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SymptomsActions.symptomsError({ status, problem, text }));  
  }
  yield put(SymptomsActions.symptomReplySuccess());
}

export function* testReply(api, action) {
  const { params } = action;
  const { code,  country,  province,  area } = yield select(selectProfile);
  const response = yield call(api.testReply, { 
    roth_test: params,
    profile: { code,  country,  province,  area }  
  });
  
  if (!response.ok) {
    const { status, problem, data } = response;
    const text = `${data && data.error} ${data && data.message}`
    return yield put(SymptomsActions.symptomsError({ status, problem, text }));  
  }
  yield put(SymptomsActions.symptomReplySuccess());
}
