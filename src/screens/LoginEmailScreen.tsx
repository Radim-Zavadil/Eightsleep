import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function LoginEmailScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [exists, setExists] = useState(false);
  const [error, setError] = useState('');

  const checkEmail = async () => {
    const { data, error } = await supabase.from('profiles').select('id').eq('email', email).single();
    if (data) {
      setExists(true);
      setError('');
      navigation.navigate('LoginPassword', { email });
    } else {
      setExists(false);
      setError('Account not found');
    }
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={[styles.input, exists ? styles.inputExists : null]}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ContinueButton onPress={checkEmail} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  input: { backgroundColor: '#ffffff33', borderRadius: 12, width: '100%', padding: 16, color: 'white', fontSize: 18, marginBottom: 16 },
  inputExists: { borderColor: 'green', borderWidth: 2 },
  error: { color: 'red', marginBottom: 8 },
}); 