import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Font from 'expo-font';
import { Link } from 'expo-router';

const CaffeineWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if current time is in a recommended caffeine window
  const isOptimalTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Recommended times: 09:30–11:30, 13:00–14:00
    const morning = totalMinutes >= 9 * 60 + 30 && totalMinutes <= 11 * 60 + 30;
    const afternoon = totalMinutes >= 13 * 60 && totalMinutes <= 14 * 60;

    return morning || afternoon;
  };

  // Get current time formatted as HH:MM:SS
  const getCurrentTimeFormatted = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Get timer color based on time (green at 10 AM, red at 17:00)
  const getTimerColor = (time) => {
    const hours = time.getHours();
    
    if (hours <= 10) {
      return '#00FF64';
    } else {
      const ratio = Math.min((hours - 10) / 7, 1);
      const r = Math.round(0 * (1 - ratio) + 226 * ratio);
      const g = Math.round(255 * (1 - ratio) + 112 * ratio);
      const b = Math.round(100 * (1 - ratio) + 110 * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  const optimal = isOptimalTime(currentTime);
  const currentTimeFormatted = getCurrentTimeFormatted(currentTime);
  const timerColor = getTimerColor(currentTime);

  return (
    <Link href='caffeineChart' asChild>
      <View
        style={{
          height: 62,
          backgroundColor: 'black',
          borderWidth: 1,
          borderColor: "#141414",
          borderRadius: 15,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}
      >
        {/* Icon with circular background */}
        <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
          {/* Background glow image - changes based on optimal time */}
          <Image
            source={optimal ? 
              require('../../assets/images/WidgetGreenBlur.png') : 
              require('../../assets/images/WidgetRedBlur.png')
            }
            style={{
              position: 'absolute',
              width: 70,
              height: 70,
              resizeMode: 'contain',
            }}
          />
          {/* Cup icon - changes based on optimal time */}
          <Image
            source={optimal ? 
              require('../../assets/images/cup-of-coffee.png') : 
              require('../../assets/images/cup-of-coffee(red).png')
            }
            style={{
              width: 27,
              height: 27,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* Text content */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '400' }}>Coffee window</Text>
          <Text style={{ 
            color: timerColor, 
            fontSize: 15, 
            fontWeight: '100', 
            fontFamily: "DMMono-Regular" 
          }}>
            {currentTimeFormatted}
          </Text>
        </View>

        {/* Arrow SVG */}
        <Svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M9 18l6-6-6-6" />
        </Svg>
      </View>
    </Link>
  );
};

export default CaffeineWidget;