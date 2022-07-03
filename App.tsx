import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Linking } from 'expo';
import { store, persistor } from './app/redux';
import RootNavigator from './app/navigation';
import { StatusBar, Modal, TextInput } from 'react-native';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// persistor.flush();
const prefix = Linking.makeUrl('/');

export default function App() {
  Sentry.init({
    dsn: 'https://999550171fb144e0a7d1c085a2dbe0a6@sentry.io/5183779',
    enableInExpoDevelopment: true,
    debug: true,
  });
  Sentry.setRelease(Constants.manifest.revisionId);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor={'white'} barStyle='dark-content' />
        <RootNavigator uriPrefix={prefix}/>
        <Modal animationType='slide'transparent={true} visible={false}/>
      </PersistGate>
    </Provider>
  );
}
