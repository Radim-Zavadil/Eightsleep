
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AccountScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>ACCOUNT</ThemedText>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar} />
            <View>
              <ThemedText style={styles.name}>George Heaton</ThemedText>
              <ThemedText style={styles.email}>georgeheaton@gmail.com</ThemedText>
            </View>
          </View>
          <Image 
            source={require('../../assets/images/ArrowRightGrey.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Image source={require('../../assets/images/Trophy.svg')} style={styles.menuIcon} />
            <ThemedText style={styles.menuText}>Achievements</ThemedText>
          </View>
          <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Image source={require('../../assets/images/Attention.svg')} style={styles.menuIcon} />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
          </View>
          <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Image source={require('../../assets/images/Account.svg')} style={styles.menuIcon} />
            <ThemedText style={styles.menuText}>Account Settings</ThemedText>
          </View>
          <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Image source={require('../../assets/images/Calendar.svg')} style={styles.menuIcon} />
            <ThemedText style={styles.menuText}>Payments</ThemedText>
          </View>
          <Image source={require('../../assets/images/ArrowRightGrey.png')} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.signOut]}>
          <View style={styles.menuItemContent}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </View>
        </TouchableOpacity>
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
  content: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#141414',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 14,
    color: '#808080',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#141414',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  signOut: {
    justifyContent: 'center',
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
});
