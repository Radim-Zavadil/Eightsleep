import { supabase } from '@/utils/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import BackgroundImage from '../../src/components/BackgroundImage';
import ContinueButton from '../../src/components/ContinueButton';

export default function OnboardingPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError);
          setIsCheckingSession(false);
          return;
        }

        if (session) {
          console.log('Found existing session, checking profile...');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error checking profile:', profileError);
            setIsCheckingSession(false);
            return;
          }

          if (profile) {
            console.log('Profile found, proceeding to DOB');
            router.replace('dob');
            return;
          }
        }
        setIsCheckingSession(false);
      } catch (err) {
        console.error('Error in session check:', err);
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleContinue = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, check if the user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        console.log('User already exists:', existingUser);
        // Try to sign in with the provided password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email as string,
          password: password
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          setError('Invalid password for existing account');
          setIsLoading(false);
          return;
        }

        // User exists and password is correct, proceed to DOB
        console.log('Successfully signed in existing user');
        router.replace({
          pathname: '/onboarding/dob'
        });
        return;
      }

      // Create the account with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email as string,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding/dob`
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (!signUpData?.user) {
        console.error('No user data returned from signup');
        setError('Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('User created successfully:', {
        userId: signUpData.user.id,
        email: signUpData.user.email,
        createdAt: signUpData.user.created_at
      });

      // Show confirmation message
      setError('Please check your email to confirm your account. After confirming, you will be redirected to continue setting up your profile.');
      setIsLoading(false);

      // Start polling for profile creation
      const checkProfile = async () => {
        if (!signUpData?.user?.id) {
          console.error('No user ID available for profile check');
          return false;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signUpData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking profile:', profileError);
          return false;
        }

        if (profile) {
          console.log('Profile found, signing in and proceeding to DOB');
          // Sign in the user
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email as string,
            password: password
          });

          if (signInError) {
            console.error('Sign in error:', signInError);
            return false;
          }

          router.replace({
            pathname: '/onboarding/dob'
          });
          return true;
        }

        return false;
      };

      // Poll every 2 seconds for up to 30 seconds
      let attempts = 0;
      const maxAttempts = 15;
      const pollInterval = setInterval(async () => {
        attempts++;
        const success = await checkProfile();
        if (success || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (attempts >= maxAttempts) {
            setError('Profile creation timed out. Please try signing in again.');
          }
        }
      }, 2000);

    } catch (err) {
      console.error('Error in password screen:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <BackgroundImage>
        <View style={styles.container}>
          <Text style={styles.title}>Checking session...</Text>
        </View>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <View style={styles.container}>
        <Text style={styles.title}>Create a password</Text>
        <Text style={styles.subtitle}>Choose a strong password to protect your account</Text>
        
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <ContinueButton 
          onPress={handleContinue}
          label={isLoading ? "Creating Account..." : "Continue"}
          disabled={isLoading}
        />
      </View>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  error: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
}); 