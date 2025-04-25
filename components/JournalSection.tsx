import React from 'react'

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as d3Shape from 'd3-shape';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { ChevronRight } from 'react-native-feather';

const { width } = Dimensions.get('window');

export default function JournalSection() {

    //STRESS RHYTHM CODE
  const height = 100;

  // Main half-circle-like curve
  const curvePath = `
    M 0 ${height}
    C ${width * 0.25} 20, ${width * 0.75} 20, ${width} ${height}
  `;

  // Stressed guideline (dotted)
  const guidelinePath = `
    M 0 ${height - 30}
    C ${width * 0.25} 2, ${width * 0.75} 2, ${width} ${height - 30}
  `;

  const times = ['5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'];
  const timePositions = [0, 0.14, 0.28, 0.42, 0.56, 0.70, 0.84, 0.98];

  const indicatorPosition = 0.5;

  // Utility to get x, y along a cubic Bézier
  const getCurvePoint = (t, p0, p1, p2, p3) => {
    const x = Math.pow(1 - t, 3) * p0.x +
              3 * Math.pow(1 - t, 2) * t * p1.x +
              3 * (1 - t) * Math.pow(t, 2) * p2.x +
              Math.pow(t, 3) * p3.x;

    const y = Math.pow(1 - t, 3) * p0.y +
              3 * Math.pow(1 - t, 2) * t * p1.y +
              3 * (1 - t) * Math.pow(t, 2) * p2.y +
              Math.pow(t, 3) * p3.y;

    return { x, y };
  };

  const p0 = { x: 0, y: height };
  const p1 = { x: width * 0.25, y: 20 };
  const p2 = { x: width * 0.75, y: 20 };
  const p3 = { x: width, y: height };

  const indicatorPoint = getCurvePoint(indicatorPosition, p0, p1, p2, p3);

  // Stressed label position (around 90% along the guideline)
  const stressedLabelPos = getCurvePoint(0.88, 
    { x: 0, y: height - 50 },
    { x: width * 0.25, y: 10 },
    { x: width * 0.75, y: 10 },
    { x: width, y: height - 50 }
  );

  return (
    <View style={{
        backgroundColor: '#000',
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        position: 'relative',
        marginTop: 5
      }}>
        {/* Background images */}
        <Image
          source={require('../assets/images/white-blur.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            zIndex: -1
          }}
        />

        <Text style={{
          color: '#fff',
          fontSize: 12,
          marginTop: 20,
          opacity: 0.7,
          fontFamily: "Inter"
        }}>STRESS RHYTHM</Text>

        <Text style={{
          color: '#fff',
          fontSize: 50,
          marginVertical: 5
        }}>82</Text>

        <Svg height={height} width={width} style={{ marginTop: 0 }}>
          {/* Stressed Guideline */}
          <Path
            d={guidelinePath}
            stroke="#aaa"
            strokeDasharray="4,4"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Stressed label */}
          <SvgText
            x={stressedLabelPos.x - 30}
            y={stressedLabelPos.y - 12}
            fontSize="12"
            fill="#aaa"
            fontFamily="Inter"
          >
            Stressed
          </SvgText>

          {/* Main Curve */}
          <Path
            d={curvePath}
            stroke="#fff"
            strokeWidth="3"
            fill="none"
          />

          {/* Moving Circle */}
          <Circle
            cx={indicatorPoint.x}
            cy={indicatorPoint.y}
            r="7"
            fill="#fff"
          />

          {/* Time Labels along curve */}
          {timePositions.map((pos, index) => {
            const { x, y } = getCurvePoint(pos, p0, p1, p2, p3);
            return (
              <SvgText
                key={index}
                x={x}
                y={y + 19.2}
                fontSize="12"
                fill="#aaa"
                textAnchor="middle"
                fontFamily='Inter'
              >
                {times[index]}
              </SvgText>
            );
          })}
        </Svg>

        <Text style={{
          color: '#fff',
          fontSize: 16,
          marginBottom: 10
        }}>
          Stress Intolerant Zone
        </Text>
      </View>
  )
}