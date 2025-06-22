import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'react-native-feather';
import { Link } from 'expo-router';

const SmartAlarmCard = () => {
  return (
    <Link href="/smart-alarm" asChild>
      <TouchableOpacity 
        style={{
          height: 121,
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: "#272626",
          backgroundColor: "#000",
          marginTop: 5
        }} 
        activeOpacity={0.9}
      >
        <Image
          source={require("../assets/images/WhiteRedBlur.png")} // Replace with your actual image
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <View 
          style={{
            justifyContent: 'center',
          }}
        >
          <View 
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
            <View 
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
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
                  SMART ALARM
                </Text>
              </View>
              <ChevronRight width={20} height={20} stroke="#54504D" strokeWidth={3} />
            </View>
            
          <View
              style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
              }}
          >
              <Text 
                  style={{
                  color: '#A49797',
                  fontSize: 15,
                  marginBottom: 4,
                  fontFamily: "Inter"
                  }}
              >
                  Alarm ON: Sleep Debt
              </Text>
              
              <Text 
                  style={{
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: '500',
                  fontFamily: "Inter"
                  }}
              >
                  Pay off 1h sleep debt
              </Text>
          </View>

            
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default SmartAlarmCard;