import React from 'react'

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import ArcGauge from './SleepArc';
import ActivityGauge from './SleepArc';

export default function SleepSection() {
  return (
    <Link href='/sleep' asChild>
      <View style={{
          backgroundColor: 'black',
          borderColor: '#1F1E23',
          borderWidth: 1,
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 5
        }}>
          {/* Two PNG background images */}
          <Image
            source={require('../assets/images/sleep-large-blur.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              opacity: 0.8,
            }}
          />
          <Image
            source={require('../assets/images/sleep-small-blur.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />

            <ArcGauge value={100} />

          {/* Trophy Label */}
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.34)',
            paddingVertical: 4,
            paddingHorizontal: 12,
            borderRadius: 5,
            marginTop: 1,
            marginBottom: 10
          }}>
            <Text style={{ color: 'white', fontSize: 12 }}>Highest in last 7 days</Text>
          </View>

          {/* Description */}
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginTop: 10, textAlign: 'center' }}>
            Optimal deep sleep for physical Recovery
          </Text>
          <Text style={{ color: '#AAA', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
            Higher deep sleep helps with physical recovery and immune system health.
          </Text>

          {/* Sleep Duration Rectangle */}
          <View style={{
            width: "450px",
            marginTop: 20,
            paddingVertical: 17,
            paddingHorizontal: 20,
            borderColor: '#444',
            borderWidth: 1,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
            

            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>7 h 11 m</Text>
            {/* Optional SVG Icon */}
            <Svg height="16" width="16" style={{ margin: 5 }}>
              <svg width="18" height="19" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.07705 13C6.85684 12.9843 6.65214 12.8886 6.50653 12.7336L3.08355 9.53692C3.00728 9.38785 2.9824 9.22034 3.01233 9.05742C3.04225 8.89449 3.12551 8.74436 3.25065 8.62746C3.37578 8.51057 3.53662 8.43279 3.71104 8.40487C3.88545 8.37695 4.06486 8.40018 4.22454 8.47136L7.04282 11.1033L16.7755 2.07802C16.9351 2.0068 17.1146 1.98356 17.2889 2.01151C17.4634 2.03946 17.6243 2.11722 17.7493 2.23408C17.8745 2.35094 17.9578 2.50115 17.9877 2.66403C18.0176 2.82692 17.9927 2.99446 17.9165 3.14359L7.64755 12.7336C7.50196 12.8886 7.29715 12.9843 7.07705 13Z" fill="#1EED67"/>
                <path d="M8.97033 19C7.36507 18.9973 5.78974 18.5396 4.40843 17.6746C3.02711 16.8095 1.89025 15.5688 1.11614 14.0813C0.527707 12.973 0.164029 11.7473 0.0482925 10.482C-0.13436 8.62656 0.20359 6.75526 1.01998 5.10157C1.83637 3.4479 3.09507 2.08505 4.63905 1.18304C5.68696 0.56069 6.84595 0.176052 8.0422 0.0536443C9.2339 -0.0819464 10.4393 0.0401548 11.5851 0.412517C11.6873 0.434123 11.7842 0.478086 11.8694 0.541596C11.9546 0.605095 12.0264 0.686738 12.0801 0.781291C12.1338 0.875833 12.1682 0.981204 12.1812 1.09064C12.194 1.20006 12.1853 1.31115 12.1552 1.41676C12.1252 1.52237 12.0746 1.62019 12.0067 1.70392C11.9389 1.78767 11.8552 1.85549 11.7612 1.90304C11.6671 1.9506 11.5646 1.97685 11.4604 1.98009C11.3562 1.98334 11.2524 1.96351 11.1559 1.9219C10.1865 1.6136 9.16863 1.51312 8.16196 1.62635C7.16696 1.73411 6.20285 2.05364 5.32766 2.56576C4.48449 3.05773 3.739 3.71716 3.13208 4.50789C2.5072 5.31341 2.04057 6.24271 1.75953 7.24135C1.47849 8.24004 1.38868 9.28794 1.49538 10.3237C1.59726 11.3761 1.89939 12.3958 2.38359 13.3214C2.84875 14.2132 3.47225 15.0016 4.21989 15.6435C4.98152 16.3044 5.86017 16.7979 6.8044 17.0951C7.74859 17.3924 8.7394 17.4873 9.71883 17.3745C10.7138 17.2667 11.6779 16.9472 12.5531 16.4351C13.3963 15.9431 14.1417 15.2838 14.7487 14.493C15.3735 13.6875 15.8402 12.7581 16.1212 11.7595C16.4023 10.7609 16.4921 9.713 16.3854 8.67712C16.3755 8.5683 16.3861 8.45853 16.4163 8.35403C16.4467 8.24953 16.4961 8.15232 16.5619 8.06809C16.6277 7.98376 16.7085 7.91399 16.7999 7.8628C16.8912 7.8115 16.9911 7.77983 17.094 7.76938C17.1969 7.75904 17.3007 7.77012 17.3995 7.80221C17.4983 7.83419 17.5902 7.88654 17.6698 7.9561C17.7495 8.02566 17.8155 8.11126 17.8639 8.20774C17.9124 8.30431 17.9424 8.40997 17.9522 8.5188C18.134 10.3754 17.7946 12.2475 16.9763 13.9014C16.1581 15.5551 14.8973 16.9174 13.3515 17.8178C12.2924 18.4657 11.1155 18.8686 9.89846 19C9.58909 19 9.26973 19 8.97033 19Z" fill="#1EED67"/>
              </svg>
            </Svg>
          </View>
        </View>
      </Link>
  )
}