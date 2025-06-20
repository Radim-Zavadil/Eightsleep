import { Slot } from 'expo-router';
import { useAuthListener } from '../hooks/useAuthListener';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  useAuthListener();
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}