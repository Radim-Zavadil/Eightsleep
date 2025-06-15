import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DayProgressRings from '@/components/DayProgressRings';
import React, { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// Helper to format date as yyyy-mm-dd
const formatDate = (date: Date) => date.toISOString().split('T')[0];

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

  // Always scroll to the week containing today when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (monthListRef.current && initialMonthIndex > 0) {
        setTimeout(() => {
          const offset = initialMonthIndex * 370 + initialWeekIndex * 470;
          monthListRef.current?.scrollToOffset({ offset, animated: false });
        }, 150);
      }
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
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
                  const isThisWeek = weekDates.includes(key);
                  const isToday = key === formatDate(today);
                  const isFuture = date > today;
                  return (
                    <View key={di} style={styles.dayCell}>
                      <DayProgressRings
                        sleepLength={isThisWeek ? Math.random() : 0}
                        bedroomScore={isThisWeek ? Math.random() : 0}
                        overallScore={isThisWeek ? Math.random() : 0}
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
});
