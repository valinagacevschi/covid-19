import React, { useRef, useCallback, useEffect, useState } from 'react';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { 
  ViewStyle,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import { SymptomsActions } from '../../redux/symptomsRedux';
import { Colors, Metrics } from '../../themes';
import { Button, ButtonType } from '../../components/button';
import { SafeView, CardView, Title, Info, Summary } from '../../components/shared';
import { State, Symptoms, Profile } from '../../types';

const selectSymptoms = createSelector<State, Symptoms, any>(
  state => state.symptoms,
  ({ payload, scores, fetching }) => ({
    symptoms: payload || [], 
    noSymptoms: (payload || []).length === 0,
    scores,
    fetching
  })
)

const selectCode = createSelector<State, Profile, any>(
  state => state.profile,
  ({ code }) => code
)

const BUTTON_TYPES: ButtonType[] = ['success', 'warning', 'error'];

export const SymptomsScreen = (props: NavigationStackScreenProps) => {
  const { navigation } = props;
  const reset = navigation.getParam('reset');
  const { symptoms, scores, noSymptoms, fetching } = useSelector(selectSymptoms, shallowEqual);
  const code = useSelector(selectCode);
  const [end, setEnd] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(-1);
  
  const dispatch = useDispatch();
  const cardStack = useRef<any>();

  useEffect(() => {
    if (reset) {
      setFinalScore(null);
      setEnd(false);
      dispatch(SymptomsActions.symptomsResetScores());
    }
  }, [reset])

  useEffect(() => {
    if (end) {
      setEnd(false);
      Object.values(scores).map((score :number) => setFinalScore(score));
      const scoresList = Object.values(scores);
      const score = scoresList && scoresList[0];
      dispatch(SymptomsActions.summaryReply({ score }));
    }
  }, [scores]);

  const onSetEnd = () => {
    setEnd(true)
  }

  const onPress = useCallback((item, result ) => {
    const { id: symptom_id, summary } = item;
    const severe = (result === 2);
    dispatch(SymptomsActions.symptomReply({ code, symptom_id, severe, result, summary }));
    if (cardStack && cardStack.current) {
      cardStack.current.swipeLeft();
    }
  }, [code]);

  const renderCard = (item) => {
    const { id, info, summary, options } = item;
    const buttons = options && [...options];
    
    return (
      <Card style={styles.card} key={`key_${id}`} >
        <Title center>{summary}</Title>
        <Summary style={{ marginBottom: 15 }}>{info}</Summary>
        {buttons && buttons.map((opt, index) => (
          <Button
            key={`${index}`}
            full
            text={opt}
            type={BUTTON_TYPES[index]}
            onPress={() => onPress(item, index)}
          />
        ))}
      </Card>
    );
  }

  const renderNoMoreCards = () => {
    let title = 'Check Completed! ';
    let info = 'Your have no symptoms. Keep calm and carry on with social distancing.';
    let type: ButtonType = 'error';
    let text = 'Back Home';
    let onPress = () => navigation.goBack();
    
    if (noSymptoms) {
      title = 'No symptoms found!';
      info = 'Please add the code provided by your A&E doctor.'
      type = 'success';
      text = 'Register';
      onPress = () => navigation.navigate('register');
    } else if (finalScore > 10) {
      if (finalScore > 100) {
        title += '🤔';
        info = `Your symptoms require to complete the Roth test now.`;
      } else {
        title += '😐';
        info = `Your symptoms are not yet resolved.${'\n'}Please complete the Roth test now and repeat the symptoms checks in 12 hours.`;
      }
      type = 'primary';
      text = 'Roth Test';
      onPress = () => navigation.navigate('main_test', { symptomsScore: finalScore });
    } else {
      title += '😀';
    }
    return (
      <CardView>
        <Title center>{title}</Title>
        <Info>{info}</Info>
        <Button type={type} text={text} onPress={onPress}
          style={{ marginTop: 25, paddingHorizontal: 35 }} 
        />
      </CardView>
    );
  }

  console.log('rendering SymptomsScreen', reset, scores, noSymptoms);

  return (
    <SafeView>
      {fetching ? (
        <ActivityIndicator size='large' color={Colors.coal} />
      ) : (
        <CardStack
          ref={cardStack} 
          style={styles.cardStack} 
          secondCardZoom={0.65}
          verticalSwipe={false}
          disableBottomSwipe
          disableLeftSwipe
          disableRightSwipe
          disableTopSwipe
          outputRotationRange={['-0deg', '0deg', '0deg']}
          renderNoMoreCards={renderNoMoreCards}
          onSwipedAll={onSetEnd}
        >
          {symptoms.map((item) => renderCard(item))}
        </CardStack>
      )}
    </SafeView>
  );
}

export default SymptomsScreen;

interface Styles { 
  cardStack: ViewStyle; 
  card: ViewStyle 
}
const styles = StyleSheet.create<Styles>({
  cardStack:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteText,
    width: Metrics.screenWidth - 30,
    borderRadius: 15,
    shadowColor: 'rgba(30,30,30,0.5)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity:0.5,
    padding: 20
  },
});
