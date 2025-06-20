import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Text, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

const menuItems = [
  {
    label: 'Account',
    icon: <MaterialIcons name="person" size={20} color="#fff" />,
    route: '/account-details'
  },
  {
    label: 'Notifications',
    icon: <MaterialIcons name="notifications" size={20} color="#fff" />,
    route: '/account-notifications'
  },
  {
    label: 'Payments',
    icon: <FontAwesome5 name="credit-card" size={18} color="#fff" />,
    route: '/account-payments'
  },
  {
    label: 'Achievements',
    icon: <MaterialIcons name="emoji-events" size={20} color="#fff" />,
    route: '/account-achievements'
  },
  {
    label: 'Goal Settings',
    icon: <MaterialIcons name="flag" size={20} color="#fff" />,
    route: '/account-goal'
  },
  {
    label: 'Send Inquiry',
    icon: <MaterialIcons name="help" size={20} color="#fff" />,
    route: '/account-inquiry'
  }
];

export default function AccountScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerText}>Setting</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Detached Account Button */}
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => router.push(menuItems[0].route as any)}
          activeOpacity={0.7}
        >
          <View style={styles.iconSquare}>{menuItems[0].icon}</View>
          <Text style={styles.menuText}>{menuItems[0].label}</Text>
          <Feather name="chevron-right" size={22} color="#888" style={styles.arrowIcon} />
        </TouchableOpacity>
        {/* Stack of other buttons */}
        <View style={styles.stackContainer}>
          {menuItems.slice(1).map((item, idx) => (
            <View key={item.label}>
              <TouchableOpacity
                style={[
                  styles.menuBlock,
                  idx === 0 && styles.firstMenuBlock,
                  idx === menuItems.length - 2 && styles.lastMenuBlock,
                ]}
                onPress={() => item.route && router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.iconSquare}>{item.icon}</View>
                <Text style={styles.menuText}>{item.label}</Text>
                <Feather name="chevron-right" size={22} color="#888" style={styles.arrowIcon} />
              </TouchableOpacity>
              {idx < menuItems.length - 2 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
        <View style={{flex:1}} />
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerBlock: {
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flexGrow: 1,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 248, 248, 0.16)',
  },
  stackContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 248, 248, 0.16)',
  },
  menuBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  firstMenuBlock: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  lastMenuBlock: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.46)',
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    fontFamily: 'Inter',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(248, 248, 248, 0.1)',
    marginLeft: 72,
    marginRight: 0,
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  signOutText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
});
