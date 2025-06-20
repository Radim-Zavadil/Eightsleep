import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { ChevronLeft, Info } from 'react-native-feather';

const SmartAlarmPage = () => {
  return (
    <ImageBackground
      source={require('../assets/images/smartAlarm-blur.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Link href="/">
            <ChevronLeft stroke="#FFFFFF" width={24} height={24} />
          </Link>
          <Text style={styles.headerTitle}>Smart Alarm</Text>
          <Info stroke="#FFFFFF" width={24} height={24} />
        </View>

        <View style={styles.content}>
          <Image source={require('../assets/images/alarm-icon.png')} style={styles.alarmIcon} />
          <Text style={styles.noAlarmsTitle}>No active alarms for today</Text>
          <Text style={styles.noAlarmsSubtitle}>
            You have active scheduled alarms but today is not included in it
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add new alarm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.myAlarmsContainer}>
          <Text style={styles.myAlarmsTitle}>My Alarms</Text>
          <View style={styles.alarmCard}>
            <View>
              <Text style={styles.alarmCardTitle}>WAKE ME UP</Text>
              <Text style={styles.alarmCardSubtitle}>When my sleep score is 80</Text>
              <View style={styles.alarmDetails}>
                <View>
                  <Text style={styles.alarmDetailTitle}>WAKE TIME</Text>
                  <Text style={styles.alarmDetailValue}>10:30 AM</Text>
                </View>
                <View>
                  <Text style={styles.alarmDetailTitle}>REPEAT</Text>
                  <Text style={styles.alarmDetailValue}>Wed</Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.toggleButton}>
                    <View style={styles.toggleCircle} />
                </TouchableOpacity>
                <ChevronLeft stroke="#54504D" width={20} height={20} style={{ transform: [{ rotate: '180deg'}]}} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  alarmIcon: {
    width: 64,
    height: 64,
    marginBottom: 24,
  },
  noAlarmsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noAlarmsSubtitle: {
    color: '#A49797',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '70%',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  myAlarmsContainer: {
    paddingBottom: 20,
  },
  myAlarmsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alarmCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#272626'
  },
  alarmCardTitle: {
    color: '#A49797',
    fontSize: 12,
  },
  alarmCardSubtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alarmDetails: {
    flexDirection: 'row',
    gap: 32,
  },
  alarmDetailTitle: {
    color: '#A49797',
    fontSize: 12,
  },
  alarmDetailValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
    marginRight: 10,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  }
});

export default SmartAlarmPage; 