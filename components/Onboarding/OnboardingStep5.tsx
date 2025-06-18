import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';
import { OnboardingStep5Props } from '../../types/onboarding';

export default function OnboardingStep5({ onboardingData, onSleepGoalChange, onComplete }: OnboardingStep5Props) {
  const [customSleepGoal, setCustomSleepGoal] = useState('');
  const [useCustomGoal, setUseCustomGoal] = useState(false);
  const [calculatedGoal, setCalculatedGoal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, setIsOnboardingCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    calculateOptimalSleep();
  }, []);

  const calculateOptimalSleep = () => {
    if (!onboardingData.dateOfBirth) return;

    const today = new Date();
    const age = today.getFullYear() - onboardingData.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - onboardingData.dateOfBirth.getMonth();
    
    let adjustedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < onboardingData.dateOfBirth.getDate())) {
      adjustedAge--;
    }

    // Base sleep calculation based on age
    let baseSleep = 8; // Default for adults
    
    if (adjustedAge < 18) {
      baseSleep = 9; // Teenagers need more sleep
    } else if (adjustedAge > 65) {
      baseSleep = 7; // Elderly may need less sleep
    }

    // Adjust based on sport activity
    let activityAdjustment = 0;
    switch (onboardingData.sportActivity) {
      case 'Yes':
        activityAdjustment = 0.5; // Active people may need more sleep
        break;
      case 'Sometimes':
        activityAdjustment = 0.25;
        break;
      case 'No':
        activityAdjustment = 0;
        break;
    }

    const calculated = Math.round((baseSleep + activityAdjustment) * 10) / 10;
    setCalculatedGoal(calculated);
    onSleepGoalChange(calculated);
  };

  const handleCustomGoalChange = (value: string) => {
    setCustomSleepGoal(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onSleepGoalChange(numValue);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    const finalSleepGoal = useCustomGoal ? parseFloat(customSleepGoal) : calculatedGoal;
    
    if (useCustomGoal && (!customSleepGoal || parseFloat(customSleepGoal) <= 0)) {
      Alert.alert('Error', 'Please enter a valid sleep goal');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          date_of_birth: onboardingData.dateOfBirth?.toISOString().split('T')[0],
          weight: parseFloat(onboardingData.weight),
          height: parseFloat(onboardingData.height),
          sport_activity: onboardingData.sportActivity,
          sleep_goal_hours: finalSleepGoal,
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', 'Failed to save onboarding data');
        return;
      }

      setIsOnboardingCompleted(true);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Optimal Sleep Goal</Text>
        <Text style={styles.subtitle}>
          Based on your profile, we recommend {calculatedGoal} hours of sleep per night
        </Text>
      </View>

      <View style={styles.goalContainer}>
        <View style={styles.calculatedGoalContainer}>
          <Text style={styles.goalLabel}>Recommended:</Text>
          <Text style={styles.calculatedGoal}>{calculatedGoal} hours</Text>
        </View>

        <TouchableOpacity
          style={styles.customToggle}
          onPress={() => setUseCustomGoal(!useCustomGoal)}
        >
          <Text style={styles.customToggleText}>
            {useCustomGoal ? 'Use recommended goal' : 'Set custom goal'}
          </Text>
        </TouchableOpacity>

        {useCustomGoal && (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              value={customSleepGoal}
              onChangeText={handleCustomGoalChange}
              placeholder="Enter your sleep goal"
              placeholderTextColor="#666"
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.unit}>hours</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, loading && styles.continueButtonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.continueButtonText}>
          {loading ? 'Saving...' : 'Complete Setup'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter',
  },
  goalContainer: {
    marginBottom: 48,
  },
  calculatedGoalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  calculatedGoal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Inter',
  },
  customToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    marginBottom: 20,
  },
  customToggleText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customInput: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter',
  },
  unit: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  continueButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
}); 