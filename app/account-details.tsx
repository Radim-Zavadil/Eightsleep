import { StyleSheet, View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../src/utils/useProfile';

export default function AccountDetailsScreen() {
  const { user, loading } = useAuth();
  const { profile, profileLoading } = useProfile(user);

  if (loading || profileLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 60 }} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Account Details</Text>
        <Text style={[styles.value, { marginTop: 32 }]}>No profile data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Account Details</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>
        {profile.phone && (
          <>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </>
        )}
        {profile.dob && (
          <>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{profile.dob}</Text>
          </>
        )}
        {profile.cycle_length !== undefined && profile.cycle_length !== null && (
          <>
            <Text style={styles.label}>Cycle Length</Text>
            <Text style={styles.value}>{profile.cycle_length}</Text>
          </>
        )}
        {profile.cycle_regularity && (
          <>
            <Text style={styles.label}>Cycle Regularity</Text>
            <Text style={styles.value}>{profile.cycle_regularity}</Text>
          </>
        )}
        {profile.goal && (
          <>
            <Text style={styles.label}>Goal</Text>
            <Text style={styles.value}>{profile.goal}</Text>
          </>
        )}
        <Text style={styles.placeholder}>Edit functionality coming soon.</Text>
      </View>
    </ScrollView>
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