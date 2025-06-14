import React from 'react';
import { TouchableOpacity, Text, View, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';

const NsdrComponent = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={{
        height: 76,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: "#1F1E23",
        marginTop: 5,
      }} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={require('../assets/images/GreenWhiteBlur.png')} // Replace with your background image path
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
        imageStyle={{
          borderRadius: 12,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          height: '100%',
        }}>
          <View style={{
            padding: 0,
            marginRight: 12,
          }}>
            <svg width="26" height="25" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="5.5" r="2.5" fill="white"/>
            <circle cx="15" cy="5.5" r="2.5" fill="white"/>
            <circle cx="15" cy="14.5" r="2.5" fill="white"/>
            <circle cx="10.5" cy="10" r="2" fill="white"/>
            <circle cx="10.5" cy="1" r="1" fill="white" fill-opacity="0.48"/>
            <circle cx="19.5" cy="10" r="1" fill="white" fill-opacity="0.48"/>
            <circle cx="1.5" cy="10" r="1" fill="white" fill-opacity="0.48"/>
            <circle cx="10.5" cy="19" r="1" fill="white" fill-opacity="0.48"/>
            <circle cx="6" cy="14.5" r="2.5" fill="white"/>
            </svg>
          </View>
          <View style={{
            flex: 1,
          }}>
            <Text style={{
              color: 'white',
              fontWeight: 400,
              fontSize: 15,
              fontFamily: "Inter"
            }}>Start an NSDR session and improve your recovery score</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#8E8E93" style={{
            paddingBottom: 30
          }} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default NsdrComponent;