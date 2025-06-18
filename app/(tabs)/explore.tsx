import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import RequireAuth from '../../components/RequireAuth';

//sensors
import ScreentimeSensor from '@/components/sensors/ScreentimeSensor';
import VitaminDSensor from '@/components/sensors/VitaminDSensor';
import CaffeineWindowsSensor from '@/components/sensors/CaffeineWindowsSensor';
import CircadianRhythmSensor from '@/components/sensors/CircadianRhythmSensor';
import SmartAlarmSensor from '@/components/sensors/SmartAlarmSensor';

import { useNavigation } from '@react-navigation/native';

export default function ExploreScreen() {
  return (
    <RequireAuth>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>SENSOR STORE</ThemedText>
          <Image source={require('../../assets/images/infoIcon.svg')} style={styles.infoIcon} />
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsContainer}>
            
            <ScreentimeSensor />
            <VitaminDSensor />
            <CaffeineWindowsSensor />
            <CircadianRhythmSensor />
            <SmartAlarmSensor />

          </View>
        </ScrollView>
      </ThemedView>
    </RequireAuth>
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
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
  card: {
    width: 381,
    height: 242,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#252525',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  cardCategory: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 16,
  }
});