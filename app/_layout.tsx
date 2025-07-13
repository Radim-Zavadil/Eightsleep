import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SmartProvider } from '../components/Context/AlarmContext';
import { BedroomScoreProvider } from '../components/Context/BedroomScoreContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SmartProvider>
        <BedroomScoreProvider>
          <Slot />
        </BedroomScoreProvider>
      </SmartProvider>
    </AuthProvider>
  );
}