import { takeLatest, all } from 'redux-saga/effects';
import API from '../services/api';

/* ------------- Types ------------- */

import { StartupTypes } from '../redux/startupRedux';
import { ProfileTypes } from '../redux/profileRedux';
import { GlobalTypes } from '../redux/globalRedux';
import { SeriesTypes } from '../redux/seriesRedux';
import { GeoTypes } from '../redux/geoRedux';
import { SymptomsTypes } from '../redux/symptomsRedux';

/* ------------- Sagas ------------- */

import { startup, updateApp } from './startupSagas';
import { setToken, getLocation, setCode } from './profileSagas';
import { getCurrent, getNewest } from './globalSagas';
import { getSeries } from './seriesSagas';
import { getSymptoms, symptomReply, summaryReply, testReply, getSymptomLogs } from './symptomsSagas';
import { getGeo } from './geoSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
export const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(StartupTypes.UPDATE, updateApp),

    takeLatest(ProfileTypes.SET_TOKEN, setToken, api),
    takeLatest(ProfileTypes.SET_CODE, setCode, api),
    takeLatest(ProfileTypes.GET_LOCATION, getLocation),
    takeLatest(ProfileTypes.SET_PLACE, startup),

    takeLatest(GlobalTypes.CURRENT_GET, getCurrent, api),
    takeLatest(GlobalTypes.NEWEST_GET, getNewest, api),
    takeLatest(SeriesTypes.SERIES_GET, getSeries, api),
    takeLatest(GeoTypes.GEO_GET, getGeo, api),

    takeLatest(SymptomsTypes.SYMPTOMS_GET, getSymptoms, api),
    takeLatest(SymptomsTypes.SYMPTOM_LOGS_GET, getSymptomLogs, api),

    takeLatest(SymptomsTypes.SYMPTOM_REPLY, symptomReply, api),
    takeLatest(SymptomsTypes.SUMMARY_REPLY, summaryReply, api),
    takeLatest(SymptomsTypes.TEST_REPLY, testReply, api),
  ]);
}
