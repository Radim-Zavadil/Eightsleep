import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingCycleRegularityScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        .update({ cycle_regularity: value })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating cycle regularity:', updateError);
        setError('Failed to save cycle regularity. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push({
        pathname: '/onboarding/goal'
      });
    } catch (err) {
      console.error('Error in cycle regularity screen:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Are your sleeping regular?</Text>
        <Text style={styles.subtitle}>This helps us provide more accurate predictions</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={() => handleContinue('regular')}
          label="Yes, they're regular"
          disabled={isLoading}
        />
        
        <ContinueButton 
          onPress={() => handleContinue('irregular')}
          label="No, they're irregular"
          disabled={isLoading}
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
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 