import * as React from 'react';
import { TouchableOpacity, ViewStyle, TouchableOpacityProps } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Metrics } from '../../themes';

export interface IconButtonProps extends TouchableOpacityProps {
  name?: string;
  color?: string;
  size?: number;
  style?: ViewStyle | ViewStyle[];
}
const BUTTON_SIZE = 50;

export const IconButton = (props: IconButtonProps) => {
  const {
    name,
    color,
    size,
    style: styleOverride,
    ...rest
  } = props;

  const viewStyle: ViewStyle = {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    shadowOffset:{  width: 0,  height: 1, },
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    borderRadius: BUTTON_SIZE/2,
  };

  const md = (name || 'md-square').startsWith('md-');
  
  const attributes = {
    name: ((md ? name.replace('md-', '') : name) || 'md-square'),
    color: (color || Colors.coal),
    size: (size || BUTTON_SIZE/1.75),
  }  
  return (
    <TouchableOpacity style={[viewStyle, styleOverride]} {...rest}>
      {md ? (
        <MaterialCommunityIcons {...attributes}/>
      ) : (
        <FontAwesome {...attributes} />
      )}
    </TouchableOpacity>
  );
}

export const middalePosition = (Metrics.screenWidth - BUTTON_SIZE)/2;