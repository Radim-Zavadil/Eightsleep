import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const HalfCircleProgress = ({ progress = 84 }) => {
  const radius = 150;
  const strokeWidth = 20;
  const center = radius + strokeWidth;
  const circumference = Math.PI * radius;
  const fillPercent = Math.max(0, Math.min(progress, 100));
  const strokeDashoffset = circumference * (1 - fillPercent / 100);

  return (
    <View style={styles.container}>
      <Svg width={center * 2} height={center + strokeWidth}>
        {/* Background Arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#15241F"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={0}
        />

        {/* Foreground Arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default HalfCircleProgress;
