import React from 'react'

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function CaffeineWindowsSection() {
  return (
    <View style={{
        backgroundColor: 'black',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
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
        <View style={{ padding: 16 }}>
          {/* Label */}
          <Text style={{ color: 'white', fontSize: 14, marginBottom: 12 }}>CAFFEINE WINDOW</Text>

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
        </View>
      </View>
  )
}