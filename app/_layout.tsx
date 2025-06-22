import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SmartProvider } from '../components/Context/AlarmContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SmartProvider>
        <Slot />
      </SmartProvider>
    </AuthProvider>
  );
}