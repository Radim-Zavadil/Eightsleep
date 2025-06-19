import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundImage from '../src/components/BackgroundImage';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CycleOne</Text>
        <Text style={styles.subtitle}>Track your cycles, understand your body, and take control of your reproductive health.</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding/email')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/login/email')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Login</Text>
        </TouchableOpacity>
      </View>
    </BackgroundImage>
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
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 48,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: 'white',
  },
}); 