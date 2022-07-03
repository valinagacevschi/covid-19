import React, { useCallback, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Notifications, Linking } from 'expo';
import styled from 'styled-components';
import { FontAwesome } from '@expo/vector-icons';
import { SafeView } from '../../components/shared';
import { getConfig, version } from '../../config';
import { Colors, Fonts } from '../../themes';
import { StartupActions } from '../../redux/startupRedux';

export const SettingsScreen = (props: NavigationStackScreenProps) => {
  const { country, province, area, location: { lat, lng }, code, token } = useSelector(state => state.profile, shallowEqual);
  const [ count, setCount ] = useState(0);
  const dispatch = useDispatch();
  const { navigation } = props;

  const pushNotes = useCallback(async () => {
    await Notifications.scheduleLocalNotificationAsync({
      title: `Reminder`, 
      body: `It's time to evaluate your symptoms`,
      data: { screen: 'main_symptoms', text: `It's time to evaluate your symptoms`},
      ios: { _displayInForeground: true, count: 1 },
    } as any, { 
      time: (new Date()).getTime() + 10000 
    });
    Alert.alert('Test reminders', 'A new reminde was scheduled in 10 seconds.')
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET'});
    dispatch(StartupActions.startup());
    navigation.navigate('loading');
  }, []);

  const getGeo = async () => {
    const params = { country, province, area, lat, lng };
    alert(`P: ${JSON.stringify(params)}`);
    // const response = await api.getCurrent(params);
    // alert(`R: ${JSON.stringify(response && response.data)}`);
  }

  const { url } = getConfig();
  const link = Linking.makeUrl('/', { code });
  console.log('rendering SettingsScreen', token, code);
  
  return (
    <SafeView wide>
      <ScrollView style={{ paddingTop: 5 }}>
        <Group>
          <Line icon='map-marker' color={'#22aa08'} onPress={() => navigation.navigate('register', { clean: true })}>
            Change hospital code
          </Line>
          <Line icon='commenting' color={'#22aa08'} onPress={pushNotes} >
            Test reminders
          </Line>
          <Line icon='trash' color={'#dd2222'} onPress={reset}>
            Reset application data
          </Line>
        </Group>
        <Group>
          <Line icon='heartbeat' color={'#dd2222'} onPress={() => navigation.navigate('symptoms')}>
            About Symptoms
          </Line>
          <Line icon='info-circle' color={'#2292fd'} onPress={() => navigation.navigate('about')}>
            About COVID-19 Tester
          </Line>
          <Line icon='shield' color={'#2292fd'} onPress={() => navigation.navigate('help')}>
            Privacy terms
          </Line>
        </Group>
        <Group>
          { count > 8 ? (
            <>
            <Line icon='globe' color={'#ff9922'} onPress={() => alert(url)}>
              API endpoint
            </Line>
            <Line icon='link' color={'#ff9922'} onPress={() => alert(link)}>
              Deep link
            </Line>
            <Line icon='code' color={'#ff9922'} onPress={() => alert(token)}>
              Push notes token
            </Line>
            <Line icon='code' color={'#ff9922'} onPress={() => getGeo()}>
              Get Current
            </Line>
            </>
          ) : (
            null
          )}
          <Line icon='code-fork' color={'#22aa08'} hideCaret onPress={() => setCount(count+1)}>
            {`Version: ${version}`}
          </Line>
        </Group>
      </ScrollView>
    </SafeView>
  );
}

type LineProps = {
  onPress?: () => void;
  icon: string;
  color?: string;
  hideCaret?: boolean;
  children: any;
};
type IconProps = {
  color: string;
  name: string;
}

const Line = (props: LineProps) => {
  return (
    <LineButton onPress={props.onPress}>
      <Icon name={props.icon} color={props.color} />
      <LineText>{props.children}</LineText>
      {(props.onPress && !props.hideCaret) && <Caret />}
    </LineButton>
  );
}
const Icon = (props: IconProps) => (
  <Bubble color={props.color}>
    <FontAwesome name={props.name} color={Colors.banner} size={24}/>
  </Bubble>
)

const Caret = () => (
  <FontAwesome name={'chevron-right'} color={Colors.grey} size={20}/>
)
const Group = styled.View`
  margin: 5px;
  backgroundColor: ${Colors.whiteText};
  border: 1px solid #a9a9a999;
  borderRadius: 3;
`;

const LineButton = styled.TouchableOpacity`
  flexDirection: row;
  paddingVertical: 10;
  paddingLeft: 5;
  paddingRight: 5;
  borderColor: #d9d9d955;
  borderBottomWidth: 0.85;
  alignItems: center;
`;

const LineText = styled.Text`
  flex: 1;
  alignSelf: center;
  color: ${Colors.text};
  fontSize: ${Fonts.size.h6};
  marginLeft: 10;
  paddingRight: 10;
`;

const Bubble = styled.View`
  backgroundColor: ${props => props.color || '#00000000'};
  alignItems: center;
  justifyContent: center;
  width: 36;
  height: 36;
  borderRadius: 5;
  boxShadow: 0 1px 1px #22222255;
`;

export default SettingsScreen;
