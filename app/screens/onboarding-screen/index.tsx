import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import AppIntro from 'rn-falcon-app-intro';
import styled from 'styled-components'; 
import { Metrics, Colors, Fonts } from '../../themes';
import { ProfileActions } from '../../redux/profileRedux';
import { getNotificationsTokenAsync } from '../../services/utils';

export const OnboardingScreen = (props: NavigationStackScreenProps) => {
  const [locationCheck, setLoctionCheck] = useState(false);
  const [notify, setNotify] = useState(false);
  const dispatch = useDispatch();
  
  const onNext = (index: number) => {
    if (index === 1 && !locationCheck) {
      setTimeout(() => {
        setLoctionCheck(true);
        dispatch(ProfileActions.getLocation());      
      }, 850);
    }
    if (index === 3 && !notify) {
      setTimeout(() => {
        getNotificationsTokenAsync(true).then(token => {
          setNotify(true);
          dispatch(ProfileActions.setToken(token || 'NO_TOKEN'));
        }).catch(err => console.log('ERR', err));
      }, 850);
    } 
  }

  const onSkip = (index: number) => {    
    if (index < 1 && !notify) {
      getNotificationsTokenAsync(false).then(token => {
        dispatch(ProfileActions.setToken(token || 'NO_TOKEN'));
      }).catch(err => console.log('ERR', err));
    } 
    if (index < 3 && !locationCheck) {
      dispatch(ProfileActions.getLocation());
    }
    onDone(); 
  }

  const onDone = () => {
    const code = `demo-${Math.floor(100000 + Math.random() * 900000)}`;
    dispatch(ProfileActions.setCode(code));
    dispatch(ProfileActions.onboarded());
    props.navigation.navigate('loading'); 
  }

  return (
    <View style={{ flex: 1, marginTop: Metrics.screenOffset }}>
      <AppIntro
        onSkipBtnClick={onSkip}
        onDoneBtnClick={onDone}
        onNextBtnClick={onNext}
        onSlideChange={onNext}
        dotColor={Colors.steel}
        height={Metrics.screenHeight}
        activeDotColor={Colors.coal}
        leftTextColor={Colors.coal}
        rightTextColor={Colors.coal}
        showSkipButton={false}
        doneBtnLabel={<Done>Done</Done>}
      >
        <View style={styles.slide}>
          <Image
            source={require('./img/slide1.png')}
            resizeMode={'contain'}
            style={styles.absolute}
          />
          <Title>Symptoms</Title>
          <Info>
            Evaluate your symptoms perodically to track any changes of
            your health. The app will send you reminders so you don't have
            to worry. 
          </Info>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('./img/slide2.png')}
            resizeMode={'contain'}
            style={styles.absolute}
          />
          <Title>Contact your GP</Title>
          <Info>
            In the case you start developing the assessed symptoms,
            ask your GP for further instuctions.
          </Info>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('./img/slide3.png')}
            resizeMode={'contain'}
            style={styles.absolute}
          />
          <Title>Test for virus</Title>
          <Info>
            If your score upon assessing your symptoms becomes red,
            ask your GP to be tested for virus.
          </Info>
        </View>
        <View style={styles.slide}>
          <Image
            source={require('./img/slide4.png')}
            resizeMode={'contain'}
            style={styles.absolute}
          />
          <Title>Keep Safe</Title>
          <Info>
            Follow the profilactic instructions from your GP and avoid crowds 
            to make sure you're keeping the contagion away from you and your familly.
          </Info>
        </View>
      </AppIntro>
    </View>
  );
}

const Title = styled.Text`
  color: ${Colors.text};
  font-size: ${Fonts.size.h4};
  padding-bottom: 15px;
  font-weight: bold;
  text-align: center;
  padding-top: ${Metrics.onboardingOffset};
`;

const Info = styled.Text`
  color: ${Colors.text};
  fontSize: ${Fonts.size.h6};
  text-align: center;
  padding-horizontal: 40px;
`;

const Done = styled.Text`
  fontSize: ${Fonts.size.h6};
`;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#fff',
    width: Metrics.screenWidth,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 230,
  },
  absolute: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight
  }
});

export default OnboardingScreen;
