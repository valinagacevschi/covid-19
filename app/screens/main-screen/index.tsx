import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { shallowEqual } from '@babel/types';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import styled from 'styled-components';
import Immutable from 'seamless-immutable';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';
import { Colors, Fonts } from '../../themes';
import { SafeView, Loading, Row, Bold } from '../../components/shared';
import { State, Global, Series } from '../../types';
import { ProfileActions } from '../../redux/profileRedux';
import { getNotificationsTokenAsync } from '../../services/utils';
import { SquareBox } from '../../components/squarebox';
import { Button } from '../../components/button';
import { UK } from '../../config';
import { Graph, EmptyGraph } from '../../components/graph';
import { SymptomsActions } from '../../redux/symptomsRedux';

const selectGlobalCounters = createSelector<State, Global, any>(
  state => state.global,
  ({ payload }) => ({
    confirmed: payload ? payload.confirmed : -1,
    deaths: payload ? payload.deaths : -1,
    recovered: payload ? payload.recovered : -1,
    lastUpdated: payload ? moment(payload.last_update) : -1,
  })
);

const selectSeries = createSelector<State, Series, any>(
  state => state.series,
  ({ payload, fetching }) => ({
    data: payload ? Immutable.asMutable(payload).map(d => ({ date: d.date, value: d.value })) : [],
    fetching
  })
);

export const MainScreen = (props: NavigationStackScreenProps) => {
  const { navigation } = props;
  const [toggle, setToggle] = useState(false);
  const { confirmed, recovered, deaths } = useSelector(selectGlobalCounters);
  const { data } = useSelector(selectSeries);
  const { firstTime, area, country, province, fetching } = useSelector(state => state.profile, shallowEqual);
  const dispatch = useDispatch();
    
  const reload = async (type) => {
    if (type === 'Navigation/BACK') {
      dispatch(ProfileActions.getLocation());
      dispatch(SymptomsActions.symptomLogsGet());
    }
  }

  useEffect(() => {
    getNotificationsTokenAsync(false).then(token => {
      dispatch(ProfileActions.setToken(token || 'NO_TOKEN'));
    }).catch(
      err => console.log('ERR', err)
    );
    dispatch(ProfileActions.getLocation());
  }, []);

  const showStats = () => {
    // dispatch(ProfileActions.getLocation());
    navigation.navigate('main_stats');
  }

  const subtitle = province ? province : country ? country : '';
  const graphTitle = 
    country == "US" ? "United States" :
    (area && country === UK) ? area : 
    province ? province : country;

  const infoText = country === UK ? 
    'Your results will be sent to A&E doctor for a review.' :
    'Check your symptoms frequently, even if you are feeling well.';
  
  console.log('rendering MainScreen', confirmed, recovered, deaths, data.length);
  return (
    <SafeView wide>
      <NavigationEvents onWillFocus={({action: { type }}) => reload(type)} />
      <FullBox>
        <InfoText>
          Let's see your symptoms now, to make sure everything is ok.
        </InfoText>
        <InfoText>
          <Bold>{infoText}</Bold>
        </InfoText>
        <Row style={{ marginTop: -10 }}>
          <Button 
            text={'Symptoms'} 
            onPress={() => navigation.navigate('main_symptoms', { reset: true })}
          /> 
          <Button 
            text={'Roth Test'}
            onPress={() => navigation.navigate('main_test')}
          />
        </Row>
      </FullBox>
      <Row>
        <SquareBox 
          onPress={showStats}
          type={'confirmed'}
          value={confirmed}
          title={'REPORTED CASES'}
          subtitle={subtitle}
        />
        {toggle ? (
          <SquareBox 
            onPress={() => setToggle(!toggle)}
            type={'recovered'}
            value={recovered}
            title={'RECOVERED CASES'}
            subtitle={subtitle}
          />
        ) : (
          <SquareBox 
            onPress={() => setToggle(!toggle)}
            type={'death'}
            value={deaths}
            title={'REPORTED DEATHS'}
            subtitle={subtitle}
          />
        )}
      </Row>
      {data.length > 0 ? (
        <Graph data={data} title={graphTitle} color={'blue'} />
      ) : ( 
        <EmptyGraph />
      )}
      {fetching && firstTime ? (
        <Loading>
          <ActivityIndicator size='large' color={Colors.error} />
        </Loading>
      ) : (
        null
      )}
    </SafeView>
  );
}

const FullBox = styled.View`
  flex: 0.9;
  backgroundColor: white;
  borderRadius: 10px;
  boxShadow: 0px 1px 2px #99999955;
  paddingTop: 15px;
  paddingHorizontal: 20px;
  marginTop: 10px;
  marginHorizontal: 10px;
`;

const InfoText = styled.Text`
  fontSize: ${Fonts.size.h6};
  marginBottom: 0;
`;

export default MainScreen;
