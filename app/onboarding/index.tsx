// @ts-nocheck
// This file is the entry point for the onboarding route in expo-router
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingStep1 from '../../components/Onboarding/OnboardingStep1';
import OnboardingStep2 from '../../components/Onboarding/OnboardingStep2';
import OnboardingStep3 from '../../components/Onboarding/OnboardingStep3';
import OnboardingStep4 from '../../components/Onboarding/OnboardingStep4';
import OnboardingStep5 from '../../components/Onboarding/OnboardingStep5';
import { OnboardingData } from '../../types/onboarding';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    dateOfBirth: null,
    weight: '',
    height: '',
    sportActivity: '',
    sleepGoal: 0,
  });

  const updateOnboardingData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            dateOfBirth={onboardingData.dateOfBirth}
            onDateChange={(date: Date) => updateOnboardingData('dateOfBirth', date)}
            onContinue={nextStep}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            weight={onboardingData.weight}
            onWeightChange={(weight: string) => updateOnboardingData('weight', weight)}
            onContinue={nextStep}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            height={onboardingData.height}
            onHeightChange={(height: string) => updateOnboardingData('height', height)}
            onContinue={nextStep}
          />
        );
      case 4:
        return (
          <OnboardingStep4
            sportActivity={onboardingData.sportActivity}
            onSportActivityChange={(activity: string) => updateOnboardingData('sportActivity', activity)}
            onContinue={nextStep}
          />
        );
      case 5:
        return (
          <OnboardingStep5
            onboardingData={onboardingData}
            onSleepGoalChange={(goal: number) => updateOnboardingData('sleepGoal', goal)}
            onComplete={() => {
              // This will be handled by the step component
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a', '#000000']}
      style={styles.container}
    >
      <View style={styles.content}>
        {renderStep()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
}); 