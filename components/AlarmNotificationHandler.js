// components/AlarmNotificationHandler.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import AlarmService from '@/services/AlarmService';

const AlarmNotificationHandler = () => {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for notification responses (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Listen for notifications received while app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      handleForegroundNotification
    );

    return () => {
      subscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  const handleNotificationResponse = async (response) => {
    const { notification } = response;
    const { data } = notification.request.content;

    if (data.alarmId) {
      // Show full-screen alarm interface
      setActiveAlarm({
        id: data.alarmId,
        title: notification.request.content.title,
        body: notification.request.content.body,
        canSnooze: data.canSnooze,
        snoozeDuration: data.snoozeDuration,
        customSound: data.customSound,
      });
      setIsVisible(true);

      // Start playing alarm sound
      await AlarmService.playAlarmSound(data.customSound, data.customSound !== 'default');

      // Start vibration if enabled
      if (data.vibrate !== false) {
        Vibration.vibrate([1000, 1000, 1000], true);
      }
    }
  };

  const handleForegroundNotification = async (notification) => {
    const { data } = notification.request.content;
    
    if (data.alarmId) {
      // Handle alarm when app is in foreground
      await handleNotificationResponse({ notification });
    }
  };

  const dismissAlarm = async () => {
    await AlarmService.stopAlarmSound();
    Vibration.cancel();
    setIsVisible(false);
    setActiveAlarm(null);
  };

  const snoozeAlarm = async () => {
    if (activeAlarm && activeAlarm.canSnooze) {
      await AlarmService.snoozeAlarm(activeAlarm.id, activeAlarm.snoozeDuration);
      await dismissAlarm();
    }
  };

  if (!isVisible || !activeAlarm) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={dismissAlarm}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{activeAlarm.title}</Text>
          <Text style={styles.body}>{activeAlarm.body}</Text>
          
          <View style={styles.timeContainer}>
            <Text style={styles.time}>
              {new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {activeAlarm.canSnooze && (
              <TouchableOpacity 
                style={[styles.button, styles.snoozeButton]} 
                onPress={snoozeAlarm}
              >
                <Text style={styles.snoozeButtonText}>
                  Snooze ({activeAlarm.snoozeDuration}m)
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.dismissButton]} 
              onPress={dismissAlarm}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#A49797',
    marginBottom: 40,
    textAlign: 'center',
  },
  timeContainer: {
    marginBottom: 60,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  snoozeButton: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#666666',
  },
  snoozeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  dismissButton: {
    backgroundColor: '#FFFFFF',
  },
  dismissButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlarmNotificationHandler;