
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Calendar } from 'react-native-calendars';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>CALENDAR</ThemedText>
        <Image 
          source={require('../../assets/images/infoIcon.svg')} 
          style={styles.infoIcon}
        />
      </View>
      <View style={styles.calendarContainer}>
        <View style={[styles.blurredCircle, { backgroundColor: '#7FB069' }]} />
        <Calendar
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: '#ffffff',
            selectedDayBackgroundColor: '#3C6E71',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#7FB069',
            dayTextColor: '#ffffff',
            textDisabledColor: '#444444',
            monthTextColor: '#ffffff',
            textMonthFontSize: 16,
            textDayFontSize: 14,
            textDayHeaderFontSize: 14,
          }}
          markedDates={{
            '2024-01-03': { selected: true },
          }}
          enableSwipeMonths={true}
        />
      </View>
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
  infoIcon: {
    width: 20,
    height: 20,
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  blurredCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.4,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
  },
});
