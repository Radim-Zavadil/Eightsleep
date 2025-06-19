import { supabase } from '@/utils/supabase';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingNotificationsScreen({ navigation }) {
  const finishOnboarding = async () => {
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
    navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>INSTANT NOTIFICATIONS</Text>
        <Text style={styles.subtitle}>Get instant payment notifications as you spend with your card and know your balance is always up to date</Text>
        <ContinueButton label="Enable push notifications" onPress={finishOnboarding} />
        <ContinueButton label="Not now" onPress={finishOnboarding} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { color: 'white', fontSize: 16, marginBottom: 32, textAlign: 'center' },
}); 