import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  sleepLength: number; // 0-1
  bedroomScore: number; // 0-1
  overallScore: number; // 0-1
  isFuture?: boolean;
  isToday?: boolean;
  size?: number;
}

const RING_WIDTH = 4;
const GAP = 2;

const COLORS = {
  sleep: '#00e7d4', // blue
  bedroom: '#aafc00', // green
  overall: '#f31e5a', // red
  bg: '#1a2022',
  today: '#fff',
};

const DayProgressRings: React.FC<Props> = ({
  sleepLength,
  bedroomScore,
  overallScore,
  isFuture = false,
  isToday = false,
  size = 48,
}) => {
  // Outermost ring: overall, then bedroom, then sleep (innermost)
  const radii = [
    size / 2 - RING_WIDTH / 2,
    size / 2 - RING_WIDTH * 1.5 - GAP,
    size / 2 - RING_WIDTH * 2.5 - GAP * 2,
  ];
  const values = [overallScore, bedroomScore, sleepLength];
  const colors = [COLORS.overall, COLORS.bedroom, COLORS.sleep];

  return (
    <View style={[styles.container, isToday && { borderColor: COLORS.today, borderWidth: 2, borderRadius: size / 2 }]}> 
      <Svg width={size} height={size}>
        {radii.map((r, i) => {
          const circ = 2 * Math.PI * r;
          return (
            <>
              {/* Background ring */}
              <Circle
                key={`bg-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={COLORS.bg}
                strokeWidth={RING_WIDTH}
                fill="none"
              />
              {/* Progress ring */}
              <Circle
                key={`fg-${i}`}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={colors[i]}
                strokeWidth={RING_WIDTH}
                fill="none"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - values[i])}
                strokeLinecap="round"
                opacity={isFuture ? 0.5 : 1}
              />
            </>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default DayProgressRings; 