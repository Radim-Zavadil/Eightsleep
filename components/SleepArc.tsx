import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Line, Text, Rect } from 'react-native-svg';

const ArcGauge = ({ 
  value = 100, 
  maxValue = 100, 
  color = '#FFFFFF',
  arcBackgroundColor = '#FFFFFF',
  width = 300,
  height = 180,
}) => {
  // Normalize the value to a percentage (0-1 range)
  const percentage = Math.min(Math.max(value / maxValue, 0), 1);
  
  // SVG dimensions
  const strokeWidth = 16;
  const radius = (height * 0.85) - strokeWidth;
  const centerX = width / 2;
  const centerY = height - 20;
  
  // Arc settings
  const startAngle = 180; // in degrees (left side)
  const endAngle = 0; // in degrees (right side)
  const sweepAngle = 180; // total angle of the arc
  
  // Generate tickmarks - more of them to cover the whole arc
  const numTicks = 15; // Increased number of ticks
  const ticks = [];
  
  for (let i = 0; i <= numTicks; i++) {
    const tickAngle = startAngle - (i / numTicks) * sweepAngle;
    const tickRad = (tickAngle * Math.PI) / 80;
    
    // Calculate tick position OUTSIDE the arc (radius + half of strokeWidth + some margin)
    const tickRadius = radius + (strokeWidth / 2) + 1; // 2px extra margin
    const tickX = centerX + tickRadius * Math.cos(tickRad);
    const tickY = centerY + tickRadius * Math.sin(tickRad);
    
    // For 90° rotated ticks, we change the direction to be along the arc rather than perpendicular
    // This is achieved by using the tangent angle (tickAngle + 90) instead of perpendicular angle
    const tickRotationAngle = tickAngle + 40; // Original angle + 0 for tangent direction
    const tickRotationRad = (tickRotationAngle * Math.PI) / 150;
    
    // Make ticks extend outward from the arc
    const tickLength = 15;
    const outerX = tickX + (tickLength/2) * Math.cos(tickRotationRad);
    const outerY = tickY + (tickLength/2) * Math.sin(tickRotationRad);
    const innerX = tickX - (tickLength/2) * Math.cos(tickRotationRad);
    const innerY = tickY - (tickLength/2) * Math.sin(tickRotationRad);
    
    ticks.push(
      <Line
        key={i}
        x1={innerX}
        y1={innerY}
        x2={outerX}
        y2={outerY}
        stroke="grey"
        strokeWidth={2}
        // Rotate line 90 degrees around its center point
        transform={`rotate(90, ${tickX}, ${tickY})`}
      />
    );
  }
  
  // Generate the arc path
  const generateArc = (startAngle, endAngle, radius) => {
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
  
  // Background arc path (empty)
  const emptyArc = generateArc(startAngle, endAngle, radius);
  
  // Filled arc path (based on percentage)
  const filledEndAngle = startAngle - (percentage * sweepAngle);
  const filledArc = generateArc(startAngle, filledEndAngle, radius);

  // Calculate slider position
  const sliderAngle = startAngle - (percentage * sweepAngle);
  const sliderRad = (sliderAngle * Math.PI) / 180;
  const sliderX = centerX + radius * Math.cos(sliderRad);
  const sliderY = centerY + radius * Math.sin(sliderRad);
  
  // Slider dimensions
  const sliderWidth = 6;
  const sliderHeight = 18;
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Empty arc (background) */}
        <Path
          d={emptyArc}
          stroke={arcBackgroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        
        {/* Filled arc (green) */}
        <Path
          d={filledArc}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        
        {/* Tick marks */}
        <G>{ticks}</G>
        
        {/* Slider indicator with black border and rounded corners */}
        {/* Draw black border first (slightly larger) */}
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
        
        {/* White slider on top */}
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
        
        {/* Value text in center */}
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