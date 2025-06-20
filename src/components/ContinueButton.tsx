import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ContinueButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
}

export default function ContinueButton({ onPress, label = "Continue", disabled = false }: ContinueButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: { 
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  textDisabled: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
}); 