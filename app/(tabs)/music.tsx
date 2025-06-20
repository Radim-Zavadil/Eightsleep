import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RequireAuth from '../../components/RequireAuth';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function MusicScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Music</ThemedText>
      <ThemedText style={styles.subtitle}>Sleep sounds and relaxation</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
});
