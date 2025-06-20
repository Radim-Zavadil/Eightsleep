import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingNotificationsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const finishOnboarding = async () => {
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
        .update({ onboarding_complete: true })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error completing onboarding:', updateError);
        setError('Failed to complete onboarding. Please try again.');
        setIsLoading(false);
        return;
      }

      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error in notifications screen:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Enable Notifications</Text>
        <Text style={styles.subtitle}>Get reminders about your cycle phases and important updates</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={finishOnboarding}
          label={isLoading ? "Completing..." : "Enable notifications"}
          disabled={isLoading}
        />
        
        <ContinueButton 
          onPress={finishOnboarding}
          label="Not now"
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
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 