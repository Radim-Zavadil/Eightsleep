import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useCircadianContext } from '../Context/CircadianContext';

const CircadianRhythmSensor: React.FC = () => {
  
  const { showCircadianWidget, setShowCircadianWidget } = useCircadianContext();
  
  const toggleCircadianWidget = () => {
    setShowCircadianWidget(!showCircadianWidget);
  };

  return (
    <LinearGradient
      colors={["#349EBF", "#0D5D7C", "#043448"]}
      style={{
        width: '100%',
        height: 240,
        backgroundColor: '#0D5D7C',
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
                borderWidth: 1,
                borderColor: "#6B728A",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Svg width={30} height={30} viewBox="0 0 15 15">
            <path d="M7 1V1.66667V1ZM7 12.3333V13V12.3333ZM1.66667 7H1H1.66667ZM3.20941 3.20941L2.66667 2.66667L3.20941 3.20941ZM10.7906 3.20941L11.3333 2.66667L10.7906 3.20941ZM3.20941 10.7933L2.66667 11.3334L3.20941 10.7933ZM10.7906 10.7933L11.3333 11.3334L10.7906 10.7933ZM13 7H12.3333H13ZM9.66667 7C9.66667 8.47273 8.47273 9.66667 7 9.66667C5.52724 9.66667 4.33333 8.47273 4.33333 7C4.33333 5.52724 5.52724 4.33333 7 4.33333C8.47273 4.33333 9.66667 5.52724 9.66667 7Z" fill="#8B857B"/>
            <path d="M7 1V1.66667M7 12.3333V13M1.66667 7H1M3.20941 3.20941L2.66667 2.66667M10.7906 3.20941L11.3333 2.66667M3.20941 10.7933L2.66667 11.3334M10.7906 10.7933L11.3333 11.3334M13 7H12.3333M9.66667 7C9.66667 8.47273 8.47273 9.66667 7 9.66667C5.52724 9.66667 4.33333 8.47273 4.33333 7C4.33333 5.52724 5.52724 4.33333 7 4.33333C8.47273 4.33333 9.66667 5.52724 9.66667 7Z" stroke="#8B857B" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        </View>
        

        <View
          style={{
            backgroundColor:'#407580',
            borderRadius: 7,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 12,
              fontFamily: "Inter",
              fontWeight: '500',
            }}
          >
            {showCircadianWidget ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Category Text */}
      <Text
        style={{
          marginTop: 12,
          color: '#9CC3CC',
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
        Circadian Rhythm
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#9CC3CC',
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
          opacity: showCircadianWidget ? 0.5 : 1
        }}
      >
        <Text
          onPress={toggleCircadianWidget}
          style={{
            color: '#000',
            fontFamily: "Inter",
            fontWeight: 'bold',
          }}
        >
          {showCircadianWidget ? "Added" : "Get"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CircadianRhythmSensor;
