import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text } from 'react-native-svg';

const GradientText = ({ text, fontSize = 40 }) => {
  return (
    <View style={styles.container}>
      <Svg height={fontSize * 1.2} width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0%" stopColor="#FF6FD8" />
            <Stop offset="100%" stopColor="#3813C2" />
          </LinearGradient>
        </Defs>
        <Text
          fill="url(#grad)"
          fontSize={fontSize}
          fontWeight="bold"
          x="0"
          y={fontSize}
        >
          {text}
        </Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default GradientText;