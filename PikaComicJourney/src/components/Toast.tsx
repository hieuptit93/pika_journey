import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../constants/colors';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  type: ToastType;
  message: string;
  onHide: () => void;
  duration?: number;
}

const TOAST_CONFIG = {
  success: {
    icon: '🎉',
    backgroundColor: '#4ADE80',
    borderColor: '#22C55E',
    title: 'Tuyệt vời!',
  },
  error: {
    icon: '😢',
    backgroundColor: '#FB7185',
    borderColor: '#F43F5E',
    title: 'Ối!',
  },
  info: {
    icon: '✨',
    backgroundColor: '#60A5FA',
    borderColor: '#3B82F6',
    title: 'Thông báo',
  },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  type,
  message,
  onHide,
  duration = 2500,
}) => {
  const translateY = useSharedValue(-150);
  const config = TOAST_CONFIG[type];

  useEffect(() => {
    if (visible) {
      // Slide down
      translateY.value = withSpring(60, { damping: 15, stiffness: 120 });

      // Auto hide
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    // Slide up
    translateY.value = withSpring(-150, { damping: 15, stiffness: 120 });
    setTimeout(() => {
      onHide();
    }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.toast, { backgroundColor: config.backgroundColor, borderColor: config.borderColor }]}>
        {/* Decorative stars */}
        <View style={styles.starLeft}>
          <Text style={styles.starText}>⭐</Text>
        </View>
        <View style={styles.starRight}>
          <Text style={styles.starText}>⭐</Text>
        </View>

        {/* Main content */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{config.icon}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {/* Decorative dots */}
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
          <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
          <View style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    width: width * 0.85,
    maxWidth: 340,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    paddingVertical: Spacing.lg,
    borderWidth: 3,
    borderBottomWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginTop: 2,
  },
  starLeft: {
    position: 'absolute',
    top: -8,
    left: 20,
  },
  starRight: {
    position: 'absolute',
    top: -8,
    right: 20,
  },
  starText: {
    fontSize: 16,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
