import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading, isOnboardingCompleted } = useAuth();

  if (loading) {
    return null; // Show splash screen while loading
  }

  return (
    <Stack>
      {!user ? (
        // User is not authenticated
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      ) : !isOnboardingCompleted ? (
        // User is authenticated but hasn't completed onboarding
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      ) : (
        // User is authenticated and has completed onboarding
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}