import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Svg, { Path, Text as SvgText, Circle, Line } from 'react-native-svg';
import { useJournalContext } from '@/context/JournalContext';

const { width } = Dimensions.get('window');

export default function JournalSection() {
  // Use the journal context to get entry counts
  const { getDailyEntryCounts, entryCount } = useJournalContext();
  
  // Get daily entry counts
  const entryCounts = getDailyEntryCounts();
  
  // Visual configuration
  const height = 100;
  
  // Calculate today's date and format dates for display
  const today = new Date();
  
  const formatDate = (dayOffset: string) => {
    const date = new Date();
    date.setDate(today.getDate() + parseInt(dayOffset));
    return `${date.getDate()}.${date.getMonth() + 1}.`;
  };

  // Straight line paths
  const mainLinePath = `M 20 ${height - 20} L ${width - 20} ${height - 20}`;
  const guidelinePath = `M 20 ${height - 50} L ${width - 20} ${height - 50}`;

  // Date points along the line - position today's date (0) in the center
  const dates = Object.keys(entryCounts).sort((a, b) => parseInt(a) - parseInt(b));
  const todayIndex = dates.indexOf('0');
  
  // Calculate positions to place today in the center
  const datePositions = dates.map((day, index) => {
    const relativePosition = index - todayIndex; // Position relative to today
    const centerPosition = width / 2;
    const spacing = (width - 80) / dates.length;
    
    return centerPosition + (relativePosition * spacing);
  });

  // Get today's entries count for the big number display
  const todayEntryCount = entryCounts['0'] || 0;

  return (
    <Link href="/journal" asChild>
      <View style={{
          backgroundColor: '#000',
          borderColor: '#1F1E23',
          borderWidth: 1,
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
          position: 'relative',
          marginTop: 5
        }}>
          {/* Background images */}
          <Image
            source={require('../assets/images/white-blur.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              zIndex: -1
            }}
          />

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%', 
            paddingHorizontal: 20,
            marginTop: 20
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
                JOURNAL
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                padding: 5,
                backgroundColor: 'rgba(255,255,255, 0.1)',
                borderRadius: 5
              }}
            >
              <Text style={{
                color: '#fff',
                fontSize: 12,
                opacity: 0.7,
                fontFamily: "Inter"
              }}>Relaxed</Text>
            </View>
            
          </View>

          <Text style={{
            color: '#fff',
            fontSize: 50,
            marginVertical: 5,
            fontFamily: "Inter"
          }}>{todayEntryCount}</Text>

          <Svg height={height + 20} width={width} style={{ marginTop: 0 }}>
            {/* Stressed Guideline */}
            <Path
              d={guidelinePath}
              stroke="#aaa"
              strokeDasharray="4,4"
              strokeWidth="1.5"
              fill="none"
              opacity={0.7}
            />

            {/* Stressed label */}
            <SvgText
              x={width - 70}
              y={height - 60}
              fontSize="12"
              fill="#aaa"
              fontFamily="Inter"
              opacity={0.7}
            >
              Stressed
            </SvgText>

            {/* Main Line */}
            <Path
              d={mainLinePath}
              stroke="#fff"
              strokeWidth="3"
              fill="none"
            />

            {/* Date Markers and Journal Entry Indicators */}
            {dates.map((dayOffset, index) => {
              const xPos = datePositions[index];
              const entries = entryCounts[dayOffset] || 0;
              const lineHeight = entries >= 3 ? 15 : entries === 2 ? 10 : entries === 1 ? 5 : 0;
              const opacity = entries > 0 ? (entries >= 3 ? 1 : entries === 2 ? 0.7 : 0.5) : 0.5;
              
              return (
                <React.Fragment key={dayOffset}>
                  {/* Date text */}
                  <SvgText
                    x={xPos}
                    y={height + 5}
                    fontSize="12"
                    fill="#aaa"
                    textAnchor="middle"
                    fontFamily="Inter"
                    opacity={0.7}
                  >
                    {formatDate(dayOffset)}
                  </SvgText>
                  
                  {/* Entry indicator line or dot */}
                  {/* Today or past days with entries */}
                  {parseInt(dayOffset) <= 0 && entries > 0 ? (
                    <>
                      {/* Line */}
                      <Line
                        x1={xPos}
                        y1={height - 25}
                        x2={xPos}
                        y2={height - 25 - lineHeight}
                        stroke="#fff"
                        strokeWidth="2"
                        opacity={opacity}
                        strokeLinecap="round"
                      />
                      {/* Rounded top cap */}
                      <Circle
                        cx={xPos}
                        cy={height - 25 - lineHeight}
                        r="1"
                        fill="#fff"
                        opacity={opacity}
                      />
                    </>
                  ) : (
                    <>
                      {/* Glowing dot effect */}
                      <Circle
                        cx={xPos}
                        cy={height - 25}
                        r="4"
                        fill="#aaa"
                        opacity={0.2}
                      />
                      <Circle
                        cx={xPos}
                        cy={height - 25}
                        r="2"
                        fill="#aaa"
                        opacity={0.5}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {/* Current position marker with glow effect - exactly on today's position */}
            <Circle
              cx={datePositions[todayIndex]}
              cy={height - 20}
              r="12"
              fill="#fff"
              opacity={0.1}
            />
            <Circle
              cx={datePositions[todayIndex]}
              cy={height - 20}
              r="9"
              fill="#fff"
              opacity={0.2}
            />
            <Circle
              cx={datePositions[todayIndex]}
              cy={height - 20}
              r="7"
              fill="#fff"
            />
          </Svg>
        </View>
      </Link>
  );
}