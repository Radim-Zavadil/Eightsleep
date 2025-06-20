import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        setError('An account with this email already exists');
        return;
      }

      // Proceed to password screen with email
      router.push({
        pathname: '/onboarding/password',
        params: { email }
      });
    } catch (err) {
      console.error('Error checking email:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>What's your email?</Text>
        <Text style={styles.subtitle}>We'll use this to create your account</Text>
        
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Email address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={handleContinue}
          disabled={!email || !!error}
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