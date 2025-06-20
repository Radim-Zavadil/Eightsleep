import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null;
  
  if (user) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/welcome" />;
} 