
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from './ThemedText';
import * as Font from 'expo-font';
import { useEffect } from 'react';

export function CoffeeTimer() {
  useEffect(() => {
    Font.loadAsync({
      'DMMono-Regular': require('../assets/fonts/DMMono-Regular.ttf'),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.leftContent}>
          <Image 
            source={require('../assets/images/cup-of-coffee.png')}
            style={styles.coffeeIcon}
          />
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>Active coffee window</ThemedText>
            <ThemedText style={styles.timer}>01:42:3</ThemedText>
          </View>
        </View>
        <Image 
          source={require('../assets/images/icons/ArrowDown.svg')}
          style={styles.arrowIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 25,
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
  coffeeIcon: {
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
    color: '#00FF75',
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
