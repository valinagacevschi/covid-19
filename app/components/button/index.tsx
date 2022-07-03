import * as React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle, TouchableOpacityProps, Platform } from 'react-native';
import { Colors, Metrics, Fonts } from '../../themes';

export type ButtonType = 'primary' | 'success' | 'warning' | 'error';

export interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  full?: boolean;
  type?: ButtonType;
  color?: string;
}

interface Styles { viewStyle: ViewStyle, textStyle: TextStyle }

export const Button = (props: ButtonProps) => {
  const {
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    full,
    type,
    color,
    disabled,
    ...rest
  } = props;

  const backgroundColor = disabled ? '#99999933' : color ? color : Colors[type || 'primary'];

  const styles = StyleSheet.create<Styles>({
    viewStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      paddingVertical: Platform.OS === 'ios' ? 10 : 5, 
      paddingHorizontal: Metrics.button.paddingHorizontal, 
      marginVertical: 6,
      marginHorizontal: 7,
      minWidth: full ? Metrics.screenWidth - 80 : '45%',
      backgroundColor,
      borderRadius: 40, 
      shadowColor: Colors.shadow,
      shadowOpacity: 1,
      shadowOffset: {
        width: 0,
        height: 1
      },
      ...styleOverride
    },
    textStyle: { color: disabled ? Colors.grey : Colors.whiteText, fontSize: Fonts.size.button, ...textStyleOverride }
  });

  return (
    <TouchableOpacity style={styles.viewStyle} disabled={disabled} {...rest}>
      <Text style={styles.textStyle}>{text}</Text>
    </TouchableOpacity>
  );
}
