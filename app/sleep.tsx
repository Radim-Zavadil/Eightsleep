import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

type SleepStat = {
  value: string;
  label: string;
  status: 'Optimal' | 'Needs Attention';
};

type Contributor = {
  name: string;
  status: 'Optimal' | 'Needs Attention';
  progress: number;
};

const getSleepData = (sleptSeconds?: number) => {
  // Default values
  let totalSleep = '7h 30m';
  let timeInBed = '7h 55m';
  let restorativeSleep = '53%';
  let hrDrop = '5:52AM';
  let statsStatus: ('Optimal' | 'Needs Attention')[] = ['Optimal', 'Optimal', 'Optimal', 'Needs Attention'];
  let contributors = [
    { name: 'Sleep Efficiency', status: 'Optimal', progress: 0.95 },
    { name: 'Temperature', status: 'Optimal', progress: 0.9 },
    { name: 'Restfulness', status: 'Optimal', progress: 0.85 },
    { name: 'Total Sleep', status: 'Optimal', progress: 0.8 },
    { name: 'HR Drop', status: 'Needs Attention', progress: 0.4 },
    { name: 'Timing', status: 'Optimal', progress: 0.9 },
    { name: 'Restoration Time', status: 'Optimal', progress: 0.75 },
  ];

  if (sleptSeconds !== undefined) {
    // Calculate hours and minutes
    const hours = Math.floor(sleptSeconds / 3600);
    const minutes = Math.floor((sleptSeconds % 3600) / 60);
    totalSleep = `${hours}h ${minutes}m`;
    // Adjust time in bed to be a bit more than total sleep
    timeInBed = `${hours}h ${minutes + 25 > 59 ? minutes - 35 : minutes + 25}m`;
    // Adjust restorative sleep and contributors based on sleep length
    if (sleptSeconds < 6 * 3600) {
      restorativeSleep = '35%';
      statsStatus = ['Needs Attention', 'Needs Attention', 'Needs Attention', 'Needs Attention'];
      contributors = contributors.map(c => ({ ...c, status: 'Needs Attention', progress: c.progress * 0.6 }));
    } else if (sleptSeconds < 7 * 3600) {
      restorativeSleep = '45%';
      statsStatus = ['Needs Attention', 'Optimal', 'Needs Attention', 'Needs Attention'];
      contributors = contributors.map(c => ({ ...c, status: c.name === 'HR Drop' ? 'Needs Attention' : 'Optimal', progress: c.progress * 0.8 }));
    } else {
      restorativeSleep = '53%';
      statsStatus = ['Optimal', 'Optimal', 'Optimal', 'Needs Attention'];
      contributors = contributors.map(c => ({ ...c, status: c.name === 'HR Drop' ? 'Needs Attention' : 'Optimal' }));
    }
  }

  return {
    date: 'Today',
    stats: [
      { value: totalSleep, label: 'TOTAL SLEEP', status: statsStatus[0] },
      { value: timeInBed, label: 'TIME IN BED', status: statsStatus[1] },
      { value: restorativeSleep, label: 'RESTORATIVE SLEEP', status: statsStatus[2] },
      { value: hrDrop, label: 'HR DROP', status: statsStatus[3] },
    ],
    contributors,
  };
};

const StatCard: React.FC<SleepStat> = ({ value, label, status }) => {
    const isOptimal = status === 'Optimal';
    const statusBadgeStyle = isOptimal ? styles.optimalBadge : styles.needsAttentionBadge;
    const statusTextStyle = isOptimal ? styles.optimalText : styles.needsAttentionText;

    return (
        <TouchableOpacity style={styles.statCard}>
            <View style={{alignSelf: 'flex-end'}}>
                <Ionicons name="chevron-forward" size={18} color="#888" />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
            <View style={[styles.statusBadge, statusBadgeStyle]}>
                <Text style={[styles.statusText, statusTextStyle]}>{status}</Text>
            </View>
        </TouchableOpacity>
    );
};

const ProgressBar: React.FC<{ progress: number; status: 'Optimal' | 'Needs Attention' }> = ({ progress, status }) => {
    const barColor = status === 'Optimal' ? '#00E676' : '#FF5252';
    return (
        <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: barColor }]} />
        </View>
    );
};

const ContributorItem: React.FC<Contributor> = ({ name, status, progress }) => {
    const statusTextStyle = status === 'Optimal' ? styles.optimalText : styles.needsAttentionText;
    return (
        <TouchableOpacity style={styles.contributorItem}>
            <View style={styles.contributorTextContainer}>
                <Text style={styles.contributorName}>{name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.contributorStatus, statusTextStyle]}>{status}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#888" style={{marginLeft: 5}}/>
                </View>
            </View>
            <ProgressBar progress={progress} status={status} />
        </TouchableOpacity>
    );
};

const SleepScreen = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const params = useLocalSearchParams();
  const sleptSeconds = params.slept ? parseInt(params.slept as string, 10) : undefined;
  const sleepData = getSleepData(sleptSeconds);

  React.useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Inter-Regular': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{color: 'white'}}>Loading...</Text>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
            <Link href={"/"} asChild>
              <TouchableOpacity>
                  <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </Link>
            <Text style={styles.headerDate}>{sleepData.date}</Text>
            <TouchableOpacity>
                <Ionicons name="information-circle-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
            {sleepData.stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </View>

        <View style={styles.contributorsSection}>
            <Text style={styles.sectionTitle}>Sleep Index Contributors</Text>
            {sleepData.contributors.map((contributor, index) => (
                <ContributorItem key={index} {...contributor} />
            ))}
        </View>

        <View style={styles.alertnessSection}>
            <View style={styles.alertnessHeader}>
                <Text style={styles.sectionTitle}>Morning Alertness</Text>
                <TouchableOpacity>
                    <Ionicons name="information-circle-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.alertnessCard}>
                <Text style={styles.alertnessTitle}>Morning Alertness Computation in Progress</Text>
                <Text style={styles.alertnessBody}>We are processing your steps data post-sleep to compute your morning alertness. Data will start populating soon.</Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 10,
    },
    headerDate: {
        fontFamily: 'Inter-Medium',
        fontSize: 18,
        color: 'white',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: 'rgba(58, 58, 58, 0.72)',
        borderRadius: 20,
        padding: 15,
        width: '48%',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    statValue: {
        fontFamily: 'Inter-Medium',
        fontSize: 28,
        color: 'white',
        marginTop: -10,
    },
    statLabel: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        color: '#A0A0A0',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    statusBadge: {
        borderRadius: 7,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    optimalBadge: {
        backgroundColor: 'rgba(0, 230, 118, 0.2)',
    },
    needsAttentionBadge: {
        backgroundColor: 'rgba(255, 82, 82, 0.2)',
    },
    statusText: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
    },
    contributorsSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontFamily: 'Inter-Medium',
        fontSize: 20,
        color: 'white',
        marginBottom: 15,
    },
    contributorItem: {
        marginBottom: 2,
        paddingVertical: 10,
    },
    contributorTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    contributorName: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#E0E0E0',
    },
    contributorStatus: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    optimalText: {
        color: '#00E676',
    },
    needsAttentionText: {
        color: '#FF5252',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#333',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    alertnessSection: {
        marginTop: 20,
    },
    alertnessHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    alertnessCard: {
        backgroundColor: '#1C1C2E',
        borderRadius: 15,
        padding: 20,
    },
    alertnessTitle: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: 'white',
        marginBottom: 8,
    },
    alertnessBody: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#A0A0A0',
        lineHeight: 20,
    },
});

export default SleepScreen;