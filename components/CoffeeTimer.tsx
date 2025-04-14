
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Font from 'expo-font';
import { useEffect } from 'react';

const Widget = ({ icon, title, timer, color }) => (
  <View style={styles.rectangle}>
    <View style={styles.leftContent}>
      <Image 
        source={icon}
        style={[styles.icon, { tintColor: color }]}
      />
      <View style={styles.textContainer}>
        <ThemedText style={[styles.title, { color }]}>{title}</ThemedText>
        <ThemedText style={styles.timer}>{timer}</ThemedText>
      </View>
    </View>
    <Image 
      source={require('../assets/images/icons/ArrowDown.svg')}
      style={styles.arrowIcon}
    />
  </View>
);

export function CoffeeTimer() {
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
        <Widget
          icon={require('../assets/images/cup-of-coffee.png')}
          title="Active coffee window"
          timer="01:42:3"
          color="#00FF75"
        />
        <Widget
          icon={require('../assets/images/Eye.svg')}
          title="Blue light window"
          timer="1h screen time"
          color="#9EA7F4"
        />
        <Widget
          icon={require('../assets/images/WaterDrop.svg')}
          title="Water window"
          timer="01:42:3"
          color="#A7E1D3"
        />
        <Widget
          icon={require('../assets/images/Cutlery.svg')}
          title="Food window"
          timer="01:42:3"
          color="#A7E1D3"
        />
        <Widget
          icon={require('../assets/images/SunRiseBottom.svg')}
          title="Sun rise"
          timer="01:42:3"
          color="#FFD9B1"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 35,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  rectangle: {
    width: 250,
    height: 62,
    backgroundColor: '#010101',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#141414',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textContainer: {
    gap: 2,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter',
  },
  timer: {
    fontSize: 14,
    fontFamily: 'DMMono-Regular',
    color: '#FFFFFF',
  },
  arrowIcon: {
    width: 14,
    height: 14,
    tintColor: '#FFFFFF',
  },
});
