import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Clock, Calendar } from 'react-native-feather';
import { Alarm, DAYS_OF_WEEK } from '@/types/alarm';
import TimePicker from './TimePicker';

interface AlarmModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (alarm: Omit<Alarm, 'id' | 'createdAt'>) => void;
  editingAlarm?: Alarm;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  onClose,
  onSave,
  editingAlarm,
}) => {
  const [name, setName] = useState(editingAlarm?.name || 'Wake Me Up');
  const [time, setTime] = useState(editingAlarm?.time || '08:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    editingAlarm?.repeatDays || []
  );

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    if (name.trim() && time && selectedDays.length > 0) {
      onSave({
        name: name.trim(),
        time,
        isEnabled: editingAlarm?.isEnabled ?? true,
        repeatDays: selectedDays,
      });
      onClose();
      // Reset form
      setName('Wake Me Up');
      setTime('08:00');
      setSelectedDays([]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X stroke="#FFFFFF" width={24} height={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editingAlarm ? 'Edit Alarm' : 'New Alarm'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Alarm Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alarm Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter alarm name"
              placeholderTextColor="#A49797"
            />
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wake Time</Text>
            <TimePicker value={time} onChange={setTime} />
          </View>

          {/* Repeat Days */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Repeat</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#272626',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 1,
    borderColor: '#272626',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: '#272626',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
  },
  dayButtonSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  dayButtonText: {
    color: '#A49797',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayButtonTextSelected: {
    color: '#000000',
  },
});

export default AlarmModal; 