import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const { height } = Dimensions.get('window');

type SceneType = 'bedroom' | 'kitchen' | 'pool' | 'classroom' | 'trophy' | 'stage' | 'cozy' | 'garden';

interface ScenePanelProps {
  scene: SceneType;
  children: React.ReactNode;
  customHeight?: number | string;
}

const sceneGradients: Record<SceneType, readonly [string, string, string]> = {
  bedroom: Colors.sceneNight,
  kitchen: Colors.sceneCozy,
  pool: Colors.sceneSkyDay,
  classroom: ['#FEF3C7', '#FDE68A', '#F9FAFB'] as const,
  trophy: ['#FEF3C7', '#FBBF24', '#FB923C'] as const,
  stage: Colors.sceneNight,
  cozy: Colors.sceneCozy,
  garden: Colors.sceneGarden,
};

const floorGradients: Record<SceneType, readonly [string, string]> = {
  bedroom: ['#4338CA', '#312E81'] as const,
  kitchen: ['#D4A574', '#C89360'] as const,
  pool: ['#0EA5E9', '#0284C7'] as const,
  classroom: ['#D4A574', '#A87A4A'] as const,
  trophy: ['#FBBF24', '#F59E0B'] as const,
  stage: ['#7C3AED', '#6D28D9'] as const,
  cozy: ['#D4A574', '#A87A4A'] as const,
  garden: ['#34D399', '#10B981'] as const,
};

export const ScenePanel: React.FC<ScenePanelProps> = ({
  scene,
  children,
  customHeight,
}) => {
  const gradient = sceneGradients[scene];
  const floorGradient = floorGradients[scene];

  return (
    <View style={[styles.panel, customHeight ? { height: customHeight as any } : {}]}>
      {/* Sky background */}
      <LinearGradient
        colors={gradient}
        style={styles.sky}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Floor */}
      <LinearGradient
        colors={floorGradient}
        style={styles.floor}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Content */}
      {children}
    </View>
  );
};

// Alias for backward compatibility
export const ComicPanel = ScenePanel;

// Scene decorations
export const Cloud: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.cloud, style]}>
    <View style={styles.cloudPart1} />
    <View style={styles.cloudPart2} />
    <View style={styles.cloudPart3} />
  </View>
);

export const Star: React.FC<{ style?: any; size?: number }> = ({ style, size = 4 }) => (
  <View
    style={[
      styles.star,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}
  />
);

export const Sun: React.FC<{ style?: any; size?: number }> = ({ style, size = 50 }) => (
  <View style={[styles.sunContainer, { width: size, height: size }, style]}>
    <LinearGradient
      colors={['#FBBF24', '#F59E0B']}
      style={[styles.sun, { width: size, height: size, borderRadius: size / 2 }]}
    />
    <View style={[styles.sunGlow, { width: size * 1.5, height: size * 1.5, borderRadius: size * 0.75 }]} />
  </View>
);

export const Moon: React.FC<{ style?: any; size?: number }> = ({ style, size = 40 }) => (
  <View style={[styles.moon, { width: size, height: size, borderRadius: size / 2 }, style]}>
    <View style={[styles.moonCrater, { top: size * 0.2, left: size * 0.3 }]} />
    <View style={[styles.moonCrater, styles.moonCraterSmall, { top: size * 0.5, left: size * 0.6 }]} />
  </View>
);

const styles = StyleSheet.create({
  panel: {
    height: height * 0.42,
    minHeight: 280,
    maxHeight: 380,
    position: 'relative',
    overflow: 'hidden',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '28%',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  cloud: {
    position: 'absolute',
    opacity: 0.8,
  },
  cloudPart1: {
    width: 50,
    height: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    position: 'absolute',
    bottom: 0,
  },
  cloudPart2: {
    width: 30,
    height: 30,
    backgroundColor: Colors.white,
    borderRadius: 15,
    position: 'absolute',
    bottom: 10,
    left: 8,
  },
  cloudPart3: {
    width: 24,
    height: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    position: 'absolute',
    bottom: 8,
    left: 28,
  },
  star: {
    backgroundColor: Colors.white,
    position: 'absolute',
  },
  sunContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sun: {
    zIndex: 1,
  },
  sunGlow: {
    position: 'absolute',
    backgroundColor: Colors.yellow,
    opacity: 0.3,
  },
  moon: {
    backgroundColor: '#F1F5F9',
    position: 'absolute',
  },
  moonCrater: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  moonCraterSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
