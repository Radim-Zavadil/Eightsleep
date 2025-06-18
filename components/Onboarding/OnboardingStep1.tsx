import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { OnboardingStep1Props } from '../../types/onboarding';

export default function OnboardingStep1({ dateOfBirth, onDateChange, onContinue }: OnboardingStep1Props) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (day && month && year) {
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      const valid = validateDate(d, m, y);
      setIsValid(valid);
      if (valid) {
        setError('');
        const dateObj = new Date(y, m - 1, d);
        onDateChange(dateObj);
      } else {
        setError('Please enter a valid date');
      }
    } else {
      setIsValid(false);
      setError('');
    }
  }, [day, month, year]);

  const validateDate = (d: number, m: number, y: number) => {
    if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
    if (y < 1900 || y > new Date().getFullYear()) return false;
    if (m < 1 || m > 12) return false;
    if (d < 1 || d > 31) return false;
    // Check for valid day in month
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d && date <= new Date();
  };

  const handleContinue = () => {
    if (!isValid) {
      Alert.alert('Error', 'Please enter a valid date of birth');
      return;
    }
    onContinue();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your sleep recommendations
        </Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={day}
          onChangeText={text => setDay(text.replace(/[^0-9]/g, ''))}
          placeholder="DD"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          style={styles.input}
          value={month}
          onChangeText={text => setMonth(text.replace(/[^0-9]/g, ''))}
          placeholder="MM"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={2}
        />
        <Text style={styles.separator}>/</Text>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={year}
          onChangeText={text => setYear(text.replace(/[^0-9]/g, ''))}
          placeholder="YYYY"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={4}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!isValid}
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    fontFamily: 'Inter',
    width: 60,
    textAlign: 'center',
    marginHorizontal: 2,
  },
  separator: {
    color: '#fff',
    fontSize: 18,
    marginHorizontal: 2,
    fontWeight: '700',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 16,
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