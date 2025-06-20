import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function MainAppScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main App Content</Text>
      <Button title="Account" onPress={() => navigation.navigate('Account')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
}); 