import { StyleSheet, View, Text, Switch } from 'react-native';
import { useState } from 'react';

export default function NotificationsScreen() {
  const [reminders, setReminders] = useState(true);
  const [news, setNews] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Reminders</Text>
          <Switch value={reminders} onValueChange={setReminders} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>App News</Text>
          <Switch value={news} onValueChange={setNews} />
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
  },
}); 