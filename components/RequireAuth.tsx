import { useAuth } from '../context/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    return <Redirect href="/welcome" />;
  }
  return <>{children}</>;
} 