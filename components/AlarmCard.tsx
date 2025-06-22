import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronLeft, Trash2 } from 'react-native-feather';
import { Alarm } from '@/types/alarm';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onEdit?: (alarm: Alarm) => void;
  onDelete?: (id: string) => void;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle, onEdit, onDelete }) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatRepeatDays = (days: string[]) => {
    if (days.length === 0) return 'Never';
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.every(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day))) {
      return 'Weekdays';
    }
    if (days.length === 2 && days.includes('Sat') && days.includes('Sun')) {
      return 'Weekends';
    }
    return days.join(', ');
  };

  const handleCardPress = () => {
    if (onEdit) {
      onEdit(alarm);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      Alert.alert(
        'Delete Alarm',
        `Are you sure you want to delete "${alarm.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete(alarm.id),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.alarmCard}>
      <TouchableOpacity 
        style={styles.alarmInfo}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <Text style={styles.alarmCardSubtitle}>{alarm.name}</Text>
        <View style={styles.alarmDetails}>
          <View>
            <Text style={styles.alarmDetailTitle}>WAKE TIME</Text>
            <Text style={styles.alarmDetailValue}>{formatTime(alarm.time)}</Text>
          </View>
          <View>
            <Text style={styles.alarmDetailTitle}>REPEAT</Text>
            <Text style={styles.alarmDetailValue}>{formatRepeatDays(alarm.repeatDays)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.alarmControls}>
        <TouchableOpacity 
          style={[
            styles.toggleButton,
            alarm.isEnabled && styles.toggleButtonEnabled
          ]}
          onPress={() => onToggle(alarm.id)}
        >
          <View style={[
            styles.toggleCircle,
            alarm.isEnabled && styles.toggleCircleEnabled
          ]} />
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 stroke="#FF3B30" width={16} height={16} />
          </TouchableOpacity>
        )}
        {onEdit && (
          <ChevronLeft 
            stroke="#54504D" 
            width={20} 
            height={20} 
            style={{ transform: [{ rotate: '180deg'}]}} 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#272626',
    marginBottom: 12,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmCardSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alarmDetails: {
    flexDirection: 'row',
    gap: 32,
  },
  alarmDetailTitle: {
    color: '#A49797',
    fontSize: 12,
  },
  alarmDetailValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  alarmControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  toggleButtonEnabled: {
    backgroundColor: '#34C759',
    alignItems: 'flex-end',
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  toggleCircleEnabled: {
    backgroundColor: '#FFFFFF',
  },
  deleteButton: {
    padding: 8,
  },
});

export default AlarmCard; 