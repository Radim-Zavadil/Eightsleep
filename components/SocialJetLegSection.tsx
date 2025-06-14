import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, Link } from 'react-native-feather';

const SleepDebtComponent = () => {
  return (
    <TouchableOpacity 
      style={{
        height: 138,
        borderRadius: 20,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: "#141414",
        overflow: 'hidden',
        marginTop: 5
      }}
    >
      <Image
        source={require('../assets/images/whiteBlurs.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
      
      <View style={{
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
                SLEEP DEBT
              </Text>
            </View>
          <ChevronRight width={24} height={24} color="#8E8E93" />
        </View>
        
        <Text style={{
          color: '#30FA48',
          fontSize: 30,
          fontWeight: '500',
          textAlign: 'center',
          fontFamily: "Inter"
        }}>
          -6h 6m
        </Text>
        
        <Text style={{
          color: '#8E8E93',
          fontSize: 12,
          textAlign: 'center',
          fontFamily: "Inter"
        }}>
          Sleep between <Text style={{ color: 'white' }}>1:59 AM - 2:29 AM</Text> tonight, to get a minimum recommended sleep of <Text style={{ color: 'white' }}>6h 45m</Text> of sleep.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SleepDebtComponent;