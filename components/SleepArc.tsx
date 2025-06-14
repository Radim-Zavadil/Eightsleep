import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Rect, Text } from 'react-native-svg';

const RectangleGauge = ({
  value = 0,
  maxValue = 100,
  width = 170,
  height = 100,
  barHeight = 30,
  barRadius = 4,
  backgroundColor = '#222',
  fillColor = '#00FF64',
  animationDuration = 800,
}) => {
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
          fontWeight="500"
          fontFamily="Inter"
          fill="#00FF64"
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
          opacity={0.18}
        />
        {/* Filled bar */}
        <Rect
          x={16}
          y={height / 2 + 6}
          width={fillWidth}
          height={barHeight}
          rx={barRadius}
          fill={fillColor}
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