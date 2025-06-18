import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { OnboardingStep3Props } from '../../types/onboarding';

export default function OnboardingStep3({ height, onHeightChange, onContinue }: OnboardingStep3Props) {
  const handleContinue = () => {
    if (!height || parseFloat(height) <= 0) {
      Alert.alert('Error', 'Please enter a valid height');
      return;
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your height?</Text>
        <Text style={styles.subtitle}>
          This helps us provide more accurate sleep recommendations
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={onHeightChange}
          placeholder="Enter your height"
          placeholderTextColor="#666"
          keyboardType="numeric"
          autoFocus
        />
        <Text style={styles.unit}>cm</Text>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, (!height || parseFloat(height) <= 0) && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!height || parseFloat(height) <= 0}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 48,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter',
  },
  unit: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
    fontFamily: 'Inter',
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