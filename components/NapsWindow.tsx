import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { supabase } from '@/utils/supabase'; // Adjust the import path as needed

interface NapDetectorProps {
  onNapSaved?: (duration: number) => void;
  startTime?: string; // Optional prop for start time
  endTime?: string; // Optional prop for end time
}

const NapDetector: React.FC<NapDetectorProps> = ({ 
  onNapSaved, 
  startTime = "9:30PM",
  endTime = "10:55PM" 
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [showDurationPicker, setShowDurationPicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const durationOptions = [
    { label: '10m', value: 10 },
    { label: '15m', value: 15 },
    { label: '20m', value: 20 },
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
  ];

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
    setShowDurationPicker(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      return `${minutes / 60}h`;
    }
    return `${minutes}m`;
  };

  const saveNap = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to save naps');
        return;
      }

      // Insert nap into database
      const { data, error } = await supabase
        .from('naps')
        .insert([
          {
            user_id: user.id,
            duration_minutes: selectedDuration,
            nap_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            nap_time: new Date().toTimeString().split(' ')[0], // HH:MM:SS format
          },
        ])
        .select();

      if (error) {
        console.error('Error saving nap:', error);
        Alert.alert('Error', 'Failed to save nap. Please try again.');
        return;
      }

      // Success
      Alert.alert('Success', `${formatDuration(selectedDuration)} nap saved!`);
      onNapSaved?.(selectedDuration);

    } catch (error) {
      console.error('Error saving nap:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Content overlay */}
      <View style={styles.content}>
        
        {/* Left section with moon icon */}
        <View style={styles.leftSection}>
          {/* White blur background behind moon */}
          <Image
            source={require('../assets/images/SmallBlurWhite.png')}
            style={styles.whiteBlur}
            resizeMode="contain"
          />
          
          <View style={styles.moonContainer}>
            <Image
              source={require('../assets/images/NapsMoon.svg')}
              style={styles.moonImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Center section with text content */}
        <View style={styles.centerSection}>
          <View style={styles.textContainer}>
            <View style={styles.napTitleContainer}>
              <Text style={styles.napDetectedText}>Nap detected</Text>
              <TouchableOpacity
                style={styles.durationButton}
                onPress={() => setShowDurationPicker(true)}
              >
                <Text style={styles.durationText}>{formatDuration(selectedDuration)}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.timeRangeText}>{startTime} - {endTime}</Text>
          </View>
        </View>

        {/* Right section with Add button and X button */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.addButton, isLoading && styles.addButtonDisabled]}
            onPress={saveNap}
            disabled={isLoading}
          >
            <Text style={styles.addButtonText}>
              {isLoading ? 'Saving...' : 'Add'}
            </Text>
            <Text style={styles.addButtonPlus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Duration picker modal */}
      <Modal
        visible={showDurationPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDurationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Nap Duration</Text>
            {durationOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.durationOption,
                  selectedDuration === option.value && styles.selectedDurationOption,
                ]}
                onPress={() => handleDurationSelect(option.value)}
              >
                <Text
                  style={[
                    styles.durationOptionText,
                    selectedDuration === option.value && styles.selectedDurationOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDurationPicker(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background like in the image
  },
  whiteBlur: {
    position: 'absolute',
    width: 60,
    height: 60,
    left: 0,
    top: '50%',
    transform: [{ translateY: -30 }],
    zIndex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  moonContainer: {
    position: 'relative',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonImage: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  centerSection: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
  napTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  napDetectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
  },
  durationButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeRangeText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.7,
    fontWeight: '400',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#007AFF80',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButtonPlus: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 200,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  durationOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: '#F8F9FA',
  },
  selectedDurationOption: {
    backgroundColor: '#007AFF',
  },
  durationOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000000',
  },
  selectedDurationOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
  },
  modalCloseButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6C757D',
    fontWeight: '500',
  },
});

export default NapDetector;