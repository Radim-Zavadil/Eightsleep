import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function LoginEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      console.log('Checking email:', email);
      
      // Check profiles first since we can't directly query auth.users
      const { data: existingUser, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .single();
      
      console.log('Profile check:', { existingUser, profileError });

      if (existingUser) {
        router.push({
          pathname: '/auth/password',
          params: { email }
        });
      } else {
        // Try to sign in to check if user exists in auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy-password-to-check-existence'
        });
        
        console.log('Auth check:', { signInData, signInError });

        if (signInError?.message?.includes('Invalid login credentials')) {
          // User exists in auth but not in profiles
          console.error('User exists in auth but not in profiles');
          setError('Account exists but profile is missing. Please contact support.');
        } else {
          setError('No account found with this email');
        }
      }
    } catch (err) {
      console.error('Error checking email:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Enter your email to continue</Text>
        
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