import { StyleSheet, View, Text } from 'react-native';

export default function PaymentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payments</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Payment Methods</Text>
        <Text style={styles.method}>Visa •••• 1234</Text>
        <Text style={styles.method}>Apple Pay</Text>
        <Text style={styles.placeholder}>Add/remove methods coming soon.</Text>
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
  method: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  placeholder: {
    color: '#888',
    fontSize: 14,
    marginTop: 32,
  },
}); 