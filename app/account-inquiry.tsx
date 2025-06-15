import { StyleSheet, View, Text } from 'react-native';

export default function InquiryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inquiry</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Contact Support</Text>
        <Text style={styles.placeholder}>For help, email support@sleepapp.com or use the in-app chat (coming soon).</Text>
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
  placeholder: {
    color: '#888',
    fontSize: 14,
    marginTop: 32,
  },
}); 