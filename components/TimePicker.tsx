import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Clock } from 'react-native-feather';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(parseInt(value.split(':')[0]) || 8);
  const [selectedMinute, setSelectedMinute] = useState(parseInt(value.split(':')[1]) || 0);
  const [isAM, setIsAM] = useState((parseInt(value.split(':')[0]) || 8) < 12);

  const formatTime = (hour: number, minute: number, am: boolean) => {
    const displayHour = am ? (hour === 0 ? 12 : hour) : (hour === 12 ? 12 : hour - 12);
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
  };

  const formatTimeForStorage = (hour: number, minute: number, am: boolean) => {
    const storageHour = am ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    return `${storageHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    const newTime = formatTimeForStorage(selectedHour, selectedMinute, isAM);
    onChange(newTime);
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Reset to original values
    const [hour, minute] = value.split(':').map(Number);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setIsAM(hour < 12);
    setModalVisible(false);
  };

  const renderNumberPicker = (values: number[], selected: number, onSelect: (value: number) => void) => (
    <View style={styles.pickerColumn}>
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.pickerItem,
            selected === value && styles.pickerItemSelected
          ]}
          onPress={() => onSelect(value)}
        >
          <Text style={[
            styles.pickerItemText,
            selected === value && styles.pickerItemTextSelected
          ]}>
            {value.toString().padStart(2, '0')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <>
      <TouchableOpacity 
        style={styles.timeButton} 
        onPress={() => setModalVisible(true)}
      >
        <Clock stroke="#FFFFFF" width={20} height={20} />
        <Text style={styles.timeText}>
          {formatTime(selectedHour, selectedMinute, isAM)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Set Time</Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.modalButton}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.pickerContainer}>
              {renderNumberPicker(
                Array.from({ length: 12 }, (_, i) => i + 1),
                selectedHour,
                setSelectedHour
              )}
              <Text style={styles.pickerSeparator}>:</Text>
              {renderNumberPicker(
                Array.from({ length: 60 }, (_, i) => i),
                selectedMinute,
                setSelectedMinute
              )}
              <View style={styles.ampmContainer}>
                <TouchableOpacity
                  style={[
                    styles.ampmButton,
                    isAM && styles.ampmButtonSelected
                  ]}
                  onPress={() => setIsAM(true)}
                >
                  <Text style={[
                    styles.ampmText,
                    isAM && styles.ampmTextSelected
                  ]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.ampmButton,
                    !isAM && styles.ampmButtonSelected
                  ]}
                  onPress={() => setIsAM(false)}
                >
                  <Text style={[
                    styles.ampmText,
                    !isAM && styles.ampmTextSelected
                  ]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderWidth: 1,
    borderColor: '#272626',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerColumn: {
    height: 200,
    width: 60,
  },
  pickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: '#007AFF',
  },
  pickerItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pickerSeparator: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  ampmContainer: {
    marginLeft: 20,
  },
  ampmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#272626',
  },
  ampmButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ampmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  ampmTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default TimePicker; 