import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RequireAuth from '../../components/RequireAuth';

export default function MusicScreen() {
  return (
    <RequireAuth>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Music</ThemedText>
      </ThemedView>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
