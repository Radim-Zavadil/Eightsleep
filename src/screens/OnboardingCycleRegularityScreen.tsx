import { supabase } from '@/utils/supabase';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingCycleRegularityScreen({ navigation }) {
  const saveAndContinue = async (value) => {
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ cycle_regularity: value }).eq('id', user.id);
    navigation.navigate('OnboardingGoal');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Are your cycles regular?</Text>
        <ContinueButton label="Yes" onPress={() => saveAndContinue('regular')} />
        <ContinueButton label="No" onPress={() => saveAndContinue('irregular')} />
        <ContinueButton label="I'm not sure" onPress={() => saveAndContinue('not sure')} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
}); 