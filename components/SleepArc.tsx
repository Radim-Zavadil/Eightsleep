import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, G, Line, Text, Rect } from 'react-native-svg';

const ArcGauge = ({
  value = 0, 
  maxValue = 100, 
  color = '#FFFFFF',
  arcBackgroundColor = '#FFFFFF',
  width = 300,
  height = 180,
  animationDuration = 1000, // Animation duration in ms
}) => {
  // Animation value for slider position only
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [sliderPosition, setSliderPosition] = useState(0);
  
  // Start animation when value changes
  useEffect(() => {
    // Reset animation if value drops to 0
    if (value === 0) {
      animatedValue.setValue(0);
      setSliderPosition(0);
    } else {
      // Animate to the new value
      Animated.timing(animatedValue, {
        toValue: value,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false, // Required for non-transform/opacity animations
      }).start();
    }
    
    // Update only the slider position during animation
    const animationListener = animatedValue.addListener(({ value: animValue }) => {
      setSliderPosition(animValue);
    });
    
    // Cleanup listener on unmount
    return () => {
      animatedValue.removeListener(animationListener);
    };
  }, [value, animationDuration]);
  
  // SVG dimensions
  const strokeWidth = 16;
  const radius = (height * 0.85) - strokeWidth;
  const centerX = width / 2;
  const centerY = height - 20;
  
  // Arc settings
  const startAngle = 180; // in degrees (left side)
  const endAngle = 0; // in degrees (right side)
  const sweepAngle = 180; // total angle of the arc
  
  // Generate tickmarks inside the arc
  const numTicks = 15;
  const ticks = [];
  
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = startAngle - (i / numTicks) * sweepAngle;
    const tickRad = (tickAngle * Math.PI) / 180;
    
    // Position ticks INSIDE the arc
    const outerTickRadius = radius - (strokeWidth / 100); // Just inside the arc
    const innerTickRadius = radius - (strokeWidth * 0.5); // Extend inside
    
    const outerX = centerX + outerTickRadius * Math.cos(tickRad);
    const outerY = centerY + outerTickRadius * Math.sin(tickRad);
    const innerX = centerX + innerTickRadius * Math.cos(tickRad);
    const innerY = centerY + innerTickRadius * Math.sin(tickRad);
    
    ticks.push(
      <Line
        key={i}
        x1={innerX}
        y1={innerY}
        x2={outerX}
        y2={outerY}
        stroke="grey"
        strokeWidth={1.5}
      />
    );
  }
  
  // Generate the arc path
  const generateArc = (endAngle, startAngle, radius) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  // Background arc path (full arc) - this stays static
  const fullArc = generateArc(endAngle, startAngle, radius);
  
  // Calculate slider position based on animated value
  const percentage = sliderPosition / maxValue;
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 1);
  
  // Calculate slider position - ensure it's exactly on the arc path
  const sliderAngle = startAngle + (normalizedPercentage * sweepAngle);
  const sliderRad = (sliderAngle * Math.PI) / 180;
  const sliderX = centerX + radius * Math.cos(sliderRad);
  const sliderY = centerY + radius * Math.sin(sliderRad);
  
  // Slider dimensions
  const sliderWidth = 6;
  const sliderHeight = 22;
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background arc */}
        <Path
          d={fullArc}
          stroke={arcBackgroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        
        {/* Main arc - static, no animation */}
        <Path
          d={fullArc}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        
        {/* Tick marks inside the arc */}
        <G>{ticks}</G>
        
        {/* Slider indicator (black border) */}
        <Rect
          x={sliderX - (sliderWidth/2 + 1)}
          y={sliderY - (sliderHeight/2 + 1)}
          width={sliderWidth + 2}
          height={sliderHeight + 2}
          fill="black"
          rx={4}
          ry={4}
          rotation={(sliderAngle + 90)}
          originX={sliderX}
          originY={sliderY}
        />
        
        {/* White slider */}
        <Rect
          x={sliderX - sliderWidth/2}
          y={sliderY - sliderHeight/2}
          width={sliderWidth}
          height={sliderHeight}
          fill="white"
          rx={3}
          ry={3}
          rotation={(sliderAngle + 90)}
          originX={sliderX}
          originY={sliderY}
        />
        
        {/* Display actual value */}
        <Text
          x={centerX}
          y={centerY - radius/4}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={color}
          fontSize={50}
          fontWeight="400"
          fontFamily="Inter"
        >
          {value}
        </Text>
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

export default ArcGauge;