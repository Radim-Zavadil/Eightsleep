import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundImage from '../components/BackgroundImage';

export default function WelcomeScreen({ navigation }) {
  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OnboardingEmail')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('LoginEmail')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 48 },
  button: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
    alignItems: 'center',
    width: 220,
  },
  buttonText: { color: 'black', fontWeight: 'bold', fontSize: 18 },
}); 