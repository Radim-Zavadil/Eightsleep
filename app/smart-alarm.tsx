import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useFocusEffect } from 'expo-router';
import { ChevronLeft, Info } from 'react-native-feather';
import { supabase } from '@/utils/supabase'; // Adjust import path as needed
import AlarmModal from '@/components/AlarmModal';
import AlarmCard from '@/components/AlarmCard';
import AlarmNotificationHandler from '@/components/AlarmNotificationHandler';
import AlarmService from '@/services/AlarmService';
import { Alarm } from '@/types/alarm';

const SmartAlarmPage = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize alarm service on component mount
  useEffect(() => {
    initializeAlarmService();
  }, []);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // Fetch alarms when user is available
  useEffect(() => {
    if (user) {
      fetchAlarms();
    }
  }, [user]);

  // Sync alarms with service when alarms change
  useEffect(() => {
    if (alarms.length > 0 && !isInitializing) {
      syncAlarmsWithService();
    }
  }, [alarms, isInitializing]);

  // Re-sync alarms when returning to the screen
  useFocusEffect(
    React.useCallback(() => {
      if (user && !isInitializing) {
        AlarmService.syncAlarmsWithDatabase();
      }
    }, [user, isInitializing])
  );

  const initializeAlarmService = async () => {
    try {
      setIsInitializing(true);
      await AlarmService.initialize();
      console.log('Alarm service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize alarm service:', error);
      Alert.alert(
        'Alarm Service Error',
        'Failed to initialize alarm functionality. Some features may not work properly.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const syncAlarmsWithService = async () => {
    try {
      // Sync all enabled alarms with the service
      for (const alarm of alarms) {
        if (alarm.isEnabled) {
          await AlarmService.scheduleAlarm(alarm);
        } else {
          await AlarmService.cancelAlarm(alarm.id);
        }
      }
    } catch (error) {
      console.error('Failed to sync alarms with service:', error);
    }
  };

  // Fetch alarms from Supabase
  const fetchAlarms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alarms')
        .select('*')
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching alarms:', error);
        Alert.alert('Error', 'Failed to fetch alarms');
        return;
      }

      // Transform database data to match your Alarm type
      const transformedAlarms = data.map(alarm => ({
        id: alarm.id,
        time: alarm.time,
        label: alarm.label || '',
        repeatDays: alarm.repeat_days || [],
        isEnabled: alarm.is_enabled,
        sound: alarm.sound || 'default',
        vibrate: alarm.vibrate,
        snoozeEnabled: alarm.snooze_enabled,
        snoozeDuration: alarm.snooze_duration,
        createdAt: alarm.created_at,
        updatedAt: alarm.updated_at
      }));

      setAlarms(transformedAlarms);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add new alarm to Supabase and schedule it
  const addAlarm = async (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('alarms')
        .insert([{
          user_id: user?.id,
          time: alarmData.time,
          label: alarmData.label,
          repeat_days: alarmData.repeatDays,
          is_enabled: alarmData.isEnabled,
          sound: alarmData.sound,
          vibrate: alarmData.vibrate,
          snooze_enabled: alarmData.snoozeEnabled,
          snooze_duration: alarmData.snoozeDuration
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding alarm:', error);
        Alert.alert('Error', 'Failed to add alarm');
        return;
      }

      // Transform and add to local state
      const newAlarm = {
        id: data.id,
        time: data.time,
        label: data.label || '',
        repeatDays: data.repeat_days || [],
        isEnabled: data.is_enabled,
        sound: data.sound || 'default',
        vibrate: data.vibrate,
        snoozeEnabled: data.snooze_enabled,
        snoozeDuration: data.snooze_duration,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setAlarms(prev => [...prev, newAlarm]);

      // Schedule the alarm if enabled
      if (newAlarm.isEnabled) {
        await AlarmService.scheduleAlarm(newAlarm);
      }

      Alert.alert('Success', 'Alarm added successfully');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Update alarm in Supabase and reschedule it
  const updateAlarm = async (id: string, alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('alarms')
        .update({
          time: alarmData.time,
          label: alarmData.label,
          repeat_days: alarmData.repeatDays,
          is_enabled: alarmData.isEnabled,
          sound: alarmData.sound,
          vibrate: alarmData.vibrate,
          snooze_enabled: alarmData.snoozeEnabled,
          snooze_duration: alarmData.snoozeDuration
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating alarm:', error);
        Alert.alert('Error', 'Failed to update alarm');
        return;
      }

      // Update local state
      const updatedAlarm = {
        id: data.id,
        time: data.time,
        label: data.label || '',
        repeatDays: data.repeat_days || [],
        isEnabled: data.is_enabled,
        sound: data.sound || 'default',
        vibrate: data.vibrate,
        snoozeEnabled: data.snooze_enabled,
        snoozeDuration: data.snooze_duration,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setAlarms(prev => prev.map(alarm => 
        alarm.id === id ? updatedAlarm : alarm
      ));

      // Update alarm scheduling
      await AlarmService.updateAlarm(updatedAlarm);

      Alert.alert('Success', 'Alarm updated successfully');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Toggle alarm enabled/disabled
  const toggleAlarm = async (id: string) => {
    try {
      const alarm = alarms.find(a => a.id === id);
      if (!alarm) return;

      const { error } = await supabase
        .from('alarms')
        .update({ is_enabled: !alarm.isEnabled })
        .eq('id', id);

      if (error) {
        console.error('Error toggling alarm:', error);
        Alert.alert('Error', 'Failed to toggle alarm');
        return;
      }

      // Update local state
      const updatedAlarm = { ...alarm, isEnabled: !alarm.isEnabled };
      setAlarms(prev => prev.map(a => 
        a.id === id ? updatedAlarm : a
      ));

      // Update alarm scheduling
      if (updatedAlarm.isEnabled) {
        await AlarmService.scheduleAlarm(updatedAlarm);
      } else {
        await AlarmService.cancelAlarm(id);
      }

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Delete alarm from Supabase and cancel scheduling
  const deleteAlarm = async (id: string) => {
    try {
      // Show confirmation dialog
      Alert.alert(
        'Delete Alarm',
        'Are you sure you want to delete this alarm?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const { error } = await supabase
                .from('alarms')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Error deleting alarm:', error);
                Alert.alert('Error', 'Failed to delete alarm');
                return;
              }

              // Cancel alarm scheduling
              await AlarmService.cancelAlarm(id);

              // Update local state
              setAlarms(prev => prev.filter(alarm => alarm.id !== id));
              Alert.alert('Success', 'Alarm deleted successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddAlarm = () => {
    setEditingAlarm(undefined);
    setModalVisible(true);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setModalVisible(true);
  };

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id' | 'createdAt'>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData);
    } else {
      addAlarm(alarmData);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingAlarm(undefined);
  };

  // Check if there are any alarms scheduled for today
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayAlarms = alarms.filter(alarm => 
    alarm.isEnabled && alarm.repeatDays.includes(today)
  );
  const hasActiveAlarms = todayAlarms.length > 0;

  if (loading || isInitializing) {
    return (
      <View style={[styles.backgroundImage, styles.loadingContainer]}>
        <Text style={styles.loadingText}>
          {isInitializing ? 'Initializing alarm system...' : 'Loading alarms...'}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.backgroundImage, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Please log in to view your alarms</Text>
      </View>
    );
  }

  return (
    <View style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/">
            <ChevronLeft stroke="#FFFFFF" width={24} height={24} />
          </Link>
          <Text style={styles.headerTitle}>Smart Alarm</Text>
          <Info stroke="#FFFFFF" width={24} height={24} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Image source={require('../assets/images/alarm-icon.png')} style={styles.alarmIcon} />
            
            {!hasActiveAlarms ? (
              <>
                <Text style={styles.noAlarmsTitle}>No active alarms for today</Text>
                <Text style={styles.noAlarmsSubtitle}>
                  {alarms.length > 0 
                    ? "You have active scheduled alarms but today is not included in it"
                    : "Create your first alarm to get started"
                  }
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.noAlarmsTitle}>Alarms scheduled for today</Text>
                <Text style={styles.noAlarmsSubtitle}>
                  You have {todayAlarms.length} alarm{todayAlarms.length > 1 ? 's' : ''} set for today
                </Text>
              </>
            )}
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
              <Text style={styles.addButtonText}>+ Add new alarm</Text>
            </TouchableOpacity>

            {/* Show alarm service status */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                Background alarms: {isInitializing ? 'Initializing...' : 'Active'}
              </Text>
            </View>
          </View>

          {alarms.length > 0 && (
            <View style={styles.myAlarmsContainer}>
              <Text style={styles.myAlarmsTitle}>My Alarms</Text>
              {alarms.map((alarm) => (
                <AlarmCard
                  key={alarm.id}
                  alarm={alarm}
                  onToggle={toggleAlarm}
                  onEdit={handleEditAlarm}
                  onDelete={deleteAlarm}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <AlarmModal
          visible={modalVisible}
          onClose={handleCloseModal}
          onSave={handleSaveAlarm}
          editingAlarm={editingAlarm}
        />

        {/* Alarm notification handler for full-screen alarms */}
        <AlarmNotificationHandler />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "Inter",
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  alarmIcon: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  noAlarmsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noAlarmsSubtitle: {
    color: '#A49797',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '70%',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  statusText: {
    color: '#A49797',
    fontSize: 12,
    textAlign: 'center',
  },
  myAlarmsContainer: {
    paddingBottom: 20,
  },
  myAlarmsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SmartAlarmPage;