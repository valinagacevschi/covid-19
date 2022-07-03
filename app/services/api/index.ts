import { Platform } from 'react-native';
import Constants from 'expo-constants';
import apisauce from 'apisauce';
import { getConfig } from '../../config';

const TIMEOUT = 120000;
const { url } = getConfig();

const create = (baseURL = url) => {
  const api = apisauce.create({
    baseURL,
    headers: { 
      'Cache-Control': 'no-cache', 
      DeviceId: Constants.installationId,
      DeviceType: Platform.OS,
      // Authorization: `Basic secret-token`,
      Accept: 'application/json',
    },
    timeout: TIMEOUT
  });

  const getCurrent = (params) =>
    api.post(`current/`, params);

  const getSeries = (params) =>
    api.post(`series/`, params);

  const getNewest = (params) =>
    api.post(`newest/`, params);

  const getGeo = (params) =>
    api.post(`geo/`, params);

  const getSymptoms = () => 
    api.post(`symptoms/`, {code: 'COVID-19'});

  const getSymptomLogs = () => 
    api.post(`symptom_logs/`);

  const symptomReply = (params) => 
    api.post(`symptom/`, params);

  const summaryReply = (params) => 
    api.post(`symptom_summary/`, params);

  const testReply = (params) => 
    api.post(`symptom_test/`, params);

  const saveToken = (params) =>
    api.post(`token/`, params);

  return {
    getCurrent,
    getSeries,
    getNewest,
    getGeo,
    getSymptoms,
    getSymptomLogs,
    symptomReply,
    summaryReply,
    testReply,
    saveToken,
  };
}

export default { create };

export const testAsync = async (param: string) => {
  console.log('testAsync', param);
  return `==${param}==`;
}
