import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function OnboardingLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#fff',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerTransparent: true,
        headerTitle: '',
      }}
    >
      <Stack.Screen name="email" />
      <Stack.Screen name="password" />
      <Stack.Screen name="dob" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="cycle-length" />
      <Stack.Screen name="cycle-regularity" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
} 