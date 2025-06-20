import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ phone }).eq('id', user.id);
    navigation.navigate('OnboardingCycleLength');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ContinueButton onPress={handleContinue} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  input: { backgroundColor: '#ffffff33', borderRadius: 12, width: '100%', padding: 16, color: 'white', fontSize: 18, marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
}); 