import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import { FlatList, View } from 'react-native';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { Colors, Fonts } from '../../themes';
import { createSelector } from 'reselect';
import { SafeView, CardView, Title, H3 } from '../../components/shared';
import moment from 'moment';
import { SymptomsActions } from '../../redux/symptomsRedux';
import { State, Symptoms } from '../../types';
import { Button } from '../../components/button';

const selectSymptoms = createSelector<State, Symptoms, any>(
  state => state.symptoms,
  ({ logs, fetching }) => ({
    logs: logs || [],
    fetching 
  })
)

export const ResultsScreen = (props: NavigationStackScreenProps) => {
  const { navigation } = props;
  const { logs, fetching } = useSelector(selectSymptoms, shallowEqual);
  const dispatch = useDispatch();
  
  console.log('rendering ResultsScreen');
  return (
    <SafeView wide>
      <FlatList
        contentContainerStyle={{ alignSelf: 'stretch', marginTop: 10, borderColor: 'red', borderWidth: 0 }}
        data={logs}
        keyExtractor={({ id }) => `${id}`}
        renderItem={({ item }) => <Item item={item}/>}
        refreshing={!!fetching}
        onRefresh={() => dispatch(SymptomsActions.symptomLogsGet())}
        ListEmptyComponent={(
        <>
          <View style={{marginTop: 40 }} />
          <CardView>
            <Title center>No Scores Yet!</Title>
            <H3 center>
              Check your symptoms and you'll see the progress of the results here.
            </H3>
            <Button 
              text={'Check Symptoms'} 
              style={{ marginTop: 15, paddingHorizontal: 40 }} 
              onPress={() => navigation.navigate('main_symptoms', { reset: true })} />
          </CardView>
        </>
        )}
      />
    </SafeView>
  );
}

const Item = ({ item }) => {
  const { result, created_at } = item;
  const color = result > 100 ? Colors.error : (result > 10 ? Colors.warning : Colors.success);
  const title = result > 100 ? 'Severe symptoms' : (result > 10 ? 'Mild symptoms' : 'Normal symptoms');
  const severe = ~~(result / 100);
  const mild = ~~((result - 100 * severe) / 10)
  const normal = result - 100 * severe - 10 * mild;

  return (
    <ScoreBar>
      <Score color={color}>
        <Number>{result}</Number>
      </Score>
      <Heading>
        {`${moment(created_at).format('ddd, D MMM HH:mm')}`} - {title}
      </Heading>
      <Info>{`${severe === 0 ? 'No' : severe} severe, ${mild === 0 ? 'no' : mild} mild and ${normal} normal symptoms`}</Info>
    </ScoreBar>
  );
};

export default ResultsScreen;

const ScoreBar = styled.View`
  minHeight: 60;
  paddingVertical: 15;
  paddingLeft: 70;
  paddingRight: 15;
  borderColor: #d0d0d0aa;
  borderBottomWidth: 0.8;
  backgroundColor: #fff;
`;

const Score = styled.View`
  position: absolute;
  left: 10;
  top: 50%;
  marginTop: -10;
  justifyContent: center;
  alignItems: center;
  width: 45;
  height: 45;
  borderRadius: 25;
  backgroundColor: ${props => props.color || Colors.error};
  boxShadow: 0px 1px 0 #22222277;
`;

const Number = styled.Text`
  fontSize: ${Fonts.size.h6};
  color: #fff;
  boxShadow: 0 1px 0 #22222299;
`;

const Heading = styled.Text`
  color: ${Colors.text};
  fontSize: ${Fonts.size.heading};
  boxShadow: 0 1px 0 #22222255;
  paddingVertical: 5;
`;

const Info = styled.Text`
  color: ${Colors.text};
  fontSize: ${Fonts.size.medium}
  boxShadow: 0 0.8px 0 #22222255;
`;
