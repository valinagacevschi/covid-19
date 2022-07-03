import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Metrics } from '../themes';

export type TabBarIconProps = {
  tintColor?: string;
  focused: boolean;
};

export interface IconProps extends TabBarIconProps {
  name: string;
}

export const iconTab = (props: IconProps) => {
  const { name, tintColor, focused } = props;
  return (
    <FontAwesome
      name={name || 'ellipsis-h'}
      color={tintColor}
      size={focused ? Metrics.icons.medium : Metrics.icons.small}
      style={{ marginTop: Metrics.icons.marginTop }} 
    />
  )
};

export default iconTab;