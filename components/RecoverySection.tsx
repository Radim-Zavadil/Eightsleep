import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Svg, { Circle, Path, G } from 'react-native-svg';

const RecoverySection = ({ score = 10, temperatureOk = false, darknessOk = false }) => {
  const navigation = useNavigation();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);
  
  // Load Inter font
  const [fontsLoaded] = useFonts({
    'Inter': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf')
  });

  // Constants for arc position and dimensions
  const centerX = 138;
  const centerY = 138;
  const radius = 130.5;
  
  // Calculate position and angle on arc based on score
  const getPositionAndAngleOnArc = (scoreValue: number) => {
    // Normalize score to 0-1 range (assuming score is 0-100)
    const normalizedScore = scoreValue / 100;
    
    // Convert to angle (from -90 degrees to 90 degrees)
    // -90 degrees is bottom, 90 degrees is top
    const angle = -90 + (normalizedScore * 180);
    
    // Convert to radians
    const angleInRadians = (angle * Math.PI) / 180;
    
    // Calculate position on circle
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    
    // Calculate tangent angle (perpendicular to radius)
    const tangentAngle = angleInRadians + (Math.PI / 2);
    
    return { x, y, angle: angleInRadians, tangentAngle };
  };

  // Create animated indicator component
  const IndicatorPath = ({ scoreValue }: { scoreValue: number }) => {
    const { x, y, tangentAngle } = getPositionAndAngleOnArc(scoreValue);
    
    // Convert tangent angle from radians to degrees for SVG transform
    const rotationDegrees = (tangentAngle * 180) / Math.PI;
    
    return (
      <G
        transform={`translate(${x}, ${y}) rotate(${rotationDegrees}) translate(-${x}, -${y})`}
        zIndex={100} // Try to ensure highest z-index in SVG context
      >
        {/* White glow/shadow effect */}
        <Path
          d={`
            M ${x-20} ${y-10}
            h 40
            q 2 0 2 2
            v 16
            q 0 2 -2 2
            h -40
            q -2 0 -2 -2
            v -16
            q 0 -2 2 -2
          `}
          fill="white"
          opacity={1}
          filter="blur(4px)"
        />
        
        {/* Main indicator rectangle with 2px border radius */}
        <Path
          d={`
            M ${x-19} ${y-8.5}
            h 38
            q 2 0 2 2
            v 13
            q 0 2 -2 2
            h -38
            q -2 0 -2 -2
            v -13
            q 0 -2 2 -2
          `}
          fill="rgba(255, 252, 232, 0.95)"
          stroke="white"
          strokeWidth={0.5}
        />
      </G>
    );
  };

  useEffect(() => {
    // Update the displayed score value during animation
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });
    
    // Animate smoothly from the current value to the target score
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 1800,
      easing: Easing.elastic(1.2), // Slightly more bouncy effect
      useNativeDriver: false,
    }).start();

    // Clean up listener
    return () => {
      animatedValue.removeListener(listener);
    };
  }, [score, animatedValue]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }}></View>; // Return empty view while fonts load
  }

  return (
    <View style={{
      height: 431,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#141414',
      overflow: 'hidden',
      position: 'relative',
      marginTop: 5
    }}>
      {/* Background Bedroom Image - positioned 172px from bottom */}
      <Image
        source={require('../assets/images/bedroom.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '60%',
          resizeMode: 'cover',
          bottom: 172,
          zIndex: 1, // Lowest z-index - background
        }}
      />
      
      {/* Main Circle Component - Using SVG for better control */}
      <View style={{
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        zIndex: 2, // Middle z-index - above background, below shadow
      }}>
        
        <View style={{
          width: 276,
          height: 276,
          borderRadius: 138,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
          <Svg width={276} height={276}>
            <Circle
              cx={138}
              cy={138}
              r={130.5}
              stroke="#fff"
              strokeWidth={17}
              fill="none"
              opacity={0.33}
            />
            
            {/* The moving indicator rectangle - placed after content to ensure highest z-index */}
          </Svg>
          
          {/* Indicator rendered outside main SVG to ensure it's on top */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 276,
            height: 276,
            zIndex: 100, // Ensure highest z-index
          }}>
            <Svg width={276} height={276}>
              <IndicatorPath scoreValue={displayScore} />
            </Svg>
          </View>
        </View>
      </View>
      
      {/* Shadow Image - layered on top of the circle */}
      <Image
        source={require('../assets/images/BedroomShadow.png')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
          zIndex: 3, // Higher z-index - above circle
          marginTop: 70
        }}
      />
      
      {/* Room Label */}
      <View style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 5
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
                BEDROOM
              </Text>
            </View>
          
        </View>
      
      {/* Small dots on sides - now at same z-index as text */}
      <View style={{
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        left: '57.5%',
        top: 300,
        marginLeft: -125,
        zIndex: 10, // Same as text for visibility
      }} />
      
      <View style={{
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        right: '57.5%',
        top: 300,
        marginRight: -125,
        zIndex: 10, // Same as text for visibility
      }} />
      
      {/* Circle Content - All text elements */}
      <View style={{
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: 246,
        height: 246,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Highest z-index for all text
        backgroundColor: 'transparent'
      }}>
        {/* Room Score Text */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 1,
          marginTop: 12
        }}>
          <Text style={{
            color: '#fff',
            opacity: 0.5,
            fontSize: 15,
            marginRight: 6,
            fontFamily: 'Inter',
          }}>Current Room Score</Text>
          <Image
            source={require('../assets/images/ActiveDot.png')}
          />
        </View>
        
        {/* Score Number */}
        <Text style={{
          fontSize: 64,
          fontWeight: '400',
          color: '#1EED67',
          marginBottom: 8,
          fontFamily: 'Inter',
        }}>
          {displayScore}
        </Text>
        
        {/* Status Text */}
        <Text style={{
          color: '#fff',
          fontSize: 16,
          marginBottom: 20,
          fontWeight: "300",
          fontFamily: 'Inter',
        }}>Healthy environment</Text>
        
        {/* Bottom Stats */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '80%',
          marginTop: 8,
        }}>
          {/* Temperature */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require("../assets/images/TemperatureBedroomIcon.png")}
            />
            <Text style={{
              color: '#C4C1BD',
              marginLeft: 6,
              fontSize: 14,
              fontFamily: 'Inter',
            }}>{temperatureOk ? 'Great' : 'Bad'}</Text>
          </View>
          {/* Darkness */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require("../assets/images/LightBedroomIcon.png")}
            />
            <Text style={{
              color: '#C4C1BD',
              marginLeft: 6,
              fontSize: 14,
              fontFamily: 'Inter',
            }}>{darknessOk ? 'Great' : 'Bad'}</Text>
          </View>
          {/* Humidity (unchanged) */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              source={require("../assets/images/BlueLightBedroomIcon.png")}
            />
            <Text style={{
              color: '#C4C1BD',
              marginLeft: 6,
              fontSize: 14,
              fontFamily: 'Inter',
            }}>55%</Text>
          </View>
        </View>
      </View>
      
      {/* See Checklist Button */}
      <Link href='/bedroom' asChild>
        <TouchableOpacity 
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            backgroundColor: 'transparent',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 10, // Highest z-index for all UI elements
          }}
        >
          <Text style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: "200",
            fontFamily: 'Inter',
          }}>See Checklist</Text>
        </TouchableOpacity>
      </Link>
      
      {/* Right navigation arrow */}
      <TouchableOpacity style={{
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Highest z-index for all UI elements
      }}>
        <Feather name="chevron-right" size={24} color="#8E8E93" />
      </TouchableOpacity>
    </View>
  );
};

export default RecoverySection;