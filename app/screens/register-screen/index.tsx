import React, { useState, useEffect, useCallback } from 'react';
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import ProfileActions from '../../redux/profileRedux';
import { 
  SafeView,
  CardView,
  Bold,
  Summary,
} from '../../components/shared';
import { Button } from '../../components/button';
import { Fonts } from '../../themes';
import { shallowEqual } from '@babel/types';
import { Platform } from '@unimodules/core';

const wrong = (text: string) => (text == null ||  text.length < 6);

export const RegisterScreen = (props: NavigationStackScreenProps) => {
  const { navigation } = props;
  const clean = navigation.getParam('clean');
  const { code, registered } = useSelector(state => state.profile, shallowEqual);
  const [value, setValue] = useState(code);
  const dispatch = useDispatch();

  useEffect(() => {
    if (registered && !clean) {
      navigation.navigate('loading'); 
    }
  }, [registered, code]);

  const saveCode = useCallback(() => {
    if (wrong(value)) {
      return;
    }
    dispatch(ProfileActions.setCode(value));
    navigation.navigate('loading');
  }, [value]);

  console.log('rendering RegisterScreen', code, registered);
  return (
    <SafeView onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView 
        behavior={'position'}
        enabled 
        keyboardVerticalOffset={Platform.OS === 'ios' ? (clean ? 120 : 10) : -80 }
      >
        <CardView>
          <Summary>
            <Bold>This is a prototype application for monitoring your symptoms which should
            not replace a diagnosis made by a doctor.</Bold>
          </Summary>
          <Summary>
            By entering the code you agree to participate to the testing of this application.
          </Summary>
          <Summary>
            Please insert your hospital number provided by your A&E doctor.
          </Summary>
          <Input
            value={value}
            autoCorrect={false}
            autoCompleteType={'off'}
            autoCapitalize={'none'}
            onChangeText={setValue}
            onSubmitEditing={saveCode}
            placeholder={'enter number'}
            returnKeyType={'send'}
          />
          <Button disabled={wrong(value)} text={'Enter'} onPress={saveCode} />
        </CardView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}

const Input = styled.TextInput`
  fontSize: ${Fonts.size.h4};
  borderColor: #55555555;
  borderBottomWidth: 1;
  paddingHorizontal: 5;
  paddingVertical: 3;
  width: 75%;
  marginVertical: 20;
  alignSelf: center;
  textAlign: center;
`;

export default RegisterScreen;
