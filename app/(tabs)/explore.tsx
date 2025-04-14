import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface SensorCardProps {
  icon: any;
  title: string;
  description: string;
  category: string;
  isActive?: boolean;
}

const SensorCard = ({ icon, title, description, category, isActive = false }: SensorCardProps) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.cardIcon} />
      </View>
      <View style={styles.statusContainer}>
        <ThemedText style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</ThemedText>
      </View>
    </View>
    <View style={styles.cardContent}>
      <ThemedText style={styles.cardCategory}>{category}</ThemedText>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDescription}>{description}</ThemedText>
    </View>
  </View>
);

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>SENSOR STORE</ThemedText>
        <Image source={require('../../assets/images/infoIcon.svg')} style={styles.infoIcon} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          <SensorCard
            icon={require('../../assets/images/SandClock.svg')}
            title="Screentime"
            description="Tracks screen time and its impact on your sleep, offering personalized insights for healthier habits."
            category="PRODUCTIVITY"
            isActive={true}
          />
          <SensorCard
            icon={require('../../assets/images/sunRise.svg')}
            title="Vitamin D"
            description="Maximize your Vitamin D with smart and personalized suggestions for sun exposure."
            category="PRODUCTIVITY"
          />
          <SensorCard
            icon={require('../../assets/images/coffeBeans.svg')}
            title="Caffeine windows"
            description="Maximize your caffeine intake with smart and personalized suggestions for optimal timing."
            category="PRODUCTIVITY"
            isActive={true}
          />
          <SensorCard
            icon={require('../../assets/images/circadianRhythm.svg')}
            title="Circadian Rhythm"
            description="Optimize your daily routine with proper eating and exercise throughout a day to ensure better life."
            category="PERFORMANCE"
            isActive={true}
          />
          <SensorCard
            icon={require('../../assets/images/Alarm.svg')}
            title="Smart alarm"
            description="Optimize your daily routine with proper eating and exercise throughout a day to ensure better life."
            category="PERFORMANCE"
            isActive={true}
          />
        </View>
      </ScrollView>
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