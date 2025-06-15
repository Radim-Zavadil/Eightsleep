import { StyleSheet, View, TouchableOpacity, ScrollView, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const menuItems = [
  {
    label: 'Account',
    icon: <Feather name="user" size={22} color="#8F8F91" />, // You can swap icons as needed
    route: '../account-details' as const,
  },
  {
    label: 'Achievements',
    icon: <FontAwesome5 name="trophy" size={20} color="#1681F6" />, 
    route: '../account-achievements' as const,
  },
  {
    label: 'Notifications',
    icon: <Feather name="bell" size={22} color="#1681F6" />, 
    route: '../account-notifications' as const,
  },
  {
    label: 'Sleep length goal',
    icon: <MaterialIcons name="hotel" size={22} color="#31D156" />, 
    route: '../account-goal' as const,
  },
  {
    label: 'Payments',
    icon: <Feather name="credit-card" size={22} color="#8F8F91" />, 
    route: '../account-payments' as const,
  },
  {
    label: 'Inquiry',
    icon: <Feather name="help-circle" size={22} color="#8F8F91" />, 
    route: '../account-inquiry' as const,
  },
];

export default function AccountScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerText}>Setting</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Detached Account Button */}
        <TouchableOpacity
          style={styles.accountButton}
          onPress={() => router.push(menuItems[0].route)}
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
                onPress={() => item.route && router.push(item.route)}
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
        <TouchableOpacity style={styles.signOutButton}>
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
    fontFamily: 'Inter',
    color: '#fff',
    letterSpacing: 1.2,
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 248, 248, 0.16)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
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
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  signOutText: {
    color: '#101014',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
});
