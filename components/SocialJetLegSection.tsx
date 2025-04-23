import React from 'react'

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SocialJetLegSection() {
  return (
    <View style={{
        backgroundColor: 'black',
        borderColor: '#444',
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        marginTop: 20
      }}>
        <Image 
          source={require('../assets/images/blue-blur.png')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />

        <View style={{ padding: 20 }}>
          <Text style={{
            color: '#aaa',
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 16
          }}>
            SOCIAL JETLAG · LAST WEEK
          </Text>

          <Text style={{
            color: 'white',
            fontSize: 56,
            textAlign: 'center'
          }}>
            40m
          </Text>

          <View style={{
            backgroundColor: '#222',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignSelf: 'center',
            marginTop: 8,
            marginBottom: 16
          }}>
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500'
            }}>
              Late Weekend Sleeper
            </Text>
          </View>

          <Text style={{
            color: '#ccc',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 20
          }}>
            You stay up late during weekdays but sleep longer to make up for it.
            It’s like starting your week in Mumbai, but your body sometimes drifts into Dubai time.
          </Text>

          <View style={{
            backgroundColor: '#111',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 12,
            marginTop: 16
          }}>
            <Text style={{
              color: '#888',
              fontSize: 13,
              textAlign: 'center'
            }}>
              This week’s jetlag calibrating in 7 days
            </Text>
          </View>
        </View>
      </View>
  )
}