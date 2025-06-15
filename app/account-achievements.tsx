import { StyleSheet, View, Text } from 'react-native';

export default function AchievementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Achievements</Text>
      <View style={styles.content}>
        <Text style={styles.achievement}>🏆 7 Days Streak</Text>
        <Text style={styles.achievement}>🌙 8+ Hours Sleep</Text>
        <Text style={styles.achievement}>⏰ No Missed Alarms</Text>
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
  achievement: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
}); 