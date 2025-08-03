import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Image, ScrollView, Text, ImageBackground, Dimensions, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BlurView } from "expo-blur";
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

//components
import CircadianTimer from '../../components/CircadianTimer';
import * as d3Shape from 'd3-shape';
import SleepSection from '../../components/SleepSection';
import RecoverySection from '../../components/RecoverySection';
import SocialJetLegSection from '../../components/SocialJetLegSection';
import CaffeineWindowsSection from '@/components/CaffeineWindows';
import JournalSection from '@/components/JournalSection';
import NsdrComponent from '@/components/NSDR';

import GradientText from '@/components/ui/GradientText';
import Widgets from "@/components/Widgets";
import HalfCircleProgress from "@/components/HalfCircleProgress"; // Import the component
import SleepDebtComponent from '../../components/SocialJetLegSection';
import SmartAlarmCard from '@/components/SmartAlarm';

import { supabase } from '@/utils/supabase';
import { useAuth } from '../../src/utils/useAuth';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


//appearing
import { useCaffeineContext } from '@/components/Context/CaffeineContext';
import { useScreenContext } from '@/components/Context/ScreenContext';
import { useCircadianContext } from '@/components/Context/CircadianContext';
import { useSmartContext } from '@/components/Context/AlarmContext';
import { useBedroomScore } from '@/components/Context/BedroomScoreContext';
import { useJournalContext } from '@/context/JournalContext';
import { calculateSleepScore } from '../../src/utils/calculateSleepScore';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  //Caffeine windows opening
  const { showCaffeineWidget } = useCaffeineContext();
  const { showScreenWidget } = useScreenContext();
  const { showCircadianWidget } = useCircadianContext();
  const { showSmartWidget } = useSmartContext();
  const { score: bedroomScore } = useBedroomScore();
  const { entries, getDailyEntryCounts } = useJournalContext();

  const [sleepLength, setSleepLength] = useState<string>('N/A');

  useEffect(() => {
    async function fetchSleepSession() {
      if (!user) return;
      const { data, error } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('profile_id', user.id)
        .not('end_time', 'is', null)
        .order('end_time', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        let duration = data[0].duration;
        if (!duration && data[0].start_time && data[0].end_time) {
          const start = new Date(data[0].start_time);
          const end = new Date(data[0].end_time);
          duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }
        if (duration) {
          const hours = Math.floor(duration);
          const minutes = Math.round((duration - hours) * 60);
          setSleepLength(`${hours} h ${minutes} m`);
        }
      }
    }
    fetchSleepSession();
  }, [user]);

  // Add this function to handle sleep session logging
  const handleStartSleeping = async () => {
    if (!user) {
      Alert.alert('Not logged in', 'You must be logged in to start a sleep session.');
      return;
    }
    const now = new Date();
    const { data, error } = await supabase
      .from('sleep_sessions')
      .insert({
        profile_id: user.id,
        start_time: now.toISOString(),
      })
      .select('session_id')
      .single();
    if (error || !data) {
      Alert.alert('Error', error?.message || 'Failed to start sleep session.');
      return;
    }
    // Save session_id for later update
    await AsyncStorage.setItem('current_sleep_session_id', data.session_id);
    router.push('./start-sleeping');
  };

  // Calculate sleep duration in hours from sleepLength string
  function parseSleepLengthToHours(sleepLength: string): number {
    if (!sleepLength || sleepLength === 'N/A') return 0;
    const match = sleepLength.match(/(\d+)\s*h\s*(\d+)?/);
    if (!match) return 0;
    const hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    return hours + minutes / 60;
  }

  // Get journal entries in the last 7 days
  function getJournalEntriesLast7Days(): number {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6); // include today
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= sevenDaysAgo && entryDate <= now;
    }).length;
  }

  const sleepDurationHours = parseSleepLengthToHours(sleepLength);
  const journalEntriesLast7Days = getJournalEntriesLast7Days();
  const sleepScore = calculateSleepScore({
    sleepDurationHours,
    bedroomScore,
    journalEntries: journalEntriesLast7Days,
    periodDays: 7
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.yesterdayText}>YESTERDAY</ThemedText>
        
        <View style={styles.centerContent}>
          <ThemedText style={styles.todayText}>TODAY</ThemedText>
          <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_697_13817)">
          <path d="M1 1L6.68966 7L12 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
          <filter id="filter0_i_697_13817" x="0" y="0" width="13" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="0.35"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.72 0"/>
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_697_13817"/>
          </filter>
          </defs>
          </svg>
        </View>
        <Link href="/calendar" style={styles.circleContainer}>
          <View style={styles.circle}>
            <ThemedText style={styles.circleText}>3</ThemedText>
          </View>
        </Link>
      </View>
      <Widgets />
      <ScrollView style={styles.sectionsContainer}>

        {/**SLEEP SECTION */}
        <SleepSection sleepLength={sleepLength} score={sleepScore} />

        {/*SLEEP DEBT */}
        <SleepDebtComponent />


        {/**SMART ALARM */}
        {showSmartWidget && <SmartAlarmCard />}
        
        
        {/**RECOVERY SECTION */}
        <RecoverySection score={bedroomScore} />

        
        <NsdrComponent score={sleepScore} />
      
        {/**JOURNAL */}
        <JournalSection />
        
        {/*CIRCADIAN RHYTHM */}
        {showCircadianWidget && <CircadianTimer />}
        

        {/*CAFFEINE WINDOWS */}
        {showCaffeineWidget && <CaffeineWindowsSection />}
        
        <View style={styles.quickStartContainer}>
          <ThemedText style={styles.quickStartTitle}>Quick start</ThemedText>
          <View style={styles.quickStartButtons}>
            <TouchableOpacity 
              style={styles.quickStartButton}
              onPress={() => router.push('/breathwork')}
            >
              <ThemedText style={styles.quickStartButtonText}>Breathwork</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickStartButton}
              onPress={() => {
                handleStartSleeping();
              }}
            >
              <ThemedText style={styles.quickStartButtonText}>Start sleeping</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  yesterdayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    textShadowColor: "rgba(255, 255, 255, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    transform: [{ translateX: -40 }],
    position: "absolute",
    left: 20,
  },
  centerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    justifyContent: "center",
  },
  todayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
    textShadowColor: "rgba(255, 255, 255, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  arrowIcon: {
    width: 12,
    height: 12,
  },
  circleContainer: {
    position: "absolute",
    right: 20,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    width: 400,
    backgroundColor: "#0F0F0F",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#141414",
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  sectionBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  blurredCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,

    shadowColor: '#1F9950',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 1000,

    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
  },
  metricsBox: {
    backgroundColor: "rgba(13, 13, 13, 0.12)",
    borderRadius: 5,
    padding: 16,
    marginTop: 16,
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  arrowRight: {
    width: 24,
    height: 24,
  },
  sleepContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: "600",
    color: "#00FF75",
    marginBottom: 8,
    textShadowColor: "rgba(0, 255, 117, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  trophyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#FFFFFF",
    fontSize: 12,
  },
  sleepTimeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
  },
  sleepDescription: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  sleepSubDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  durationContainer: {
    alignItems: "center",
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  durationValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationNumber: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
  },
  recoveryContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  recoveryNumber: {
    color: "#FFB800",
  },
  metricsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  metricsText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 4,
  },
  metricsSubText: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 40,
  },
  indicator: {
    alignItems: "center",
  },
  indicatorIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  indicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 8,
  },
  indicatorCheck: {
    width: 16,
    height: 16,
  },
  journalContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  journalNumber: {
    color: "#FFFFFF",
  },
  journalText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 24,
  },
  timelineContainer: {
    width: "100%",
    paddingHorizontal: 40,
  },
  timeline: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
  },
  timeMarker: {
    width: 2,
    height: 8,
    backgroundColor: "#FFFFFF",
    marginLeft: "50%",
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.6,
  },
  jetlagContent: {
    padding: 24,
  },
  jetlagHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  jetlagTime: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "600",
    marginRight: 8,
  },
  jetlagIcon: {
    width: 24,
    height: 24,
  },
  jetlagType: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
  },
  jetlagDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
    lineHeight: 20,
  },
  jetlagCalibrating: {
    color: "#FFFFFF",
    fontSize: 12,
    opacity: 0.4,
  },
  circadianContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  circadianTimer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 8,
  },
  timerValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  circadianDescription: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  circadianSubDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  caffeineContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  caffeineTimeline: {
    width: "100%",
    marginBottom: 24,
  },
  timeMarkerActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00FF75",
    marginBottom: 4,
    marginLeft: "10%",
    marginRight: "10%",
  },
  timeMarkerInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 4,
    marginLeft: "10%",
    marginRight: "10%",
  },
  caffeineTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  caffeineDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  quickStartContainer: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  quickStartTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    opacity: 0.8,
  },
  quickStartButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  quickStartButton: {
    backgroundColor: '#19151A',
    borderColor: 'rgba(51, 51, 51, 0.52)',
    borderWidth: 7,
    borderRadius: 50,
    paddingVertical: 18,
    flex: 1,
    alignItems: 'center',
  },
  quickStartButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
});


export default HomePage;