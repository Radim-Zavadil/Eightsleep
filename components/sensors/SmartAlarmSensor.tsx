import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useSmartContext } from '../Context/AlarmContext';

const SmartAlarmSensor: React.FC = () => {
  
  const { showSmartWidget, setShowSmartWidget } = useSmartContext();
  
  const toggleSmartWidget = () => {
    setShowSmartWidget(!showSmartWidget);
  };

  return (
    <LinearGradient
      colors={["#BF3436", "#7C0D0F", "#480405"]}
      style={{
        width: 380,
        height: 240,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        position: 'relative',
      }}
      start={{x:0, y:1}}
      end={{x:0, y:1}}
    >
      {/* Header Row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View
            style={{
                backgroundColor: "#1F1E23",
                width: 50,
                height: 50,
                borderRadius: 12,
                borderWidth: "1px",
                borderColor: "#6B728A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Svg width={30} height={27} viewBox="0 0 30 30">
            <path d="M4 7.33073L6.66667 4.66406M28 7.33073L25.3333 4.66406M16 11.3307V16.6641L18.6667 19.3307M26.6667 16.6641C26.6667 22.5551 21.8911 27.3307 16 27.3307C10.109 27.3307 5.33333 22.5551 5.33333 16.6641C5.33333 10.773 10.109 5.9974 16 5.9974C21.8911 5.9974 26.6667 10.773 26.6667 16.6641Z" stroke="#95949A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        </View>
        

        <View
          style={{
            backgroundColor: '#802828',
            borderRadius: 7,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            {showSmartWidget ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Category Text */}
      <Text
        style={{
          marginTop: 12,
          color: '#CC9C9C',
          fontSize: 12,
          fontFamily: "Inter",
          letterSpacing: 4,
          opacity: 0.6
        }}
      >
        PERFORMANCE
      </Text>

      {/* Title */}
      <Text
        style={{
          color: '#fff',
          fontSize: 22,
          fontFamily: "Inter",
          fontWeight: '400',
          marginTop: 4,
        }}
      >
        Smart Alarm
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#CC9C9C',
          fontSize: 14,
          fontFamily: "Inter",
          marginTop: 6,
          flex: 1,
          opacity: 0.6
        }}
      >
        Optimize your daily routine with proper eating and exercise throughout a day to ensure better life.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          opacity: showSmartWidget ? 0.5 : 1
        }}
      >
        <Text
          onPress={toggleSmartWidget}
          style={{
            color: '#000',
            fontFamily: "Inter",
            fontWeight: 'bold',
          }}
        >
          {showSmartWidget ? "Added" : "Get"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SmartAlarmSensor;
