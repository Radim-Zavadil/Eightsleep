import { StyleSheet, View, Text } from 'react-native';

export default function GoalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Length Goal</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Your current goal:</Text>
        <Text style={styles.goal}>8 hours</Text>
        <Text style={styles.placeholder}>Goal editing coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101014',
    paddingTop: 60,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingTop: 16,
  },
  label: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 4,
  },
  goal: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    color: '#888',
    fontSize: 14,
    marginTop: 32,
  },
}); 