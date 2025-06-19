import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingCycleLengthScreen({ navigation }) {
  const [cycleLength, setCycleLength] = useState('');
  const [error, setError] = useState('');

  const saveAndContinue = async (value) => {
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ cycle_length: value }).eq('id', user.id);
    navigation.navigate('OnboardingCycleRegularity');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>What is your average length of a cycle?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 28"
          value={cycleLength}
          onChangeText={setCycleLength}
          keyboardType="number-pad"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ContinueButton onPress={() => saveAndContinue(cycleLength)} />
        <ContinueButton label="I'm not sure" onPress={() => saveAndContinue('not sure')} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { backgroundColor: '#ffffff33', borderRadius: 12, width: '100%', padding: 16, color: 'white', fontSize: 18, marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
}); 