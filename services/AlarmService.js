// services/AlarmService.js
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

const BACKGROUND_ALARM_TASK = 'background-alarm-task';
const ALARM_STORAGE_KEY = 'scheduled_alarms';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class AlarmService {
  constructor() {
    this.soundObject = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permissions not granted');
      }

      // Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Register background task
      await this.registerBackgroundTask();

      this.isInitialized = true;
      console.log('AlarmService initialized');
    } catch (error) {
      console.error('Failed to initialize AlarmService:', error);
      throw error;
    }
  }

  async registerBackgroundTask() {
    try {
      // Unregister existing task
      await TaskManager.unregisterAllTasksAsync();
      
      // Register background fetch task
      await BackgroundFetch.registerTaskAsync(BACKGROUND_ALARM_TASK, {
        minimumInterval: 60000, // Check every minute
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log('Background task registered');
    } catch (error) {
      console.error('Failed to register background task:', error);
    }
  }

  async scheduleAlarm(alarm) {
    try {
      const alarmTime = this.parseAlarmTime(alarm.time);
      const now = new Date();
      
      // Schedule for each repeat day
      for (const day of alarm.repeatDays) {
        const scheduledDate = this.getNextAlarmDate(alarmTime, day);
        
        if (scheduledDate > now) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Alarm',
              body: alarm.label || 'Wake up!',
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.MAX,
              vibrate: alarm.vibrate ? [0, 250, 250, 250] : undefined,
              data: {
                alarmId: alarm.id,
                customSound: alarm.sound,
                canSnooze: alarm.snoozeEnabled,
                snoozeDuration: alarm.snoozeDuration,
              },
            },
            trigger: {
              date: scheduledDate,
              repeats: true,
            },
          });

          console.log(`Alarm scheduled for ${scheduledDate} with ID: ${notificationId}`);
        }
      }

      // Store alarm data locally for background processing
      await this.storeAlarmLocally(alarm);
      
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      throw error;
    }
  }

  async cancelAlarm(alarmId) {
    try {
      // Cancel all scheduled notifications for this alarm
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.alarmId === alarmId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      // Remove from local storage
      await this.removeAlarmFromLocal(alarmId);
      
      console.log(`Alarm ${alarmId} cancelled`);
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
    }
  }

  async updateAlarm(alarm) {
    await this.cancelAlarm(alarm.id);
    if (alarm.isEnabled) {
      await this.scheduleAlarm(alarm);
    }
  }

  async playAlarmSound(soundFile = 'default', isCustom = false) {
    try {
      // Stop any currently playing sound
      if (this.soundObject) {
        await this.soundObject.unloadAsync();
      }

      this.soundObject = new Audio.Sound();

      if (isCustom && soundFile !== 'default') {
        // Load custom sound file
        await this.soundObject.loadAsync({ uri: soundFile });
      } else {
        // Load default alarm sound
        await this.soundObject.loadAsync(require('@/assets/music/alarm(chill_guy).mp3'));
      }

      await this.soundObject.setIsLoopingAsync(true);
      await this.soundObject.playAsync();

      // Auto-stop after 10 minutes if not dismissed
      setTimeout(async () => {
        if (this.soundObject) {
          await this.stopAlarmSound();
        }
      }, 600000); // 10 minutes

    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  }

  async stopAlarmSound() {
    try {
      if (this.soundObject) {
        await this.soundObject.stopAsync();
        await this.soundObject.unloadAsync();
        this.soundObject = null;
      }
    } catch (error) {
      console.error('Failed to stop alarm sound:', error);
    }
  }

  async snoozeAlarm(alarmId, snoozeDuration = 5) {
    try {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + snoozeDuration);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alarm (Snoozed)',
          body: 'Wake up!',
          sound: 'default',
          data: { alarmId, isSnooze: true },
        },
        trigger: {
          date: snoozeTime,
        },
      });

      await this.stopAlarmSound();
      console.log(`Alarm snoozed for ${snoozeDuration} minutes`);
    } catch (error) {
      console.error('Failed to snooze alarm:', error);
    }
  }

  async syncAlarmsWithDatabase() {
    try {
      const { data: alarms, error } = await supabase
        .from('alarms')
        .select('*')
        .eq('is_enabled', true);

      if (error) {
        console.error('Failed to sync alarms:', error);
        return;
      }

      // Cancel all existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Reschedule all active alarms
      for (const alarm of alarms) {
        const transformedAlarm = {
          id: alarm.id,
          time: alarm.time,
          label: alarm.label || '',
          repeatDays: alarm.repeat_days || [],
          isEnabled: alarm.is_enabled,
          sound: alarm.sound || 'default',
          vibrate: alarm.vibrate,
          snoozeEnabled: alarm.snooze_enabled,
          snoozeDuration: alarm.snooze_duration,
        };

        await this.scheduleAlarm(transformedAlarm);
      }

      console.log('Alarms synced with database');
    } catch (error) {
      console.error('Failed to sync alarms with database:', error);
    }
  }

  // Helper methods
  parseAlarmTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  getNextAlarmDate(alarmTime, dayAbbrev) {
    const dayMap = {
      'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3,
      'Thu': 4, 'Fri': 5, 'Sat': 6
    };

    const now = new Date();
    const targetDay = dayMap[dayAbbrev];
    const daysUntilTarget = (targetDay - now.getDay() + 7) % 7;
    
    const alarmDate = new Date(now);
    alarmDate.setDate(now.getDate() + daysUntilTarget);
    alarmDate.setHours(alarmTime.hours, alarmTime.minutes, 0, 0);

    // If the alarm time has passed today, schedule for next week
    if (daysUntilTarget === 0 && alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 7);
    }

    return alarmDate;
  }

  async storeAlarmLocally(alarm) {
    try {
      const existingAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
      const alarms = existingAlarms ? JSON.parse(existingAlarms) : [];
      
      const updatedAlarms = alarms.filter(a => a.id !== alarm.id);
      updatedAlarms.push(alarm);
      
      await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Failed to store alarm locally:', error);
    }
  }

  async removeAlarmFromLocal(alarmId) {
    try {
      const existingAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
      if (existingAlarms) {
        const alarms = JSON.parse(existingAlarms);
        const updatedAlarms = alarms.filter(a => a.id !== alarmId);
        await AsyncStorage.setItem(ALARM_STORAGE_KEY, JSON.stringify(updatedAlarms));
      }
    } catch (error) {
      console.error('Failed to remove alarm from local storage:', error);
    }
  }
}

// Background task definition
TaskManager.defineTask(BACKGROUND_ALARM_TASK, async () => {
  try {
    console.log('Background alarm task running');
    
    // Check for due alarms and trigger notifications
    const storedAlarms = await AsyncStorage.getItem(ALARM_STORAGE_KEY);
    if (storedAlarms) {
      const alarms = JSON.parse(storedAlarms);
      const now = new Date();
      
      for (const alarm of alarms) {
        if (alarm.isEnabled) {
          const alarmTime = new Date();
          const [hours, minutes] = alarm.time.split(':').map(Number);
          alarmTime.setHours(hours, minutes, 0, 0);
          
          const dayAbbrev = now.toLocaleDateString('en-US', { weekday: 'short' });
          
          if (alarm.repeatDays.includes(dayAbbrev) && 
              Math.abs(now.getTime() - alarmTime.getTime()) < 60000) {
            
            // Trigger alarm notification
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Alarm',
                body: alarm.label || 'Wake up!',
                sound: 'default',
                data: { alarmId: alarm.id },
              },
              trigger: null, // Immediate
            });
          }
        }
      }
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default new AlarmService();