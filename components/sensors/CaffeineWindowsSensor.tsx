import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { useCaffeineContext } from '../Context/CaffeineContext';


const CaffeineWindowsSensor: React.FC = () => {

  const { showCaffeineWidget, setShowCaffeineWidget } = useCaffeineContext();
  
  const toggleCaffeineWidget = () => {
    setShowCaffeineWidget(!showCaffeineWidget);
  };

  return (
    <LinearGradient
      colors={["#5F4498", "#382656", "#1E1332"]}
      style={{
        width: '100%',
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
            borderWidth: 1,
            borderColor: "#6B728A",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Svg width={42} height={42} viewBox="0 0 42 42">
            <Path d="M26.5855 27.1805C29.2181 25.8124 31.3906 23.7007 32.833 21.108C36.228 15.2455 35.563 8.54304 31.3805 6.12804C27.198 3.71304 21.003 6.49554 17.678 12.358C17.3756 12.8918 17.101 13.4409 16.8555 14.003" fill="#95949A"/>
            <Path d="M26.5855 27.1805C29.2181 25.8124 31.3906 23.7007 32.833 21.108C36.228 15.2455 35.563 8.54304 31.3805 6.12804C27.198 3.71304 21.003 6.49554 17.678 12.358C17.3756 12.8918 17.101 13.4409 16.8555 14.003" stroke="#302F35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M22.8707 35.8817C27.0558 33.4654 27.7062 26.757 24.3234 20.8979C20.9407 15.0388 14.8058 12.2478 10.6207 14.6641C6.43563 17.0803 5.78522 23.7888 9.16797 29.6479C12.5507 35.507 18.6856 38.2979 22.8707 35.8817Z" fill="#95949A" stroke="#302F35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M24.3633 20.44C25.7808 16.2925 23.5758 13.5975 31.3633 6.125" stroke="#302F35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M22.7525 35.7769C12.3575 26.2569 21.8425 25.3994 10.625 14.6719" stroke="#302F35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>
        
        <View
          style={{
            backgroundColor:'#493A5E',
            borderRadius: 7,
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 11,
              fontWeight: '500',
              fontFamily: "Inter"
            }}
          >
            {showCaffeineWidget ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* Category Text */}
      <Text
        style={{
          marginTop: 12,
          color: '#D0C2ED',
          fontSize: 12,
          letterSpacing: 4,
          opacity: 0.6,
          fontFamily: "Inter"
        }}
      >
        PRODUCTIVITY
      </Text>

      {/* Title */}
      <Text
        style={{
          color: '#fff',
          fontSize: 22,
          fontWeight: '400',
          marginTop: 4,
          fontFamily: "Inter"
        }}
      >
        Caffeine windows
      </Text>

      {/* Description */}
      <Text
        style={{
          color: '#C094DD',
          fontSize: 14,
          marginTop: 6,
          flex: 1,
          opacity: 0.6,
          fontFamily: "Inter"
        }}
      >
        Maximize your Vitamin D with smart and personalized suggestions for sun exposure.
      </Text>

      {/* Button with state handling */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: '#fff',
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          opacity: showCaffeineWidget ? 0.5 : 1
        }}
      >
        <Text
          onPress={toggleCaffeineWidget} 
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontFamily: "Inter"
          }}
        >
          {showCaffeineWidget ? "Added" : "Get"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default CaffeineWindowsSensor;