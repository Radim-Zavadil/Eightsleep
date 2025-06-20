import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const { user, error } = await supabase.auth.signUp({ email, password: 'temp1234' });
    if (error) {
      setError(error.message);
      return;
    }
    navigation.navigate('OnboardingPassword', { email });
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
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