
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function SleepScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stopTime, setStopTime] = useState<Date | null>(null);

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleTrackingToggle = () => {
    if (!isTracking) {
      setStartTime(new Date());
      setStopTime(null);
    } else {
      setStopTime(new Date());
    }
    setIsTracking(!isTracking);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/images/ArrowRightGrey.svg')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>SLEEP TRACKING</ThemedText>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.trackButton, isTracking ? styles.stopButton : styles.startButton]} 
          onPress={handleTrackingToggle}
        >
          <ThemedText style={styles.buttonText}>
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </ThemedText>
        </TouchableOpacity>

        {startTime && (
          <View style={styles.timeInfo}>
            <ThemedText style={styles.timeText}>
              Started at: {startTime.toLocaleTimeString()}
            </ThemedText>
            {stopTime && (
              <>
                <ThemedText style={styles.timeText}>
                  Stopped at: {stopTime.toLocaleTimeString()}
                </ThemedText>
                <ThemedText style={styles.durationText}>
                  Duration: {formatDuration(startTime, stopTime)}
                </ThemedText>
              </>
            )}
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  trackButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#1F9950',
  },
  stopButton: {
    backgroundColor: '#FF4747',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  durationText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
});
