import * as React from 'react';
import { Image, ViewStyle, TouchableOpacityProps } from 'react-native';
import styled from 'styled-components';
import { Metrics, Fonts } from '../../themes';
import { Platform } from '@unimodules/core';

export interface SquareBoxProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
  type: 'death' | 'confirmed' | 'recovered';
  value: number;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
}

const types = {
  death: {
    color: '#c81913',
    image: require('./img/death.png')
  },
  confirmed: {
    color: '#00d43d',
    image: require('./img/virus.png')
  },
  recovered: {
    color: '#EF425C', // '#4477ED',
    image: require('./img/heart-red.png')
  }
}

export const SquareBox = (props: SquareBoxProps) => {
  const { title, subtitle, type, value, onPress } = props;
  return (
    <FullBox activeOpacity={0.65} onPress={onPress}>
      <Title>{title}</Title>
      <Image
        source={types[type].image}
        resizeMode={'contain'}
        style={{ width: Metrics.images.small, height: Metrics.images.small }}
      />
      <Number color={types[type].color}>
        {value === -1 ? ' ' : (value || 0).toLocaleString()}
      </Number>
      <SubTitle>{subtitle}</SubTitle>
    </FullBox>
  );
}

const FullBox = styled.TouchableOpacity`
  flex: 1;
  backgroundColor: white;
  marginHorizontal: 10px;
  borderRadius: 10px;
  alignItems: center;
  boxShadow: 0px 1px 2px #99999955;
  minHeight: ${Metrics.box.minHeight};
  maxHeight: ${Metrics.box.maxHeight};
`;

const Title = styled.Text`
  textAlign: center;
  fontSize: ${Fonts.size.medium};
  fontWeight: bold;
  paddingTop: ${Platform.OS === 'ios' ? 10 : 5};
  paddingBottom: 5px;
`;

const Number = styled.Text`
  textAlign: center;
  fontSize: ${Fonts.size.h4};
  fontWeight: bold;
  paddingVertical: ${Platform.OS === 'ios' ? 3 : 0};
  color: ${props => props.color}
`;

const SubTitle = styled.Text`
  textAlign: center;
  fontSize: ${Fonts.size.regular};;
  paddingBottom: 5px;
`;
