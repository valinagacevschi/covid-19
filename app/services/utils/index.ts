import { Notifications, Linking } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import { Alert } from 'react-native';
// import * as Sentry from 'sentry-expo';

const now = () => (
  __DEV__ && false ? new Date('2020-01-23 11:30:38') : new Date()
);

type Start = string | Date | moment.Moment;

export const isPastDay = (start: Start) => 
  moment(now()).isSame(moment(start).add(1, 'day'), 'day');

export const isToday = (start: Start) =>
  moment(start).isSame(now(), 'day');

export const isTillNow = (start: Start) =>
  moment(start).isBefore(now()) && moment(start).isSame(now(), 'day');

export const postponed = (start: Start) => 
  moment(start).add(1, 'hours').format();

export const parseUrlParams = (url: string): { code: string } => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {code: null};
  let match = null;
  while(match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  if (Object.keys(params).length > 0) {
    return params;
  }
  return null;
}

export const getNotificationsTokenAsync = async (warn: boolean): Promise<string> => {
  if (await isDenied(Permissions.NOTIFICATIONS)) {
    if (warn) {
      !__DEV__ && Alert.alert(
        'Notifications',
        '\nHey! You might want to enable notifications to get reminders to assess your symptoms.',
        [{ text: 'OK',  onPress: () => Linking.openURL('app-settings:') }, { text: 'Cancel' }],  
      );
    }
    return null;
  }
  const token = await Notifications.getExpoPushTokenAsync();
  await updateLocalNotifications();
  return token;
}

type LatLng = 'lat' | 'lng';
type Coords = { [key in LatLng]: number | ''; };

let countdown = 0;

export const getLocationAsync = async (): Promise<Coords> => {  
  if (countdown > 0 && await isDenied(Permissions.LOCATION)) {
    Alert.alert(
      'Location',
      '\nHey! You might want to enable location to get accurate info on confirmed cases near you.',
      [
        { text: 'Settings',  onPress: () => Linking.openURL('app-settings:') },
        { text: 'Cancel' },
      ],
    );
    countdown -= 1;
    return { lat: null, lng: null};
  }
  try {
    const { coords: { latitude: lat, longitude: lng} } = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    return { lat, lng };
  } catch (error) {
    // Sentry.captureException(new Error(`Exception in updateApp ${JSON.stringify(error)}`));
    return { lat: null, lng: null };
  }
}

const isDenied = async (permission: Permissions.PermissionType): Promise<boolean> => {
  const { status: existingStatus } = await Permissions.getAsync(permission);  
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(permission);
    finalStatus = status;
  }
  return finalStatus !== 'granted';
}

type TimingOptions = {
  time: number | Date;
  repeat?: 'day' | 'week' | 'month' | 'minute' | 'hour' | 'year';
}

const createDailyNotification = async (hour: number, minute: number) => {
  const localNotification: any = {
    title: `${hour}:${minute}`, 
    body: `It's time to evaluate your symptoms`,
    data: { screen: 'main_symptoms' },
    ios: { count: 1, _displayInForeground: true }
  };
  let tonight = moment().set({ hour, minute });
  if (moment().isAfter(tonight)) {
    tonight = tonight.add(1, 'day');
  }
  const options: TimingOptions = { time: tonight.valueOf(), repeat: 'day' };
  await Notifications.scheduleLocalNotificationAsync(localNotification, options);
}

const updateLocalNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  // await createDailyNotification(9, 30);
  await createDailyNotification(19, 30);
}

export const uuid = () => 
  (Math.random().toString(36).substring(2) + Date.now().toString(36));
