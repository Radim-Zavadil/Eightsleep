import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';

const SleepScreen = () => {
  const [sleepState, setSleepState] = useState('awake'); // 'awake' or 'sleeping'
  const [sleepStart, setSleepStart] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Inter': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Load sleep history on component mount
  useEffect(() => {
    loadSleepHistory();
  }, []);

  // Format date to readable string
  const formatDate = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    
    return `${month} ${day}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Format date for chart labels (short format)
  const formatShortDate = (date) => {
    const d = new Date(date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    return `${month} ${day}`;
  };

  // Get date string in YYYY-MM-DD format for grouping
  const getDateString = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Load sleep history from AsyncStorage
  const loadSleepHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('sleepHistory');
      if (savedHistory !== null) {
        setSleepHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading sleep history:', error);
    }
  };

  // Save sleep history to AsyncStorage
  const saveSleepHistory = async (history) => {
    try {
      await AsyncStorage.setItem('sleepHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving sleep history:', error);
    }
  };

  // Start sleep tracking
  const startSleep = () => {
    const now = new Date();
    setSleepState('sleeping');
    setSleepStart(now);
    Alert.alert('Sleep tracking started', `Started at ${formatDate(now)}`);
  };

  // End sleep tracking
  const endSleep = () => {
    if (!sleepStart) return;
    
    const sleepEnd = new Date();
    const durationMs = sleepEnd - sleepStart;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    // Create new sleep record
    const newRecord = {
      id: Date.now().toString(),
      sleepStart: sleepStart.toISOString(),
      sleepEnd: sleepEnd.toISOString(),
      durationHours: parseFloat(durationHours.toFixed(2)),
      dateString: getDateString(sleepStart),
    };
    
    // Update state and storage
    const updatedHistory = [newRecord, ...sleepHistory].slice(0, 30); // Keep most recent 30 entries for better weekly history
    setSleepHistory(updatedHistory);
    saveSleepHistory(updatedHistory);
    
    // Reset current state
    setSleepState('awake');
    setSleepStart(null);
    
    Alert.alert(
      'Sleep recorded',
      `You slept for ${durationHours.toFixed(2)} hours\nFrom: ${formatDate(sleepStart)}\nTo: ${formatDate(sleepEnd)}`
    );
  };

  // Clear all sleep history
  const clearHistory = () => {
    Alert.alert(
      'Clear Sleep History',
      'Are you sure you want to delete all sleep records?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setSleepHistory([]);
            saveSleepHistory([]);
            Alert.alert('Success', 'Sleep history cleared');
          },
        },
      ]
    );
  };

  // Get aggregated sleep data for the chart
  const getWeeklyChartData = () => {
    // Generate date strings for the past 7 days
    const today = new Date();
    const pastWeekDates = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      pastWeekDates.push({
        dateString: getDateString(date),
        label: formatShortDate(date),
        totalHours: 0
      });
    }
    
    // Group sleep entries by date
    const dailySleepMap = {};
    
    // Initialize with zero hours for all days in the past week
    pastWeekDates.forEach(day => {
      dailySleepMap[day.dateString] = {
        totalHours: 0,
        label: day.label
      };
    });
    
    // Sum up hours for each day
    sleepHistory.forEach(record => {
      const dateStr = getDateString(new Date(record.sleepStart));
      if (dailySleepMap[dateStr]) {
        dailySleepMap[dateStr].totalHours += record.durationHours;
      }
    });
    
    // Convert to arrays for the chart
    const labels = pastWeekDates.map(day => day.label);
    const data = pastWeekDates.map(day => dailySleepMap[day.dateString].totalHours);
    
    return { labels, data };
  };

  // Get daily aggregated sleep history for display
  const getAggregatedSleepHistory = () => {
    // Group by date
    const groupedByDate = {};
    
    sleepHistory.forEach(record => {
      const dateStr = getDateString(new Date(record.sleepStart));
      
      if (!groupedByDate[dateStr]) {
        groupedByDate[dateStr] = {
          dateString: dateStr,
          entries: [],
          totalHours: 0,
          date: new Date(record.sleepStart)
        };
      }
      
      groupedByDate[dateStr].entries.push(record);
      groupedByDate[dateStr].totalHours += record.durationHours;
    });
    
    // Convert to array and sort by date (newest first)
    return Object.values(groupedByDate)
      .sort((a, b) => b.date - a.date);
  };

  // Get chart data
  const weeklyData = getWeeklyChartData();
  const chartData = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.data,
        color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue color
        strokeWidth: 2,
      }
    ],
    legend: ["Sleep Duration (hours)"]
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3498db"
    },
    propsForLabels: {
      fontFamily: 'Inter',
    }
  };

  const aggregatedHistory = getAggregatedSleepHistory();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: '#f5f5f5',
    }}>
      <View style={{
        padding: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
          fontFamily: 'Inter',
        }}>
          Sleep Tracker
        </Text>
        
        {/* Sleep Status */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text style={{
            fontSize: 18,
            marginBottom: 8,
            fontFamily: 'Inter',
          }}>
            Status: <Text style={{
              color: sleepState === 'sleeping' ? '#3498db' : '#e74c3c',
              fontWeight: 'bold',
              fontFamily: 'Inter',
            }}>
              {sleepState === 'sleeping' ? 'Sleeping' : 'Awake'}
            </Text>
          </Text>
          
          {sleepState === 'sleeping' && sleepStart && (
            <Text style={{
              fontSize: 16,
              color: '#666',
              fontFamily: 'Inter',
            }}>
              Started at: {formatDate(sleepStart)}
            </Text>
          )}
        </View>
        
        {/* Action Buttons */}
        <View style={{
          marginBottom: 20,
        }}>
          {sleepState === 'awake' ? (
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#3498db',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
              onPress={startSleep}
            >
              <Text style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Inter',
              }}>
                I'm going to sleep
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: '#e74c3c',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
              onPress={endSleep}
            >
              <Text style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Inter',
              }}>
                I'm awake now
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Sleep Chart - Always show a week of data */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 16,
            fontFamily: 'Inter',
          }}>
            Weekly Sleep Chart
          </Text>
          
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 50}
            height={220}
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 12,
            }}
            yAxisSuffix="h"
            formatYLabel={(value) => value}
          />
        </View>
        
        {/* Aggregated Sleep History */}
        {aggregatedHistory.length > 0 && (
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: 20,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Inter',
              }}>
                Sleep History
              </Text>
              
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#f1f1f1',
                }}
                onPress={clearHistory}
              >
                <Text style={{
                  color: '#e74c3c',
                  fontWeight: '600',
                  fontFamily: 'Inter',
                }}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{ flex: 1 }}>
              {aggregatedHistory.map((dayData) => (
                <View key={dayData.dateString} style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      fontFamily: 'Inter',
                    }}>
                      {formatShortDate(dayData.date)}
                    </Text>
                    
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#3498db',
                      fontFamily: 'Inter',
                    }}>
                      {dayData.totalHours.toFixed(1)} hrs
                    </Text>
                  </View>
                  
                  {/* Show individual entries if there are multiple in a day */}
                  {dayData.entries.length > 1 && (
                    <View style={{
                      marginLeft: 10,
                      paddingLeft: 10,
                      borderLeftWidth: 2,
                      borderLeftColor: '#e0e0e0',
                    }}>
                      {dayData.entries.map((entry) => (
                        <View key={entry.id} style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 4,
                        }}>
                          <Text style={{
                            fontSize: 14,
                            color: '#666',
                            fontFamily: 'Inter',
                          }}>
                            {formatDate(entry.sleepStart)} - {formatDate(entry.sleepEnd)}
                          </Text>
                          <Text style={{
                            fontSize: 14,
                            color: '#666',
                            fontWeight: '500',
                            fontFamily: 'Inter',
                          }}>
                            {entry.durationHours.toFixed(1)} hrs
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  {/* If there's just one entry, show it inline */}
                  {dayData.entries.length === 1 && (
                    <Text style={{
                      fontSize: 14,
                      color: '#666',
                      fontFamily: 'Inter',
                    }}>
                      {formatDate(dayData.entries[0].sleepStart)} - {formatDate(dayData.entries[0].sleepEnd)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Empty State */}
        {sleepHistory.length === 0 && (
          <View style={{
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              fontFamily: 'Inter',
            }}>
              No sleep records yet.{'\n'}
              Track your first sleep by pressing the button above.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SleepScreen;