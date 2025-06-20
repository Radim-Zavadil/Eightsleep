import { supabase } from '@/utils/supabase';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';
import ContinueButton from '../components/ContinueButton';

export default function OnboardingDOBScreen({ navigation }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!day || !month || !year) {
      setError('Please fill all fields');
      return;
    }
    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    // Save to Supabase profile
    const user = supabase.auth.user();
    await supabase.from('profiles').update({ dob }).eq('id', user.id);
    navigation.navigate('OnboardingPhone');
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Date of birth</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Day"
            value={day}
            onChangeText={setDay}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Month"
            value={month}
            onChangeText={setMonth}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ContinueButton onPress={handleContinue} />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { width: '80%', alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  input: { backgroundColor: '#ffffff33', borderRadius: 12, width: '30%', padding: 16, color: 'white', fontSize: 18, textAlign: 'center' },
  error: { color: 'red', marginBottom: 8 },
}); 