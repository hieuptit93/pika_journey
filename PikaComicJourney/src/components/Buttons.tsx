import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    translateY.value = withSpring(2, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.primaryWrapper, animatedStyle, disabled && styles.disabled, style]}
    >
      <View style={styles.primary3dShadow} />
      <LinearGradient
        colors={Colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.primaryGradient}
      >
        <Text style={[styles.primaryText, textStyle]}>{children}</Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    translateY.value = withSpring(2, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.secondaryWrapper, animatedStyle, disabled && styles.disabled, style]}
    >
      <View style={styles.secondary3dShadow} />
      <View style={styles.secondary}>
        <Text style={[styles.secondaryText, textStyle]}>{children}</Text>
      </View>
    </AnimatedTouchable>
  );
};

export const NextButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    translateY.value = withSpring(2, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.nextWrapper, animatedStyle, disabled && styles.disabled, style]}
    >
      <View style={styles.next3dShadow} />
      <LinearGradient
        colors={Colors.gradientOcean}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.nextGradient}
      >
        <Text style={[styles.nextText, textStyle]}>{children}</Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

export const GhostButton: React.FC<ButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    translateY.value = withSpring(2, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.ghostWrapper, animatedStyle, style]}
    >
      <View style={styles.ghost3dShadow} />
      <View style={styles.ghost}>
        <Text style={[styles.ghostText, textStyle]}>{children}</Text>
      </View>
    </AnimatedTouchable>
  );
};

interface ChoiceButtonProps extends ButtonProps {
  emoji: string;
  variant?: 'a' | 'b' | 'c';
  selected?: boolean;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  onPress,
  children,
  emoji,
  variant = 'a',
  selected = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const gradients = {
    a: Colors.gradientOcean,
    b: Colors.gradientSunset,
    c: Colors.gradientForest,
  };

  const shadowColors = {
    a: '#2563EB',
    b: '#DC2626',
    c: '#059669',
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
    translateY.value = withSpring(3, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    translateY.value = withSpring(0, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.choiceWrapper, animatedStyle, style]}
    >
      <View style={[styles.choice3dShadow, selected && { backgroundColor: Colors.primary }]} />
      <View style={[styles.choice, selected && styles.choiceSelected]}>
        <LinearGradient
          colors={gradients[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.choiceEmoji}
        >
          <Text style={styles.choiceEmojiText}>{emoji}</Text>
        </LinearGradient>
        <Text style={styles.choiceText}>{children}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  // Primary Button - 3D style
  primaryWrapper: {
    position: 'relative',
  },
  primary3dShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: Colors.primaryDark,
    borderRadius: Radius.lg,
  },
  primaryGradient: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    ...Typography.button,
    color: Colors.white,
  },

  // Secondary Button - 3D style
  secondaryWrapper: {
    position: 'relative',
  },
  secondary3dShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.lg,
  },
  secondary: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  secondaryText: {
    ...Typography.button,
    color: Colors.text,
  },

  // Next Button - 3D style
  nextWrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  next3dShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: '#2563EB',
    borderRadius: Radius.md,
  },
  nextGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  nextText: {
    ...Typography.buttonSmall,
    color: Colors.white,
  },

  // Ghost Button - 3D style
  ghostWrapper: {
    position: 'relative',
  },
  ghost3dShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.lg,
  },
  ghost: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.grayLight,
  },
  ghostText: {
    ...Typography.buttonSmall,
    color: Colors.textSecondary,
  },

  // Choice Button - 3D style
  choiceWrapper: {
    position: 'relative',
  },
  choice3dShadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    bottom: -4,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.lg,
  },
  choice: {
    padding: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  choiceSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  choiceEmoji: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceEmojiText: {
    fontSize: 22,
  },
  choiceText: {
    ...Typography.bodySemibold,
    color: Colors.text,
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
