import { supabase } from '@/utils/supabase';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingGoalScreen({ navigation }) {
  const saveAndContinue = async (value) => {
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ goal: value }).eq('id', user.id);
    navigation.navigate('OnboardingNotifications');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>What is your goal?</Text>
        <ContinueButton label="Track Cycles" onPress={() => saveAndContinue('track_cycles')} />
        <ContinueButton label="Track Pregnancy" onPress={() => saveAndContinue('track_pregnancy')} />
        <ContinueButton label="Get pregnant" onPress={() => saveAndContinue('get_pregnant')} />
        <ContinueButton label="I'm not sure" onPress={() => saveAndContinue('not sure')} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
}); 