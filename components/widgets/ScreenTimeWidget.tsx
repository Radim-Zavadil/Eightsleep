import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Font from 'expo-font';
import { useEffect } from 'react';

const ScreenTimeWidget = () => {

    useEffect(() => {
        Font.loadAsync({
          'DMMono-Regular': require('../../assets/fonts/DMMono-Regular.ttf'),
        });
      }, []);
    
  return (
    <View
      style={{
        height: 62,
        width: 245,
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
            {/* Background glow image */}
            <Image
                source={require('../../assets/images/WidgetBlueBlur.png')} // replace with your actual background
                style={{
                position: 'absolute',
                width: 70,
                height: 70,
                resizeMode: 'contain',
                }}
            />
            {/* Cup icon */}
            <Image
                source={require('../../assets/images/Eye.svg')} // replace with your actual icon
                style={{
                width: 27,
                height: 27,
                resizeMode: 'contain',
                }}
            />
        </View>


      {/* Text content */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#9EA7F4', fontSize: 15, fontWeight: '400' }}>Blue light window</Text>
        <Text style={{ color: 'white', fontSize: 15, fontWeight: '100', fontFamily: "DMMono-Regular" }}>
          01:42:23
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
  );
};

export default ScreenTimeWidget;
