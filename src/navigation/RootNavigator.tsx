import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useAuth } from '../utils/useAuth';
import { useProfile } from '../utils/useProfile';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const { profile, profileLoading } = useProfile(user);

  if (loading || profileLoading) return null; // Splash screen or loading indicator

  if (!user) return <NavigationContainer><AuthStack /></NavigationContainer>;
  if (profile && !profile.onboarding_complete) return <NavigationContainer><OnboardingStack /></NavigationContainer>;
  return <NavigationContainer><AppStack /></NavigationContainer>;
} 