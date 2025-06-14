import React, { useState } from 'react';

import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Font from 'expo-font';
import { useEffect } from 'react';
import CaffeineWidget from './widgets/CaffeineWidget';
import ScreenTimeWidget from './widgets/ScreenTimeWidget';
import VitaminDWidget from './widgets/VitaminDWidget';

import { useCaffeineContext } from './Context/CaffeineContext';
import { useScreenContext } from './Context/ScreenContext';
import { useVitaminDContext } from './Context/VitaminDContext';

const Widgets: React.FC = () => {
  const { showCaffeineWidget } = useCaffeineContext();
  const { showScreenWidget } = useScreenContext();
  const { showVitaminDWidget } = useVitaminDContext();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        
        {showCaffeineWidget && <CaffeineWidget />}
        
        {showScreenWidget && <ScreenTimeWidget />}
        
        {showVitaminDWidget && <VitaminDWidget />}
        

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

export default Widgets;