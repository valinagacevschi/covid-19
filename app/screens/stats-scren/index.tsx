import React, { useEffect } from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import styled from 'styled-components';
import { SafeView, CardView, Title, Info, Bold, Italic } from '../../components/shared';
import { GlobalActions } from '../../redux/globalRedux';
import { State, Global, Profile } from '../../types';
import { Colors, Metrics, Fonts } from '../../themes';

const selectGlobalCounters = createSelector<State, Global, any>(
  state => state.global,
  ({ newest, fetching }) => ({
    fetching,
    confirmed: newest ? newest.confirmed : -1,
    confirmed_delta: newest ? newest.confirmed_delta : -1,
    deaths: newest ? newest.deaths : -1,
    deaths_delta: newest ? newest.deaths_delta : -1,
    recovered: newest ? newest.recovered : -1,
    lastUpdated: newest ? moment(newest.last_update).format('ddd, DD MMM, HH:mm') : '',
  })
);
const selectLocation = createSelector<State, Profile, any>(
  state => state.profile,
  ({ country, province }) => ({
    location: province ? province : country ? country : ''
  })
);

export const StatsScreen = () => {
  const { 
    fetching,
    confirmed,
    confirmed_delta,
    deaths,
    deaths_delta,
    recovered,
    lastUpdated
  } = useSelector(selectGlobalCounters);
  const { location } = useSelector(selectLocation);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(GlobalActions.newestGet());
  }, []);

  const onRefresh = React.useCallback(() => {
    dispatch(GlobalActions.newestGet());
  }, [fetching]);


  return (
    <SafeView wide>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scroll}
      >
        <Title center style={{ paddingVertical: 20 }}>{location}</Title>
        <StatsCard green>
          <Header>Confirmed:</Header>
          {confirmed_delta > 0 && <Label green>+ {(confirmed_delta || 0).toLocaleString()}</Label>}
          <Item color='green'>{(confirmed || 0).toLocaleString()}</Item>
        </StatsCard>
        <StatsCard red>
          <Header>Deaths:</Header>
          {deaths_delta > 0 && <Label red>+ {(deaths_delta || 0).toLocaleString()}</Label>}
          <Item color='red'>{(deaths || 0).toLocaleString()}</Item>
        </StatsCard>
        <StatsCard>
          <Header>Recovered:</Header>
          <Item>{(recovered || 0).toLocaleString()}</Item>
        </StatsCard>
        <Info style={styles.updated}>Last updated: <Bold>{lastUpdated}</Bold></Info>
        <Info center>Source: <Italic>ncov2019.live</Italic></Info>
      </ScrollView>
    </SafeView>
  );
}

const StatsCard = styled(CardView)`
  backgroundColor: ${props => props.red ? Colors.error : props.green ? Colors.success : Colors.primary};
  flexDirection: row;
  flexWrap: wrap;
  alignItems: flex-start;
  justifyContent: space-between;
  marginVertical: 20px;
`;

const Header = styled.Text`
  width: 50%;
  color: ${Colors.whiteText};
  fontSize: ${Fonts.size.h5}
  fontWeight: bold;
  textShadow: 0 1px #22222299;
`;

const Label = styled.Text`
  color: ${Colors.whiteText};
  fontSize: ${Fonts.size.h6};
  fontWeight: bold;
  textAlign: right;
  textShadow: 0 1px #22222299;
  paddingHorizontal: 10px;
  paddingVertical: 5px;
`;

const Item = styled.Text`
  width: 100%;
  color: ${Colors.whiteText};
  fontSize: ${Fonts.size.h4};
  fontWeight: bold;
  textAlign: right;
  textShadow: 0 1px #22222299;
  paddingRight: 10px
`;

const styles = StyleSheet.create({
  scroll: {
    paddingTop: Metrics.statsTop,
  },
  updated: {
    paddingTop: 5,
    alignSelf: 'center'
  }
})

export default StatsScreen;