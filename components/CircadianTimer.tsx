import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, Dimensions } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { ChevronRight } from 'react-native-feather';

const { width } = Dimensions.get('window');
const size = width * 0.8;
const arcWidth = 6;
const outerStroke = 2;
const radius = (size - arcWidth - outerStroke * 2) / 2;
const center = size / 2;

const CircadianRhythm = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev + 1) % 43200); // 12-hour cycle
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const percentage = seconds / 43200;
  const endAngle = percentage * 2 * Math.PI;

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => n.toString().padStart(2, '0');

  const hourMarkers = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * 2 * Math.PI - Math.PI / 2;
    const isFullHour = i % 2 === 0;
    const len = isFullHour ? 10 : 5;
    const color = isFullHour ? '#fff' : '#666';

    const x1 = center + (radius - 5) * Math.cos(angle);
    const y1 = center + (radius - 5) * Math.sin(angle);
    const x2 = center + (radius - 5 - len) * Math.cos(angle);
    const y2 = center + (radius - 5 - len) * Math.sin(angle);

    hourMarkers.push(
      <Line
        key={`tick-${i}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
      />
    );
  }

  const labelMap = {
    6: '6:00AM',
    12: '12:00PM',
    18: '6:00PM',
    0: '12:00AM',
  };

  const labels = Object.entries(labelMap).map(([hour, label]) => {
    const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
    const x = center + (radius - 25) * Math.cos(angle);
    const y = center + (radius - 25) * Math.sin(angle) + 5;

    const rotate = (label === '6:00AM' || label === '6:00PM') ? -90 : 0;

    return (
      <SvgText
        key={`label-${hour}`}
        x={x}
        y={y}
        fill="#888"
        fontSize="10"
        fontWeight="400"
        fontFamily='Inter'
        textAnchor="middle"
        transform={`rotate(${rotate}, ${x}, ${y})`}
      >
        {label}
      </SvgText>
    );
  });

  const arc = d3Shape.arc()
    .innerRadius(radius - arcWidth / 2)
    .outerRadius(radius + arcWidth / 2)
    .startAngle(0)
    .endAngle(endAngle)();

  return (
    <View
      style={{
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        marginTop: 5,
      }}
    >
      <ImageBackground
        source={require('../assets/images/purple-blur.png')}
        style={{
          width: '100%',
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}
        imageStyle={{
          resizeMode: 'cover',
        }}
      >
        <View style={{ margin: 0, padding: 0 }}>

          {/* Badge with Arrow */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-between",
            
          }}>
            <View 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 20,
              }}
            >
              <Text 
                style={{
                color: '#FFFFFF',
                fontSize: 10,
                letterSpacing: 1,
                fontWeight: '500',
                fontFamily: "Inter",
                opacity: 0.9
                }}
              >
                CIRCADIAN RHYTHM
              </Text>
            </View>
            <ChevronRight width={20} height={20} stroke="#54504D" strokeWidth={3} />
          </View>

          {/* Circadian Timer */}
          <View style={{
            alignSelf: 'center',
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Svg width={size} height={size}>
              <Circle
                cx={center}
                cy={center}
                r={radius + arcWidth / 2}
                stroke="#666"
                strokeWidth={outerStroke}
                fill="#1A1823"
                opacity={0.3}
              />

              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#373540"
                strokeWidth={arcWidth}
                fill="none"
              />

              {/* Progress Arc Line */}
              <Path
                d={arc}
                fill="none"
                stroke="#654DDD"
                strokeWidth={arcWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${center}, ${center})`}
              />

              {hourMarkers}
              {labels}
            </Svg>

            <View style={{
              position: 'absolute',
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 20,
                color: '#aaa',
                marginBottom: 4,
              }}>
                ends in
              </Text>
              <Text style={{
                fontFamily: "Inter",
                fontSize: 42,
                color: '#654DDD',
              }}>
                {`${pad(hrs)}:${pad(mins)}:${pad(secs)}`}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={{ marginTop: 25, paddingHorizontal: 20, marginBottom: 30 }}>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter",
              color: '#fff',
              textAlign: 'center',
              marginBottom: 6,
            }}>
              Start winding down
            </Text>
            <Text style={{
              fontSize: 13,
              fontFamily: "Inter",
              color: '#888',
              textAlign: 'center',
              lineHeight: 18,
            }}>
              Avoiding exercise, food and bright light during this{" "}
              window is beneficial as these lead to delay in your wake{" "}
              up time and your energy cycles during the day.
            </Text>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
};

export default CircadianRhythm;
