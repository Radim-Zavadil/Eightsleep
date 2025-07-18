import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSmartContext } from '@/components/Context/AlarmContext';
import AlarmCard from '@/components/AlarmCard';

const StartSleepingPage = () => {
  const router = useRouter();
  const { alarms, toggleAlarm, updateAlarm, deleteAlarm } = useSmartContext();
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer automatically
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Format timer as HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Handle wake up
  const handleWakeUp = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Pass sleep duration as seconds in query param
    router.replace({ pathname: '/sleep', params: { slept: seconds.toString() } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <TouchableOpacity style={styles.wakeButton} onPress={handleWakeUp}>
        <Text style={styles.wakeButtonText}>Wake me up</Text>
      </TouchableOpacity>
      <Text style={styles.alarmsTitle}>Your Alarms</Text>
      <ScrollView style={styles.alarmsList}>
        {alarms.length === 0 ? (
          <Text style={styles.noAlarms}>No alarms set.</Text>
        ) : (
          alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onToggle={toggleAlarm}
              onEdit={undefined}
              onDelete={deleteAlarm}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  timer: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 40,
  },
  wakeButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 30,
  },
  wakeButtonText: {
    color: '#000',
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: '600',
  },
  alarmsTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  alarmsList: {
    flex: 1,
  },
  noAlarms: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StartSleepingPage; 