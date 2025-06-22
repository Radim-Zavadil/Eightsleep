import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathworkState {
  isActive: boolean;
  currentPhase: BreathPhase;
  currentCycle: number;
  timeRemaining: number;
  totalCycles: number;
}

const BREATH_PATTERN = {
  inhale: 4,
  hold1: 4,
  exhale: 4,
  hold2: 4,
};

const TOTAL_CYCLES = 3;

export default function BreathworkScreen() {
  const router = useRouter();
  const [state, setState] = useState<BreathworkState>({
    isActive: false,
    currentPhase: 'inhale',
    currentCycle: 1,
    timeRemaining: BREATH_PATTERN.inhale,
    totalCycles: TOTAL_CYCLES,
  });

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const squareAnimations = useRef<Animated.Value[]>([]);

  // Initialize square animations
  useEffect(() => {
    const squares = Array.from({ length: 20 }, () => new Animated.Value(0));
    squareAnimations.current = squares;
  }, []);

  const getPhaseText = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Inhale';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Exhale';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };

  const getPhaseColor = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return '#4CAF50';
      case 'hold1': return '#FF9800';
      case 'exhale': return '#2196F3';
      case 'hold2': return '#9C27B0';
      default: return '#FFFFFF';
    }
  };

  const animateBreathing = (phase: BreathPhase) => {
    const isInhaling = phase === 'inhale';
    const isExhaling = phase === 'exhale';
    
    if (isInhaling) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isExhaling) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const animateSquares = () => {
    squareAnimations.current.forEach((anim, index) => {
      const delay = index * 100;
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Generate random positions for squares
  const getSquarePosition = (index: number) => {
    // Use index as seed for consistent positioning
    const seed = index * 12345;
    const randomX = (seed * 9301 + 49297) % width;
    const randomY = (seed * 49297 + 9301) % height;
    const size = 15 + (seed % 25); // Random size between 15-40
    const colors = ['rgba(255, 255, 255, 0.1)', 'rgba(100, 200, 255, 0.2)', 'rgba(255, 100, 200, 0.2)', 'rgba(200, 255, 100, 0.2)'];
    const randomColor = colors[seed % colors.length];
    
    return {
      left: randomX,
      top: randomY,
      width: size,
      height: size,
      backgroundColor: randomColor,
    };
  };

  const startBreathwork = () => {
    setState(prev => ({ ...prev, isActive: true }));
    animateBreathing('inhale');
    animateSquares();
  };

  const stopBreathwork = () => {
    setState(prev => ({ 
      ...prev, 
      isActive: false,
      currentPhase: 'inhale',
      currentCycle: 1,
      timeRemaining: BREATH_PATTERN.inhale,
    }));
    
    // Reset animations
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
    squareAnimations.current.forEach(anim => anim.setValue(0));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive) {
      interval = setInterval(() => {
        setState(prev => {
          let newTimeRemaining = prev.timeRemaining - 1;
          let newPhase = prev.currentPhase;
          let newCycle = prev.currentCycle;

          if (newTimeRemaining <= 0) {
            // Move to next phase
            switch (prev.currentPhase) {
              case 'inhale':
                newPhase = 'hold1';
                newTimeRemaining = BREATH_PATTERN.hold1;
                animateBreathing('hold1');
                break;
              case 'hold1':
                newPhase = 'exhale';
                newTimeRemaining = BREATH_PATTERN.exhale;
                animateBreathing('exhale');
                break;
              case 'exhale':
                newPhase = 'hold2';
                newTimeRemaining = BREATH_PATTERN.hold2;
                animateBreathing('hold2');
                break;
              case 'hold2':
                if (prev.currentCycle < TOTAL_CYCLES) {
                  newPhase = 'inhale';
                  newTimeRemaining = BREATH_PATTERN.inhale;
                  newCycle = prev.currentCycle + 1;
                  animateBreathing('inhale');
                } else {
                  // Breathwork complete
                  Alert.alert('Breathwork Complete', 'Great job! You\'ve completed your breathwork session.');
                  stopBreathwork();
                  return prev;
                }
                break;
            }
          }

          return {
            ...prev,
            currentPhase: newPhase,
            currentCycle: newCycle,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive]);

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Animated Squares Background */}
      <View style={styles.squaresContainer}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.square,
              getSquarePosition(index),
              {
                opacity: squareAnimations.current[index] || 0,
                transform: [
                  {
                    scale: squareAnimations.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }) || 0,
                  },
                  {
                    rotate: squareAnimations.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }) || '0deg',
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Breathing Circle */}
        <Animated.View
          style={[
            styles.breathingCircle,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              borderColor: getPhaseColor(state.currentPhase),
            },
          ]}
        >
          <Text style={styles.phaseText}>
            {getPhaseText(state.currentPhase)}
          </Text>
          <Text style={styles.timerText}>
            {state.timeRemaining}s
          </Text>
        </Animated.View>

        {/* Cycle Counter */}
        <View style={styles.cycleContainer}>
          <Text style={styles.cycleText}>
            Cycle {state.currentCycle} of {state.totalCycles}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          {!state.isActive ? (
            <TouchableOpacity style={styles.startButton} onPress={startBreathwork}>
              <Text style={styles.buttonText}>Start Breathwork</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopBreathwork}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  squaresContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  square: {
    position: 'absolute',
    borderRadius: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 40,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cycleContainer: {
    marginBottom: 40,
  },
  cycleText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 