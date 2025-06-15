import { StyleSheet, View, Text } from 'react-native';

export default function AccountDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Details</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>user@email.com</Text>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.value}>••••••••</Text>
        <Text style={styles.placeholder}>Edit functionality coming soon.</Text>
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
    paddingTop: 32,
  },
  label: {
    color: '#aaa',
    fontSize: 15,
    marginBottom: 4,
    marginTop: 18,
  },
  value: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    color: '#888',
    fontSize: 14,
    marginTop: 32,
  },
}); 