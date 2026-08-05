import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius } from '../constants/colors';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const isDone = index + 1 < current;
        const isCurrent = index + 1 === current;
        const isActive = isDone || isCurrent;

        return (
          <View key={index} style={styles.dotWrapper}>
            {isActive ? (
              <LinearGradient
                colors={Colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.dot, styles.dotActive]}
              />
            ) : (
              <View style={[styles.dot, styles.dotInactive]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

// Alternative: Pill-style progress bar
export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <View style={styles.barContainer}>
      <LinearGradient
        colors={Colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.barFill, { width: `${progress * 100}%` }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    flex: 1,
    maxWidth: 180,
  },
  dotWrapper: {
    flex: 1,
    maxWidth: 12,
  },
  dot: {
    height: 3,
    borderRadius: 1.5,
  },
  dotActive: {
    // Gradient applied via LinearGradient
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  barContainer: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});
