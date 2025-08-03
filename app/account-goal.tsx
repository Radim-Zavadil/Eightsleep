import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '../utils/supabase';
import { getSleepGoalFromBirthdate } from '../utils/getSleepGoalFromBirthdate';

interface Profile {
  id: string;
  date_of_birth: string;
}

export default function GoalScreen() {
  const [sleepGoal, setSleepGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSleepGoal = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSleepGoal('Unknown');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from<Profile>('profiles')
        .select('date_of_birth')
        .eq('id', user.id)
        .single();

      if (error || !data?.date_of_birth) {
        setSleepGoal('Unknown');
      } else {
        const goal = getSleepGoalFromBirthdate(data.date_of_birth);
        setSleepGoal(goal);
      }

      setLoading(false);
    };

    fetchSleepGoal();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Length Goal</Text>
      <View style={styles.content}>
        <Text style={styles.label}>Your current goal:</Text>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.goal}>{sleepGoal}</Text>
        )}
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
