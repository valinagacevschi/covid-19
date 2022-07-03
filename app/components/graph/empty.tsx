import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { styles } from '.';
import { Platform } from '@unimodules/core';

export const EmptyGraph = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef && animationRef.current && animationRef.current.play();
  }, []);

  return (
    <View style={[styles.container]}>
      {Platform.OS === 'ios' ? (
        <LottieView
          ref={animationRef}
          style={styles.virus}
          source={require('./covid-19.json')}
        />
      ) : (
        <ActivityIndicator style={{ top: 70 }} size={'large'} color={'red'} />
      )}
    </View>
  );
};