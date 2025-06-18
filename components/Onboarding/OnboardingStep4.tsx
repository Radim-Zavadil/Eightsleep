import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { OnboardingStep4Props } from '../../types/onboarding';

const sportOptions = ['Yes', 'No', 'Sometimes'];

export default function OnboardingStep4({ sportActivity, onSportActivityChange, onContinue }: OnboardingStep4Props) {
  const handleContinue = () => {
    if (!sportActivity) {
      Alert.alert('Error', 'Please select an option');
      return;
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Are you actively doing some kind of sport?</Text>
        <Text style={styles.subtitle}>
          This helps us adjust your sleep recommendations based on your activity level
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {sportOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              sportActivity === option && styles.optionButtonSelected,
            ]}
            onPress={() => onSportActivityChange(option)}
          >
            <Text
              style={[
                styles.optionText,
                sportActivity === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !sportActivity && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!sportActivity}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  optionsContainer: {
    marginBottom: 48,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  optionTextSelected: {
    color: '#000',
  },
  continueButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
}); 