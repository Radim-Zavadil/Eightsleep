import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import CaffeineWidget from './widgets/CaffeineWidget';
import ScreenTimeWidget from './widgets/ScreenTimeWidget';
import VitaminDWidget from './widgets/VitaminDWidget';



export function Widgets() {
  useEffect(() => {
    Font.loadAsync({
      'DMMono-Regular': require('../assets/fonts/DMMono-Regular.ttf'),
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        
        <CaffeineWidget />
        <ScreenTimeWidget />
        <VitaminDWidget />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 0
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
});
