import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { Platform } from '@unimodules/core';
import { Linking, Notifications } from 'expo';
import LottieView from 'lottie-react-native';
import ProfileActions from '../../redux/profileRedux';
import { parseUrlParams, uuid } from '../../services/utils';
import { SafeView } from '../../components/shared';
import { ActivityIndicator } from 'react-native';
import { Message } from '../../types';
import { MessagesActions } from '../../redux/messagesRedux';

export const LoadingScreen = (props: NavigationStackScreenProps) => {
  const { onboarded } = useSelector(state => state.profile, shallowEqual);  
  const dispatch = useDispatch();
  const animationRef = useRef(null);

  const retrieveLinkParams = (event: { url: string }) => {
    const params = parseUrlParams(event.url);
    const { code } = params
    if (code) {
      dispatch(ProfileActions.setCode(code))
    }
  }

  useEffect(() => {
    animationRef && animationRef.current && animationRef.current.play();

    Linking.getInitialURL().then(url => {
      // console.log('initial link', url);
      retrieveLinkParams({ url });
    }).catch(err => {
      console.warn('Initial URL Error', err)
    });

    Linking.addEventListener('url', retrieveLinkParams);

    Notifications.addListener((notification) => {
      const { data, origin, remote } = notification;
      // console.log('Notification', notification);
      const message: Message = {
        id: uuid(),
        text: data.text,
        date: `${new Date}`,
        link: data.screen,
        origin,
        remote
      }
      dispatch(MessagesActions.addMessage(message));
      if (data && data.screen) {
        props.navigation.navigate(data.screen, { reset: true });
      }
      if (Platform.OS === 'ios') {
        Notifications.setBadgeNumberAsync(0);
      }
    });
    if (Platform.OS === 'ios') {
      Notifications.setBadgeNumberAsync(0);
    }
    
    if (!onboarded) {
      props.navigation.navigate('onboarding');
    // } else if (!registered) {
    //   props.navigation.navigate('register');
    } else {
      props.navigation.navigate('main');
    }
  }, []);

  console.log('rendering LoadingScreen');
  return (
    <SafeView>
      {Platform.OS === 'ios' ? (
        <LottieView
          ref={animationRef}
          style={{ width: 120,  height: 120 }}
          source={require('../../components/graph/covid-19.json')}
          />
      ) : (
        <ActivityIndicator size={'large'} color={'red'} />
      )}
    </SafeView>
  );
}

export default LoadingScreen;
