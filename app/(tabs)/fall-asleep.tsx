import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/utils/supabase';

const OPTIONS = [
  { label: 'Immediately', value: 0 },
  { label: '5m', value: 5 },
  { label: '10m', value: 10 },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
];

const FallAsleepPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const sleptSeconds = params.slept ? parseInt(params.slept as string, 10) : undefined;
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (selected === null) return;
    setLoading(true);
    // Save to DB
    const session_id = await AsyncStorage.getItem('current_sleep_session_id');
    if (session_id) {
      await supabase
        .from('sleep_sessions')
        .update({
          fall_asleep_minutes: selected,
        })
        .eq('session_id', session_id);
    }
    // Remove session_id from storage (session is over)
    await AsyncStorage.removeItem('current_sleep_session_id');
    // Pass both slept and fall_asleep_minutes to sleep page
    router.replace({ pathname: '/sleep', params: { slept: sleptSeconds?.toString() || '', fall_asleep: selected.toString() } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Did you fall asleep immediately or not?</Text>
      <View style={styles.optionsRow}>
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.optionButton, selected === opt.value && styles.selectedOption]}
            onPress={() => setSelected(opt.value)}
            disabled={loading}
          >
            <Text style={[styles.optionText, selected === opt.value && styles.selectedOptionText]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextButton, selected === null && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={selected === null || loading}
      >
        <Text style={styles.nextButtonText}>{loading ? 'Saving...' : 'Next'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  question: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginHorizontal: 6,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#fff',
    borderColor: '#00E676',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#00E676',
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: '#00E676',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
    alignSelf: 'center',
    marginTop: 30,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default FallAsleepPage; 