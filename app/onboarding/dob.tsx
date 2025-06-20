import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingDOBScreen() {
  const router = useRouter();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!day || !month || !year) {
      setError('Please fill in all fields');
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      setError('Please enter valid numbers');
      return;
    }

    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12) {
      setError('Please enter a valid date');
      return;
    }

    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      setError('Please enter a valid year');
      return;
    }

    try {
      const dob = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not found');
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ dob })
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.push({
        pathname: '/onboarding/phone'
      });
    } catch (err) {
      console.error('Error saving DOB:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>This helps us provide personalized insights</Text>
        
        <View style={styles.dateInputs}>
          <TextInput
            style={[styles.input, styles.dateInput, error ? styles.inputError : null]}
            placeholder="DD"
            value={day}
            onChangeText={(text) => {
              setDay(text.replace(/[^0-9]/g, '').slice(0, 2));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={[styles.input, styles.dateInput, error ? styles.inputError : null]}
            placeholder="MM"
            value={month}
            onChangeText={(text) => {
              setMonth(text.replace(/[^0-9]/g, '').slice(0, 2));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={[styles.input, styles.dateInput, error ? styles.inputError : null]}
            placeholder="YYYY"
            value={year}
            onChangeText={(text) => {
              setYear(text.replace(/[^0-9]/g, '').slice(0, 4));
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={handleContinue}
          label={!day || !month || !year || !!error ? "Fill in all fields" : "Continue"}
        />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
  dateInput: {
    width: '30%',
    height: 50,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 