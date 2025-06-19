import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="email" />
      <Stack.Screen name="password" />
    </Stack>
  );
} 