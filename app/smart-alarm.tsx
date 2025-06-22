import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { ChevronLeft, Info } from 'react-native-feather';
import { useSmartContext } from '@/components/Context/AlarmContext';
import AlarmModal from '@/components/AlarmModal';
import AlarmCard from '@/components/AlarmCard';
import { Alarm } from '@/types/alarm';

const SmartAlarmPage = () => {
  const { alarms, addAlarm, toggleAlarm, updateAlarm, deleteAlarm } = useSmartContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>();

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
                  You have active scheduled alarms but today is not included in it
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
  myAlarmsContainer: {
    paddingBottom: 20,
  },
  myAlarmsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default SmartAlarmPage; 