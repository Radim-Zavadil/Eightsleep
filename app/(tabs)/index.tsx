import { StyleSheet, View, Image, ScrollView, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { CoffeeTimer } from '@/components/CoffeeTimer';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.yesterdayText}>YESTERDAY</ThemedText>
        <View style={styles.centerContent}>
          <ThemedText style={styles.todayText}>TODAY</ThemedText>
          <Image 
            source={require('../../assets/images/icons/ArrowDown.svg')}
            style={styles.arrowIcon}
          />
        </View>
        <Link href="/calendar" style={styles.circleContainer}>
          <View style={styles.circle}>
            <ThemedText style={styles.circleText}>3</ThemedText>
          </View>
        </Link>
      </View>
      <CoffeeTimer />
      <ScrollView style={styles.sectionsContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>SLEEP</ThemedText>
            <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowRight} />
          </View>
          <View style={[styles.sleepContent, { backgroundColor: 'rgba(5, 29, 13, 0.6)' }]}>
            <View style={[styles.blurredCircle, { backgroundColor: '#1F9950' }]} />
            <View style={styles.sectionBadge}>
              <Text style={styles.badgeText}>SLEEP</Text>
            </View>
            <Text style={styles.scoreNumber}>84</Text>
            <View style={styles.trophyContainer}>
              <Image source={require('../../assets/images/Trophy.svg')} style={styles.trophyIcon} />
              <Text style={styles.trophyText}>Highest in last 7 days</Text>
            </View>
            <View style={styles.sleepTimeContainer}>
              <Text style={styles.timeText}>22:00</Text>
              <Text style={styles.timeText}>10:00</Text>
            </View>
            <Text style={styles.sleepDescription}>Optimal deep sleep for physical Recovery</Text>
            <Text style={styles.sleepSubDescription}>Higher deep sleep helps with physical recovery and immune system health.</Text>
            <View style={styles.metricsBox}>
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>SLEEP DURATION</Text>
                <View style={styles.durationValue}>
                  <Text style={styles.durationNumber}>7h 11m</Text>
                  <Image source={require('../../assets/images/GreenCheck.svg')} style={styles.checkIcon} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>RECOVERY</ThemedText>
            <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowRight} />
          </View>
          <View style={[styles.recoveryContent, { backgroundColor: 'rgba(29, 19, 0, 0.6)' }]}>
            <View style={[styles.blurredCircle, { backgroundColor: '#6B4312' }]} />
            <View style={styles.sectionBadge}>
              <Text style={styles.badgeText}>RECOVERY</Text>
            </View>
            <Text style={[styles.scoreNumber, { color: '#FFB800', textShadowColor: 'rgba(255, 184, 0, 0.3)' }]}>50</Text>
            <View style={styles.metricsContainer}>
              <Text style={styles.metricsText}>1/5</Text>
              <Text style={styles.metricsSubText}>metrics within range</Text>
            </View>
            <View style={styles.metricsBox}>
              <View style={styles.indicatorRow}>
                <Image source={require('../../assets/images/Temperature.svg')} style={styles.indicatorIcon} />
                <Text style={[styles.indicatorText, { marginLeft: 8 }]}>Temp</Text>
                <Image source={require('../../assets/images/GreenCheck.svg')} style={[styles.indicatorCheck, { marginLeft: 'auto' }]} />
              </View>
              <View style={styles.indicatorRow}>
                <Image source={require('../../assets/images/Sun.svg')} style={styles.indicatorIcon} />
                <Text style={[styles.indicatorText, { marginLeft: 8 }]}>Darkness</Text>
                <Image source={require('../../assets/images/GreenCheck.svg')} style={[styles.indicatorCheck, { marginLeft: 'auto' }]} />
              </View>
              <View style={styles.indicatorRow}>
                <Image source={require('../../assets/images/CoffeeBeans.svg')} style={styles.indicatorIcon} />
                <Text style={[styles.indicatorText, { marginLeft: 8 }]}>Caffeine</Text>
                <Image source={require('../../assets/images/Attention.svg')} style={[styles.indicatorCheck, { marginLeft: 'auto' }]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>JOURNAL</ThemedText>
            <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowRight} />
          </View>
          <View style={[styles.journalContent, { backgroundColor: 'rgba(0, 10, 29, 0.6)' }]}>
            <View style={[styles.blurredCircle, { backgroundColor: '#1B3366' }]} />
            <View style={styles.sectionBadge}>
              <Text style={styles.badgeText}>JOURNAL</Text>
            </View>
            <Text style={[styles.scoreNumber, styles.journalNumber]}>95</Text>
            <Text style={styles.journalText}>Relaxed</Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timeline} />
              <View style={styles.timeMarker} />
              <View style={styles.timeLabels}>
                <Text style={styles.timeLabel}>22:00</Text>
                <Text style={styles.timeLabel}>23:00</Text>
                <Text style={styles.timeLabel}>00:00</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>SOCIAL JETLAG · LAST WEEK</ThemedText>
            <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowRight} />
          </View>
          <View style={[styles.jetlagContent, { alignItems: 'center', backgroundColor: 'rgba(15, 15, 15, 0.6)' }]}>
            <View style={[styles.blurredCircle, { backgroundColor: '#664B12' }]} />
            <View style={styles.sectionBadge}>
              <Text style={styles.badgeText}>SOCIAL JETLAG</Text>
            </View>
            <View style={styles.jetlagHeader}>
              <Text style={styles.jetlagTime}>40m</Text>
              <Image source={require('../../assets/images/Attention.svg')} style={styles.jetlagIcon} />
            </View>
            <Text style={[styles.jetlagType, { textAlign: 'center' }]}>Late Weekend Sleeper</Text>
            <Text style={[styles.jetlagDescription, { textAlign: 'center' }]}>You stay up late during weekdays but sleep longer to make up for it. It's like starting your week in Mumbai, but your body sometimes drifts into Dubai time.</Text>
            <Text style={[styles.jetlagCalibrating, { textAlign: 'center' }]}>This week's jetlag calibrating in 7 days</Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  yesterdayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    transform: [{ translateX: -40 }],
    position: 'absolute',
    left: 20,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  todayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  circleContainer: {
    position: 'absolute',
    right: 20,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sectionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    width: 400,
    backgroundColor: '#0F0F0F',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  sectionBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
  metricsBox: {
    backgroundColor: 'rgba(13, 13, 13, 0.12)',
    borderRadius: 5,
    padding: 16,
    marginTop: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  arrowRight: {
    width: 24,
    height: 24,
  },
  sleepContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '600',
    color: '#00FF75',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 255, 117, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  trophyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 24,
  },
  trophyIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  trophyText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  sleepTimeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.6,
  },
  sleepDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  sleepSubDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  durationContainer: {
    alignItems: 'center',
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  durationValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  recoveryContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  recoveryNumber: {
    color: '#FFB800',
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  metricsText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 4,
  },
  metricsSubText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.6,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  indicator: {
    alignItems: 'center',
  },
  indicatorIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 8,
  },
  indicatorCheck: {
    width: 16,
    height: 16,
  },
  journalContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  journalNumber: {
    color: '#FFFFFF',
  },
  journalText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 24,
  },
  timelineContainer: {
    width: '100%',
    paddingHorizontal: 40,
  },
  timeline: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  timeMarker: {
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: '50%',
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.6,
  },
  jetlagContent: {
    padding: 24,
  },
  jetlagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jetlagTime: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '600',
    marginRight: 8,
  },
  jetlagIcon: {
    width: 24,
    height: 24,
  },
  jetlagType: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  jetlagDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
    lineHeight: 20,
  },
  jetlagCalibrating: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.4,
  },
});