import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingCycleLengthScreen() {
  const router = useRouter();
  const [cycleLength, setCycleLength] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async (value: string) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        setError('Failed to get user information. Please try again.');
        setIsLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cycle_length: value })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating cycle length:', updateError);
        setError('Failed to save cycle length. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push({
        pathname: '/onboarding/cycle-regularity'
      });
    } catch (err) {
      console.error('Error in cycle length screen:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndContinue = () => {
    if (!cycleLength) {
      setError('Please enter your cycle length');
      return;
    }

    const length = parseInt(cycleLength);
    if (isNaN(length) || length < 21 || length > 35) {
      setError('Cycle length should be between 21 and 35 days');
      return;
    }

    handleContinue(cycleLength);
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>What is your average cycle length?</Text>
        <Text style={styles.subtitle}>This is the number of days between the first day of your period and the first day of your next period</Text>
        
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="e.g. 28"
          value={cycleLength}
          onChangeText={(text) => {
            setCycleLength(text.replace(/[^0-9]/g, ''));
            setError('');
          }}
          keyboardType="number-pad"
          editable={!isLoading}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={validateAndContinue}
          label={isLoading ? "Saving..." : "Continue"}
          disabled={isLoading || !cycleLength}
        />
        
        <ContinueButton 
          onPress={() => handleContinue('not_sure')}
          label="I'm not sure"
          disabled={isLoading}
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
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