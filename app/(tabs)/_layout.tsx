import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#808080',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#151515',
          borderTopColor: '#2A2A2A',
          borderTopWidth: 1,
          paddingVertical: 25,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Home.svg')}
              style={{ width: 20, height: 20, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Calendar.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Explore.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="music"
        options={{
          title: 'Music',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Music.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('../../assets/images/Account.svg')}
              style={{ width: 28, height: 28, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}