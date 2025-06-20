import { Tabs } from 'expo-router';
import { Image, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

import { CaffeineProvider } from '@/components/Context/CaffeineContext';
import { ScreenProvider } from '@/components/Context/ScreenContext';
import { VitaminDProvider } from '@/components/Context/VitaminDContext';
import { CircadianProvider } from '@/components/Context/CircadianContext';
import { SmartProvider } from '@/components/Context/AlarmContext';
import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { JournalProvider } from '@/context/JournalContext';
import RequireAuth from '../../components/RequireAuth';

export default function TabLayout() {
  // Load the Inter font
  const [fontsLoaded] = useFonts({
    'Inter': require('../../assets/fonts/Inter-VariableFont_opsz,wght.ttf')
  });
  
  // Custom tab label component with Inter font
  const TabLabel = ({ label, focused }: { label: string; focused: boolean }) => {
    return (
      <Text 
        style={[
          styles.tabLabel, 
          { color: focused ? '#ffffff' : '#808080' }
        ]}
      >
        {label}
      </Text>
    );
  };

  return (
    <RequireAuth>
      <JournalProvider>
      <CaffeineProvider>
      <ScreenProvider>
      <VitaminDProvider>
      <CircadianProvider>
      <SmartProvider>

        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#808080',
            headerShown: false,
            tabBarStyle: {
              borderTopColor: '#2A2A2A',
              borderTopWidth: 3,
              height: 80,
              paddingVertical: 15,
              paddingTop: 12,
              position: 'relative',
              backgroundColor: 'transparent', // Make background transparent
            },
            tabBarBackground: () => (
              <BlurView
                tint="dark"
                intensity={80}
                style={StyleSheet.absoluteFill}
              >
                <View style={{ 
                  backgroundColor: 'rgba(21, 21, 21, 0.5)', // Semi-transparent background
                  ...StyleSheet.absoluteFillObject 
                }} />
              </BlurView>
            ),
            tabBarLabelStyle: {
              fontFamily: 'Inter',
              fontSize: 12,
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <svg width="19" height="25" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 6.25H4.5M4.5 9.25H10M3.5 23.75H15C15.8333 23.75 17.5 23.25 17.5 21.25C17.5 19.25 17.5 8.75 17.5 3.75C17.3333 2.91667 16.6 1.25 15 1.25C13.4 1.25 6.66667 1.25 3.5 1.25C2.66667 1.41667 1 2.15 1 3.75C1 5.35 1 16.0833 1 21.25C1 22.0833 1.5 23.75 3.5 23.75ZM6.5 12.25H13C14 12.25 14 12.85 14 13.25C14 13.65 14 17.4167 14 19.25C13.8333 19.5833 13.3 20.25 12.5 20.25C11.7 20.25 6.83333 20.25 4.5 20.25C4.33333 20.0833 4 19.65 4 19.25C4 18.85 4 15.0833 4 13.25C4 12.9167 4.1 12.25 4.5 12.25C4.9 12.25 6 12.25 6.5 12.25Z" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="calendar"
            options={{
              title: 'Calendar',
              tabBarLabel: ({ focused }) => <TabLabel label="Calendar" focused={focused} />,
              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <Image 
                    source={require('../../assets/images/Calendar.svg')}
                    style={{ width: 28, height: 28, tintColor: color }}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarLabel: ({ focused }) => <TabLabel label="Explore" focused={focused} />,
              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <Image 
                    source={require('../../assets/images/Explore.svg')}
                    style={{ width: 28, height: 28, tintColor: color }}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="music"
            options={{
              title: 'Music',
              tabBarLabel: ({ focused }) => <TabLabel label="Music" focused={focused} />,
              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <Image 
                    source={require('../../assets/images/Music.svg')}
                    style={{ width: 28, height: 28, tintColor: color }}
                  />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="account"
            options={{
              title: 'Account',
              tabBarLabel: ({ focused }) => <TabLabel label="Account" focused={focused} />,
              tabBarIcon: ({ color }) => (
                <View style={styles.iconContainer}>
                  <svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_i_697_14252)">
                  <path d="M1.35587 19.0002C2.21167 20.3066 8.41618 24.8426 11.4115 26.9474C11.8327 27.0531 12.9489 26.9708 13.123 26.9474C13.9919 26.8305 14.5456 26.6221 15.6806 26.2363C19.0325 24.5488 25.8957 21.1666 26.4948 20.6876C27.2436 20.0888 28.4203 18.2381 28.5273 17.6394C28.6343 17.0406 28.2766 15.5493 28.0994 15.081C25.8959 9.25985 22.8041 2.07162 21.146 1.0374C19.8204 0.210546 13.3904 -0.323516 11.4115 0.220907C9.54985 0.73305 7.82775 3.10584 7.13241 3.7046C6.43708 4.30336 1.08803 12.2506 0.767514 13.7202C0.49278 14.98 0.286129 17.3672 1.35587 19.0002Z" fill={color}/>
                  </g>
                  <path d="M11.5143 26.7141C10.0179 25.6618 7.74414 24.0196 5.7336 22.4761C4.71891 21.6971 3.77351 20.9449 3.02958 20.3073C2.65753 19.9884 2.33794 19.6999 2.08611 19.4522C1.83115 19.2014 1.65662 19.0031 1.565 18.8632C1.06354 18.0977 0.853709 17.1419 0.807205 16.2078C0.760811 15.2759 0.87805 14.3867 1.01177 13.7735C1.04457 13.6231 1.15011 13.3628 1.32843 13.0036C1.50338 12.6512 1.7384 12.2231 2.01572 11.7449C2.57014 10.789 3.288 9.64305 4.01881 8.52238C4.74946 7.40196 5.49147 6.30923 6.09356 5.46007C6.39473 5.03533 6.6599 4.67293 6.87059 4.39901C7.08792 4.11647 7.23176 3.94897 7.29554 3.89404C7.47742 3.73743 7.71776 3.4751 7.98936 3.17863L8.01689 3.14859C8.30546 2.83365 8.63975 2.46973 9.00919 2.10919C9.75502 1.38134 10.6123 0.700044 11.4778 0.461952C11.9402 0.334728 12.6865 0.266019 13.5847 0.252501C14.4769 0.239075 15.4992 0.280197 16.5029 0.364056C17.5069 0.447935 18.4876 0.574191 19.2968 0.729929C20.1193 0.888216 20.7265 1.07035 21.0137 1.24952C21.186 1.35698 21.395 1.55722 21.6359 1.85596C21.8744 2.1516 22.1335 2.53023 22.409 2.97999C22.9597 3.87939 23.5662 5.04777 24.1922 6.37103C25.4439 9.01662 26.765 12.2621 27.8656 15.1695C27.9472 15.3852 28.0777 15.8598 28.1745 16.3589C28.2226 16.6067 28.2613 16.8552 28.2815 17.0758C28.3022 17.3008 28.3019 17.4794 28.2812 17.5954C28.2615 17.7054 28.1836 17.9046 28.0475 18.1699C27.9152 18.4276 27.7394 18.7261 27.5426 19.0265C27.144 19.635 26.6804 20.2191 26.3386 20.4924C26.2826 20.5372 26.1289 20.6324 25.8729 20.7765C25.6244 20.9164 25.2964 21.0932 24.9072 21.2982C24.1291 21.708 23.1118 22.2276 22.0073 22.7856C20.7189 23.4365 19.3162 24.1375 18.0375 24.7764C17.1283 25.2308 16.2818 25.6538 15.5837 26.0051C15.4813 26.04 15.3838 26.0733 15.2907 26.1051C14.3542 26.425 13.8496 26.5974 13.0896 26.6996C13.0149 26.7097 12.7021 26.7357 12.3526 26.7459C12.021 26.7555 11.697 26.7491 11.5143 26.7141Z" stroke="#232323" stroke-opacity="0.3" stroke-width="0.5"/>
                  <defs>
                  <filter id="filter0_i_697_14252" x="0.546875" y="0" width="28" height="27" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="2.45"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.0480769 0 0 0 0 0.0480769 0 0 0 0 0.0480769 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_697_14252"/>
                  </filter>
                  </defs>
                  </svg>
                </View>
              ),
            }}
          />
        </Tabs>
      
      </SmartProvider>
      </CircadianProvider>
      </VitaminDProvider>
      </ScreenProvider>
      </CaffeineProvider>
      </JournalProvider>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginBottom: 10, // Add bigger marginBottom to icons
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  }
});