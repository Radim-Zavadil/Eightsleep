import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DayProgressRings from '@/components/DayProgressRings';
import React, { useRef, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '@/utils/supabase'; // Adjust path to your supabase client
import { useAuth } from '../../src/utils/useAuth';
import { calculateSleepScore } from '../../src/utils/calculateSleepScore';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Helper to format date as yyyy-mm-dd
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Types for our data
interface DayData {
  sleepScore: number; // 0-1 (0-100%) - calculated from sleep duration, bedroom score, journal entries
  bedroomScore: number; // 0-1 (0-100%) - calculated from checks
  journalEntries: number; // 0-1 (0% or 100%) - 1+ entries = 100%
}

interface SleepSession {
  start_time: string;
  end_time: string;
  duration?: number;
}

interface Check {
  id: number;
  user_id: string;
  rule_name: string;
  goal: string;
  checked: boolean;
  created_at: string;
  date: string;
}

interface JournalEntry {
  entry_id: number;
  date: string;
  text_content: string;
  created_at: string;
  profile_id: string;
}

// Dummy data for this week
const today = new Date();
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Monday start
const weekDates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(weekStart);
  d.setDate(weekStart.getDate() + i);
  return formatDate(d);
});

// Generate months from 2 years ago to 2 years in the future
const monthsBefore = 24;
const monthsAfter = 24;
const totalMonths = monthsBefore + monthsAfter + 1;
const startMonth = new Date(today.getFullYear(), today.getMonth() - monthsBefore, 1);

function getMonthMatrix(year: number, month: number) {
  // Returns a 2D array (weeks x days) for the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();
  const matrix = [];
  let week = [];
  // Find the weekday index for the first day (Monday=0)
  let startIdx = (firstDay.getDay() + 6) % 7;
  // Fill initial empty days
  for (let i = 0; i < startIdx; i++) week.push(null);
  for (let d = 1; d <= numDays; d++) {
    const date = new Date(year, month, d);
    week.push(date);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  // Fill trailing empty days
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

const months = Array.from({ length: totalMonths }, (_, i) => {
  const d = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
  const year = d.getFullYear();
  const month = d.getMonth();
  const matrix = getMonthMatrix(year, month);
  return {
    key: `${year}-${month}`,
    year,
    month,
    matrix,
    // Always use English month names
    label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
  };
});

// Find the month and week index for today
const todayMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
const initialMonthIndex = months.findIndex(m => m.key === todayMonthKey);
let initialWeekIndex = 0;
if (initialMonthIndex !== -1) {
  const matrix = months[initialMonthIndex].matrix;
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].some(date => date && formatDate(date) === formatDate(today))) {
      initialWeekIndex = i;
      break;
    }
  }
}

export default function CalendarScreen() {
  const monthListRef = useRef<FlatList>(null);
  const [dayDataMap, setDayDataMap] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Helper function to calculate sleep duration from sleep session
  const calculateSleepDuration = (session: SleepSession): number => {
    if (session.duration) {
      return session.duration;
    }
    if (session.start_time && session.end_time) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    }
    return 0;
  };

  // Helper function to calculate bedroom score from bedroom checklist items
  const calculateBedroomScore = (bedroomItemsForDay: Check[]): number => {
    if (bedroomItemsForDay.length === 0) return 0;
    
    // Calculate bedroom score exactly like in your bedroom.tsx:
    // percentage of checked rules
    const checkedItems = bedroomItemsForDay.filter(item => item.checked);
    const score = (checkedItems.length / bedroomItemsForDay.length) * 100;
    
    // Return as 0-1 for the calendar (since DayProgressRings expects 0-1)
    return score / 100;
  };

  // Function to fetch all data from Supabase and calculate scores
  const fetchCalendarData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Calculate date range for fetching (from 2 years ago to 2 years in future)
      const startDate = new Date(today.getFullYear() - 2, 0, 1);
      const endDate = new Date(today.getFullYear() + 2, 11, 31);
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);

      // Fetch sleep sessions
      const { data: sleepSessions, error: sleepError } = await supabase
        .from('sleep_sessions')
        .select('start_time, end_time, duration')
        .eq('profile_id', user.id)
        .not('end_time', 'is', null)
        .gte('end_time', startDateStr)
        .lte('end_time', endDateStr);

      if (sleepError) throw sleepError;

      // Fetch bedroom checklist items for bedroom score calculation
      const { data: bedroomChecklistItems, error: checksError } = await supabase
        .from('bedroom_checklist_items')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (checksError) throw checksError;

      // Fetch journal entries
      const { data: journalEntries, error: journalsError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('profile_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (journalsError) throw journalsError;

      // Process the data by day
      const dataMap: Record<string, DayData> = {};

      // Group sleep sessions by day (based on end_time)
      const sleepByDay: Record<string, SleepSession[]> = {};
      sleepSessions?.forEach((session: SleepSession) => {
        const endDate = new Date(session.end_time);
        const dayKey = formatDate(endDate);
        if (!sleepByDay[dayKey]) sleepByDay[dayKey] = [];
        sleepByDay[dayKey].push(session);
      });

      // Group bedroom checklist items by day
      const bedroomItemsByDay: Record<string, Check[]> = {};
      bedroomChecklistItems?.forEach((item: Check) => {
        const dayKey = item.date; // Use the date column directly since it's in YYYY-MM-DD format
        if (!bedroomItemsByDay[dayKey]) bedroomItemsByDay[dayKey] = [];
        bedroomItemsByDay[dayKey].push(item);
      });

      // Group journal entries by day
      const journalsByDay: Record<string, JournalEntry[]> = {};
      journalEntries?.forEach((entry: JournalEntry) => {
        const dayKey = entry.date; // Use the date column directly since it's in YYYY-MM-DD format
        if (!journalsByDay[dayKey]) journalsByDay[dayKey] = [];
        journalsByDay[dayKey].push(entry);
      });

      // Calculate scores for each day
      const allDates = new Set([
        ...Object.keys(sleepByDay),
        ...Object.keys(bedroomItemsByDay),
        ...Object.keys(journalsByDay)
      ]);

      allDates.forEach(dayKey => {
        const sleepSessionsForDay = sleepByDay[dayKey] || [];
        const bedroomItemsForDay = bedroomItemsByDay[dayKey] || [];
        const journalsForDay = journalsByDay[dayKey] || [];

        // Calculate sleep duration (take the latest session for the day)
        const latestSleepSession = sleepSessionsForDay
          .sort((a, b) => new Date(b.end_time).getTime() - new Date(a.end_time).getTime())[0];
        
        const sleepDurationHours = latestSleepSession ? calculateSleepDuration(latestSleepSession) : 0;

        // Calculate bedroom score from bedroom checklist items
        const bedroomScore = calculateBedroomScore(bedroomItemsForDay);

        // Calculate journal entries score (1+ entries = 100%)
        const journalEntriesScore = journalsForDay.length > 0 ? 1 : 0;

        // Calculate overall sleep score using your existing function
        const sleepScore = calculateSleepScore({
          sleepDurationHours,
          bedroomScore,
          journalEntries: journalsForDay.length,
          periodDays: 1
        });

        dataMap[dayKey] = {
          sleepScore: sleepScore / 100, // Convert from 0-100 to 0-1
          bedroomScore,
          journalEntries: journalEntriesScore,
        };
      });

      setDayDataMap(dataMap);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when screen is focused
  useEffect(() => {
    fetchCalendarData();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      // Refetch data when screen is focused
      fetchCalendarData();
      
      // Scroll to current week
      if (monthListRef.current && initialMonthIndex > 0) {
        setTimeout(() => {
          const offset = initialMonthIndex * 370 + initialWeekIndex * 470;
          monthListRef.current?.scrollToOffset({ offset, animated: false });
        }, 150);
      }
    }, [user])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Calendar</ThemedText>
      <ThemedText style={styles.subtitle}>Track your sleep patterns over time</ThemedText>
      <View style={styles.header}>
        <ThemedText style={styles.title}>CALENDAR</ThemedText>
      </View>
      {/* Static weekday header */}
      <View style={styles.staticWeekdaysRow}>
        {WEEKDAYS.map((wd, i) => (
          <ThemedText key={i} style={styles.weekday}>{wd}</ThemedText>
        ))}
      </View>
      <FlatList
        ref={monthListRef}
        data={months}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: month }) => (
          <View style={styles.monthSection}>
            <ThemedText style={styles.monthLabel}>{month.label}</ThemedText>
            {month.matrix.map((week: (Date|null)[], wi: number) => (
              <View key={wi} style={styles.weekRow}>
                {week.map((date: Date|null, di: number) => {
                  if (!date) {
                    return <View key={di} style={styles.dayCell} />;
                  }
                  
                  const key = formatDate(date);
                  const isToday = key === formatDate(today);
                  const isFuture = date > today;
                  
                  // Get data for this day, default to 0 if no data
                  const dayData = dayDataMap[key] || { sleepScore: 0, bedroomScore: 0, journalEntries: 0 };
                  
                  return (
                    <View key={di} style={styles.dayCell}>
                      <DayProgressRings
                        sleepLength={dayData.journalEntries} // Journal entries (0 or 1)
                        bedroomScore={dayData.bedroomScore} // Calculated from checks
                        overallScore={dayData.sleepScore} // Calculated sleep score
                        isFuture={isFuture}
                        isToday={isToday}
                        size={40}
                      />
                      <ThemedText style={styles.dayLabel}>{date.getDate()}</ThemedText>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  staticWeekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  monthSection: {
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  monthLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    alignSelf: 'center',
  },
  weekdaysRow: {
    display: 'none', // Hide old per-month weekday row
  },
  weekday: {
    color: '#aaa',
    fontSize: 13,
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  dayCell: {
    alignItems: 'center',
    width: 40,
    marginHorizontal: 1,
    marginVertical: 2,
  },
  dayLabel: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
});