import React from 'react'

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { ChevronRight } from 'react-native-feather';

export default function CaffeineWindowsSection() {
  return (
    <View style={{
        backgroundColor: 'black',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 30
      }}>
        {/* PNG Background */}
        <Image
          source={require('../assets/images/red-blur.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            opacity: 0.7,
          }}
        />

        {/* Inner content with padding */}
        <View style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
          {/* Label */}
          <View 
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
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
                CAFFEINE WINDOW
              </Text>
            </View>
            <ChevronRight width={20} height={20} stroke="#54504D" strokeWidth={3} />
          </View>

          {/* Rectangles Row */}
          <View style={{ flexDirection: 'row', height: 20, borderRadius: 5, overflow: 'hidden', opacity: 0.75 }}>
            <View style={{ flex: 1, backgroundColor: '#555', borderRadius: 5 }} />
            <View style={{ flex: 1, maxWidth: 5, maxHeight: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: "black", borderRadius: 5 }} />
            <View style={{ flex: 1, backgroundColor: '#555', borderRadius: 5 }} />
            <View style={{ flex: 1, maxWidth: 5, maxHeight: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: "black", borderRadius: 5 }} />
            <View style={{ flex: 1, backgroundColor: '#FF5C5C', borderRadius: 5 }} />
          </View>

          {/* Triangle Marker */}
          <View style={{
            position: 'absolute',
            top: 68, // padding (16) + rectangles height (20) + marginBottom (12 maybe)
            left: '75%',
            width: 0,
            height: 0,
            borderLeftWidth: 6,
            borderRightWidth: 6,
            borderBottomWidth: 8,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'white',
            borderRadius: 100
          }} />

          {/* Time Labels */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingHorizontal: 2,
          }}>
            <Text style={{ color: '#AAA', fontSize: 12 }}>6:14 AM</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>11:20 AM</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>3:00 PM</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>6:40 PM</Text>
            <Text style={{ color: '#AAA', fontSize: 12 }}>11:00 PM</Text>
          </View>
          <View style={{ marginTop: 20, marginBottom: 2 }}>
            <Text style={{
              fontSize: 17,
              fontFamily: "Inter",
              color: '#fff',
              textAlign: 'center',
              marginBottom: 6,
            }}>
              Caffeine Restriction Window
            </Text>
            <Text style={{
              fontSize: 16,
              fontFamily: "Inter",
              color: '#888',
              textAlign: 'center',
              lineHeight: 18,
            }}>
              Avoiding stimulants such as caffeine now, improve your chances of a restful, deep sleep.
            </Text>
          </View>
        </View>
      </View>
  )
}