import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingPasswordScreen({ navigation, route }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { email } = route.params || {};

  const handleContinue = async () => {
    if (password.length !== 6) {
      setError('Passcode must be 6 digits');
      return;
    }
    // Update password in Supabase
    const { error } = await supabase.auth.update({ password });
    if (error) {
      setError(error.message);
      return;
    }
    navigation.navigate('OnboardingDOB');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Create passcode</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          value={password}
          onChangeText={setPassword}
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
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
  input: { backgroundColor: '#ffffff33', borderRadius: 12, width: '100%', padding: 16, color: 'white', fontSize: 24, marginBottom: 16, textAlign: 'center', letterSpacing: 16 },
  error: { color: 'red', marginBottom: 8 },
}); 