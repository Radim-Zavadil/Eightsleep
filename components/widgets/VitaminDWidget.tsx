import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Modal,
  StatusBar,
  Alert
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Font from 'expo-font';
import { supabase } from '@/utils/supabase'; // Your Supabase client
import SunPathCircle from './SunLevels';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CloseIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VitaminDWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(false);
  const [totalWeekTime, setTotalWeekTime] = useState(0);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeButtons = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '30 min', value: 30 },
    { label: '1h', value: 60 },
    { label: '+1h', value: 60 }
  ];

  useEffect(() => {
    Font.loadAsync({
      'DMMono-Regular': require('../../assets/fonts/DMMono-Regular.ttf'),
    });
    loadWeeklyData();
  }, []);

  // Get the start of the current week (Monday)
  const getWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  };

  // Load weekly data from Supabase
  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      const weekStart = getWeekStart();
      
      // Get data for the current week (7 days starting from Monday)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const { data, error } = await supabase
        .from('sun_time_entries')
        .select('date, minutes')
        .in('date', weekDates)
        .order('date');

      if (error) {
        console.error('Error loading weekly data:', error);
        Alert.alert('Error', 'Failed to load sun time data');
        return;
      }

      // Create a map for quick lookup
      const dataMap = {};
      data?.forEach(entry => {
        dataMap[entry.date] = entry.minutes;
      });

      // Fill the weekly array with data
      const weekData = weekDates.map(date => dataMap[date] || 0);
      setWeeklyData(weekData);
      
      // Calculate total week time
      const total = weekData.reduce((sum, time) => sum + time, 0);
      setTotalWeekTime(total);

    } catch (error) {
      console.error('Error in loadWeeklyData:', error);
      Alert.alert('Error', 'Failed to load sun time data');
    } finally {
      setLoading(false);
    }
  };

  // Save or update sun time in Supabase
  const saveSunTime = async (additionalMinutes) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'Please log in to save sun time data');
        return;
      }

      // Try to get existing entry for today
      const { data: existingData, error: fetchError } = await supabase
        .from('sun_time_entries')
        .select('minutes')
        .eq('date', today)
        .eq('user_id', user.id)
        .single();

      const currentMinutes = existingData?.minutes || 0;
      const newMinutes = currentMinutes + additionalMinutes;

      // Upsert the data (insert or update)
      const { error } = await supabase
        .from('sun_time_entries')
        .upsert({
          user_id: user.id,
          date: today,
          minutes: newMinutes
        }, {
          onConflict: 'user_id,date'
        });

      if (error) {
        console.error('Error saving sun time:', error);
        Alert.alert('Error', 'Failed to save sun time data');
        return;
      }

      // Reload weekly data to reflect changes
      await loadWeeklyData();
      
    } catch (error) {
      console.error('Error in saveSunTime:', error);
      Alert.alert('Error', 'Failed to save sun time data');
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 10 && Math.abs(gestureState.dx) < 50;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 150) {
        handleClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleExpand = () => {
    setIsExpanded(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsExpanded(false);
      slideAnim.setValue(screenHeight);
      fadeAnim.setValue(0);
    });
  };

  const addSunTime = async (minutes) => {
    await saveSunTime(minutes);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const maxTime = Math.max(...weeklyData, 180);

  return (
    <>
      <TouchableOpacity onPress={handleExpand} disabled={loading}>
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
            <SunPathCircle />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#FFD9B1',
                fontSize: 15,
                fontWeight: '400',
                textShadowColor: "#EC9B46",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}>
              Sun Time
            </Text>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '100', fontFamily: "DMMono-Regular" }}>
              {loading ? 'Loading...' : formatTime(totalWeekTime)}
            </Text>
          </View>

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
      </TouchableOpacity>

      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              opacity: fadeAnim,
            }}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={handleClose}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight || 40,
              left: 20,
              right: 20,
              bottom: 50,
              backgroundColor: 'black',
              borderWidth: 1,
              borderColor: '#141414',
              borderRadius: 15,
              padding: 20,
              transform: [{ translateY: slideAnim }],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
            }}>
              <View style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10
              }}>
                <SunPathCircle />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  color: '#FFD9B1',
                  fontSize: 18,
                  fontWeight: '600',
                  textShadowColor: "#EC9B46",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}>
                  Sun Time Tracker
                </Text>
                <Text style={{
                  color: '#999',
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                  {formatTime(totalWeekTime)} this week
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={{
                  padding: 8,
                  borderRadius: 20,
                }}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginBottom: 30 }}>
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '600',
                marginBottom: 20,
                textAlign: 'center'
              }}>
                Weekly Sun Exposure
              </Text>

              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingBottom: 40,
                backgroundColor: '#0A0A0A',
                borderRadius: 12,
                minHeight: 250,
              }}>
                {days.map((day, index) => {
                  const barHeight = weeklyData[index] > 0 ?
                    Math.max((weeklyData[index] / maxTime) * 150, 8) : 8;

                  return (
                    <View key={day} style={{
                      alignItems: 'center',
                      flex: 1,
                    }}>
                      {weeklyData[index] > 0 && (
                        <Text style={{
                          color: '#FFD9B1',
                          fontSize: 10,
                          marginBottom: 5,
                          fontWeight: '500',
                        }}>
                          {formatTime(weeklyData[index])}
                        </Text>
                      )}

                      <View
                        style={{
                          width: 20,
                          height: barHeight,
                          backgroundColor: weeklyData[index] > 0 ? '#FFD9B1' : '#333',
                          borderRadius: 4,
                          marginBottom: 8,
                        }}
                      />

                      <Text style={{
                        color: '#666',
                        fontSize: 12,
                        fontWeight: '400'
                      }}>
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 15,
                textAlign: 'center'
              }}>
                Add sun time for today
              </Text>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}>
                {timeButtons.map((button) => (
                  <TouchableOpacity
                    key={button.label}
                    onPress={() => addSunTime(button.value)}
                    disabled={loading}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderWidth: 1,
                      borderColor: '#FFD9B1',
                      borderRadius: 25,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      flex: 1,
                      minWidth: 60,
                      alignItems: 'center',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <Text style={{
                      color: '#FFD9B1',
                      fontSize: 14,
                      fontWeight: '600'
                    }}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {loading && (
                <Text style={{
                  color: '#999',
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: 10
                }}>
                  Saving...
                </Text>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default VitaminDWidget;