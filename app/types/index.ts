export interface State {
  startup: Startup;
  profile: Profile;
  symptoms: Symptoms;
  global: Global;
  series: Series;
  geo: Geo;
  messages: Messages;
}

export interface Startup {
  rehydrated: boolean;
}

export interface Profile {
  onboarded: boolean;
  registered: boolean;
  code: string;
  country: string;
  province: string;
  area: string;
  token: string;
  fetching: boolean;
  error: string;
  gps: boolean;
  location: { lat: number, lng: number };
}

export interface Log {
  id: number;
  treatment_id: number;
  score: number;
  viewed: boolean;
  created_at: string;
}

export interface Messages {
  payload: Message;
}

export interface Message {
  id: string;
  text: string;
  date: string;
  link?: string;
  remote: boolean;
  origin: 'received' | 'selected'
}

export interface Symptoms extends BaseRedux {
  scores: object,
  payload: Array<any>;
  logs: Array<any>;
}

export interface GlobalRecord {
  confirmed: number;
  deaths: number;
  recovered: number;
  serious: number;
  last_update: string;
}

export interface NewestRecord extends GlobalRecord {
  confirmed_delta: number;
  deaths_delta: number;
}


export interface Global extends BaseRedux {
  payload: GlobalRecord;
  newest: NewestRecord;
}

export interface SeriesRecord {
  value: number;
  date: Date;
}

export interface Series extends BaseRedux {
  payload: SeriesRecord[];
}

export interface GeoRecord {
  country: string;
  province: string;
  area: string;
  confirmed: number;
  recovered: number;
  deaths: number;
  last_update: string;
  coords: {
    latitude: number;
    longitude: number;
  }
}

export interface Geo extends BaseRedux {
  payload: GeoRecord[];
}

interface BaseRedux {
  fetching: boolean;
  error: boolean;
}
