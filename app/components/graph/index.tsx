import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text, TextInput, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scaleTime, scaleLinear, scaleQuantile } from 'd3-scale';
import moment from 'moment';
import * as shape from 'd3-shape';
import * as path from 'svg-path-properties';
import { Metrics, Colors, Fonts } from '../../themes';
import { EmptyGraph } from './empty';

interface DataPoint {
  date: number;
  value: number;
}

interface GraphProps {
  data: DataPoint[];
  style?: any;
  title?: string;
  color: 'red' | 'blue';
}

const cursorRadius = 10;
const strokeWidth = cursorRadius / 2;
const padding = strokeWidth / 2;
const getDomain = (domain: number[]) => [
  Math.min(...domain),
  Math.max(...domain)
];

const palettes = {
  red: {
    stroke: '#e33977',
    gradient: ['#f9cee3', '#fadded', '#feffff'],
    steps: ['0%', '80%', '100%']
  },
  blue: {
    stroke: '#3977e3',
    gradient: ['#cee3f9', '#ddedfa', '#feffff'],
    steps: ['0%', '80%', '100%']
  } 
}

const width = Metrics.screenWidth;
const height = Metrics.graphHeight - 2;

const Graph = ({ data, style, color, title }: GraphProps) => {
  const cursorRef =useRef(null);
  const labelRef = useRef(null);
  const labelRefX = useRef(null);

  useEffect(() => {
    x.addListener(({ value }) => moveCursor(value));
    moveCursor(0);
  }, [data]);

  const [x] = useState(new Animated.Value(0));

  const allX = data.map(d => d.date);
  const allY = data.map(d => d.value);
  
  const scaleX = scaleTime()
    .domain(getDomain(allX))
    .range([0, width]);

  const minMaxY =  getDomain(allY);  
  const scaleY = scaleLinear()
    .domain(minMaxY)
    .range([height - padding, padding]);
    
  const scaleLabel = scaleQuantile()
    .domain(allY)
    .range(allY.sort((a, b) => a-b));
  
  const line = shape
    .line<DataPoint>()
    .x(p => scaleX(p.date))
    .y(p => scaleY(p.value))
    .curve(shape.curveBasis)(data) as string;

  const properties = line ? path.svgPathProperties(line) : null;
  const lineLength = line? properties.getTotalLength() : 0;
    
  const maxValue = minMaxY[1];
  const labelWidth = (maxValue / 100000 > 1) ? 
    80 : (maxValue / 10000 > 1) ? 
    70 : (maxValue / 1000 > 1) ? 
    60 : 50;

  const palette = palettes[color];

  const moveCursor = (value) => {
    const { x, y } = properties.getPointAtLength(lineLength - value);    
    cursorRef && cursorRef.current && cursorRef.current.setNativeProps({ top: y - cursorRadius, left: x - cursorRadius });
    const label = scaleLabel(scaleY.invert(y));
    const labelX = scaleX.invert(x);
    labelRef && labelRef.current && labelRef.current.setNativeProps({ text: `${label.toLocaleString()}` });
    labelRefX && labelRefX.current && labelRefX.current.setNativeProps({ text: `${moment(labelX).format('DD MMM')}` });
  }

  const positionX = {
    transform: [{
      translateX: x.interpolate({
        inputRange: [0, lineLength],
        outputRange: [width - 55, 0],
        extrapolate: 'clamp',
      })
    }]
  };

  const position= {
    transform: [
      {
        translateX: x.interpolate({
          inputRange: [0, lineLength],
          outputRange: [width - labelWidth, 3],
          extrapolate: 'clamp',
        })
      },
      {
        translateY: x.interpolate({
          inputRange: [0, lineLength],
          outputRange: [-height -25, -40],
          extrapolate: 'clamp',
        })
      }
    ]
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.subtitle}>{line ? title : 'No Data Yet'}</Text>
      <Svg {...{ width, height }}>
        <Defs>
          <LinearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="gradient">
            {palette.steps.map((step, index) => (
              <Stop key={index} offset={step} stopColor={palette.gradient[index]} />  
            ))}
          </LinearGradient>
        </Defs>
        <Path d={line} fill="transparent" stroke={palette.stroke} strokeWidth={strokeWidth} />
        <Path d={`${line} L ${width} ${height} L 0 ${height}`} fill="url(#gradient)" />
      </Svg>
      <View ref={cursorRef} style={[styles.cursor, {borderColor: palette.stroke}]} />
      <Animated.View style={[styles.label, position]}>
        <TextInput ref={labelRef} style={styles.labelText} />
      </Animated.View>     
      <Animated.View style={[styles.labelX, positionX]}>
        <TextInput ref={labelRefX} style={styles.labelTextX} />
      </Animated.View>     
      <Animated.ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ width: lineLength * 2 }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { x },
              },
            },
          ],
          { useNativeDriver: true },
        )}
        horizontal
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    maxHeight: height + 55,
    minHeight: height + 55,
    width,
    backgroundColor: 'white',
    paddingTop: 35,
  },
  virus: {
    top: height / (Metrics.isIphoneX() ? 10 : 20), 
    left: width / 8.5,  
    width: (Metrics.isIphoneX() ? 120 : 100), 
    height: (Metrics.isIphoneX() ? 120 : 100)
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: Fonts.size.h6,
    color: Colors.text,
    paddingTop: 10,
    paddingLeft: 10,
    position: 'absolute',
  },
  cursor: {
    position: 'absolute',
    marginTop: 35,
    width: cursorRadius * 2,
    height: cursorRadius * 2,
    borderRadius: cursorRadius,
    borderWidth: 3,
    backgroundColor: 'white',
  },
  label: {
    backgroundColor: '#3977e3',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 3 : 0,
    marginRight: 15,
    borderRadius: 12, 
    alignItems: 'flex-end',
  },
  labelX: {
    flex: 0,
    position: 'absolute',
    bottom: 3,
    width: 55,
    alignItems: 'center',
  },
  labelText: {
    fontSize: Fonts.size.medium,
    fontWeight: 'bold',
    color: Colors.whiteText
  },
  labelTextX: {
    fontSize: Fonts.size.medium,
    color: '#222',
  }
});

export { Graph, EmptyGraph };
