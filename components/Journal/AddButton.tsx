import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface AddButtonProps {
  onPress: () => void;
}

const AddButton = ({ onPress }: AddButtonProps) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Plus size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 16,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    borderRadius: 28,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddButton;