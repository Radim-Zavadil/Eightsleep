import { supabase } from '@/utils/supabase';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function AccountScreen({ navigation }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  return (
    <View style={styles.container}>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}); 