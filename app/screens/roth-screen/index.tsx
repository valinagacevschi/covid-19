import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { KeyboardAvoidingView, Keyboard, ViewStyle, StyleSheet, Platform } from 'react-native';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import { Button } from '../../components/button';
import {
  SafeView, CardView, Title, Bold, ButtonBar, Summary
} from '../../components/shared';
import { SymptomsActions } from '../../redux/symptomsRedux';
import { Fonts, Metrics, Colors } from '../../themes';
import { FinishProps } from './types';

const summaries = {
  good: 'You can repeat the test tomorrow as usual.',
  yellow: 'Please repeat the symptoms check tomorrow.',
  red: 'Please repeat the symptoms check again within the next 6 hours.',
  bad: 'Your scores are now sent to the hospital and a desiganted doctor will review the results during working hours. If more unwell at anytime, please call 111.',
}

const RothScreen = (props: NavigationStackScreenProps) => {
  const { navigation } = props;
  const symptomsScore = navigation.getParam('symptomsScore') || 0;
  const [firstScore, setFirstScore] = useState();
  const [lastScore, setLastScore] = useState();
  const [score, setScore] = useState();
  const [end, setEnd] = useState();
  const [stack, setStack] = useState('stack');
  const [summaryKey, setSummaryKey] = useState();
  const dispatch = useDispatch();
  const cardStack = useRef<any>();
  
  useEffect(() => {
    if (end) {
      setEnd(false);
      let summaryKey = null;
      let score = Math.min(firstScore, lastScore);
      setScore(score);
      if (score >= 15 && symptomsScore < 10) {
        summaryKey ='good';
      } else if (score < 15 || symptomsScore > 200) {
        summaryKey ='bad';
      } else if (symptomsScore > 100) {
        summaryKey ='red';
      } else {
        summaryKey ='yellow';
      }
      setSummaryKey(summaryKey);
      const summary = summaries[summaryKey];
      dispatch(SymptomsActions.testReply({ symptomsScore, firstScore, lastScore, summary }));
    }
  }, [end]);

  const goBack = () => {
    if (symptomsScore > 0) {
      navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'main'})],
      }));
    } else {
      navigation.goBack();
    }
  }

  const reset = () => {
    setStack(`${Math.random() * 100}`);
    setScore(null);
    setFirstScore(null);
    setLastScore(null);
    setSummaryKey(null);
    cardStack.current.initDeck();
  }

  const moveNext = (value) => {
    Keyboard.dismiss();
    setFirstScore(value);
    cardStack.current.swipeLeft();
  }

  const moveLast = (value) => {
    // Keyboard.dismiss();
    setLastScore(value);
    cardStack.current.swipeLeft();
  }

  const renderNoMoreCards = useCallback(() => (
    <Finish
      score={score}
      summaryKey={summaryKey}
      symptomsScore={symptomsScore}
      onPress={reset}
      onCancel={goBack}
    />
  ), [summaryKey]);

  console.log('rendering RothScreen', firstScore, lastScore, score, end, summaryKey);
  return (
    <SafeView onStartShouldSetResponder={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'} 
        enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0 }
      >
        <CardStack
          ref={cardStack}
          key={stack}
          style={styles.cardStack} 
          secondCardZoom={0.65}
          verticalSwipe={false}
          disableBottomSwipe
          disableLeftSwipe
          disableRightSwipe
          disableTopSwipe
          outputRotationRange={['-0deg', '0deg', '0deg']}
          renderNoMoreCards={renderNoMoreCards}
          onSwipedAll={() => setEnd(true)}
        >
          <Card style={styles.card}>
            <Title center>Step 1</Title>
            <Summary>
              Take a deep breath and <Bold>count loudly from 1 to 30 </Bold> 
              as fast as possible. Record the <Bold>highest number </Bold> 
              reached in a single breath here.
            </Summary>
            <InputButton key={'i1'} label={`Next Step`} onPress={moveNext}/>
          </Card>
          <Card style={styles.card}>
            <Title center>Step 2</Title>
            <Summary>
              Recover your breath and walk 30 steps around the room and them tap <Bold>Next Step</Bold>.
            </Summary>
            <Button text={`Next Step`} onPress={() => cardStack.current.swipeLeft()} />
          </Card>
          <Card style={styles.card}>
            <Title center>Step 3</Title>
            <Summary>
              Take another deep breath and <Bold>count loudly from 1 to 30 </Bold> 
              as fast as possible. Record the <Bold>highest number </Bold> 
              reached in a single breath here.
            </Summary>
            <InputButton key={'i2'} label={`Send Scores`} onPress={moveLast}/>
          </Card>
        </CardStack>
      </KeyboardAvoidingView>
    </SafeView>
  );
}

interface InputButton {
  label: string;
  onPress: (value: number) => void;
}

const InputButton = (props: InputButton) => {
  const [score, setScore] = useState();
  return (
    <>
      <Input 
        value={score}
        onChangeText={setScore}
        autoFocus={true}
        placeholder={'highest number'}
        returnKeyType={'next'}
        keyboardType={'numeric'}
      />
      <Button text={props.label} disabled={!score} onPress={() => props.onPress(score)} />
    </>
  );
}

const Finish = (props: FinishProps) => {
  const { score, symptomsScore, summaryKey } = props;
  const title = (score < 15 || symptomsScore > 10) ? 'Not Great!' : 'Well done!';
  let emo = null;
  if (score >= 15) {
    if (symptomsScore > 200) {
      emo = '😷';
    } else if (symptomsScore > 100) {
      emo = '🤒';
    } else if (symptomsScore > 10) {
      emo = '😐';
    } else {
      emo = '😀';
    }
  } else {
    if (symptomsScore > 10) {
      emo = '😷';
    } else {
      emo = '🤧';
    }
  }

  return (
    <CardView>
      <Title center>{title} {emo}</Title>
      <Summary center>
        You score <Bold>{score}</Bold> at your last <Bold>Roth Test</Bold>. 
        {` ${summaries[summaryKey]}`}
      </Summary>
      <ButtonBar>
        <Button text={'Retake Test'} onPress={props.onPress} />
        <Button text={'Not now'} type={'error'} onPress={props.onCancel} />
      </ButtonBar>
    </CardView>
  );
}

export { RothScreen };
export default RothScreen;

const Input = styled.TextInput`
  fontSize: ${Fonts.size.h5};
  border: 1px solid #55555555;
  borderRadius: 40;
  paddingHorizontal: 15;
  paddingVertical: 6;
  width: ${188};
  marginBottom: 15;
  alignSelf: center;
`;

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
