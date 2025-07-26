import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

import { Shadow } from 'react-native-shadow-2';

// Add prop type for scoreColor
interface RectangleGaugeProps {
  value?: number;
  maxValue?: number;
  width?: number;
  height?: number;
  barHeight?: number;
  barRadius?: number;
  backgroundColor?: string;
  fillColor?: string;
  animationDuration?: number;
  scoreColor?: string;
}

const RectangleGauge = ({
  value = 0,
  maxValue = 100,
  width = 170,
  height = 100,
  barHeight = 32,
  barRadius = 4,
  backgroundColor = 'rgba(255,255,255,0.3)',
  fillColor = '#00FF64',
  animationDuration = 800,
  scoreColor = '#00FF64',
}: RectangleGaugeProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const listener = animatedValue.addListener(({ value: v }) => setDisplayValue(v));
    return () => animatedValue.removeListener(listener);
  }, [value, animationDuration]);

  const percentage = Math.max(0, Math.min(displayValue / maxValue, 1));
  const fillWidth = percentage * (width - 32);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Value above bar */}
        <Text
          x={width / 2}
          y={24}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={50}
          fontWeight="400"
          fontFamily="Inter"
          fill={scoreColor}
        >
          {Math.round(value)}
        </Text>
        {/* Background bar */}
        <Rect
          x={16}
          y={height / 2 + 6}
          width={width - 32}
          height={barHeight}
          rx={barRadius}
          fill={backgroundColor}
          opacity={0.38}
          stroke="rgba(0,0,0,0.5)"
          strokeWidth={3}
        />
        <Rect
          x={153}
          y={height / 2 + 16.5}
          width={10}
          height={12}
          rx={barRadius - 1}
          fill={backgroundColor}
          opacity={0.2}
        />
        

        {/* Filled bar */}

          <Rect
            x={16}
            y={height / 2 + 6}
            width={fillWidth}
            height={barHeight}
            rx={barRadius}
            fill={fillColor}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={3}
          />

          <Rect
            x={17}
            y={height / 2 + 8}
            width={fillWidth - 3}
            height={barHeight - 3}
            rx={barRadius}
            fill="rgba(255,255,255,0.0)"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth={3}
          />

      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default RectangleGauge;