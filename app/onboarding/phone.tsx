import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingPhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

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
        .update({ phone })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating phone:', updateError);
        setError('Failed to save phone number. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push({
        pathname: '/onboarding/cycle-length'
      });
    } catch (err) {
      console.error('Error in phone screen:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll use this to send you important updates</Text>
        
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Phone number"
          value={phone}
          onChangeText={(text) => {
            setPhone(text.replace(/[^0-9+]/g, ''));
            setError('');
          }}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={handleContinue}
          label={isLoading ? "Saving..." : "Continue"}
          disabled={isLoading || !phone}
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