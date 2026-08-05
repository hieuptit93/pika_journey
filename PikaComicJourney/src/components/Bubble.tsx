import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

interface BubbleProps {
  children: React.ReactNode;
  show?: boolean;
  position?: 'left' | 'right';
  style?: ViewStyle;
  delay?: number;
}

export const Bubble: React.FC<BubbleProps> = ({
  children,
  show = true,
  position = 'left',
  style,
  delay = 0,
}) => {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    if (show) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
      scale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 150 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.9, { duration: 200 });
      translateY.value = withTiming(-8, { duration: 200 });
    }
  }, [show, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.container, { top: insets.top + 56 }, animatedStyle, style]}>
      <View style={[styles.bubble, Shadows.lg]}>
        {typeof children === 'string' ? (
          <Text style={styles.text}>{children}</Text>
        ) : (
          children
        )}
        {/* Tail */}
        <View style={[styles.tail, position === 'right' && styles.tailRight]} />
        <View style={[styles.tailInner, position === 'right' && styles.tailInnerRight]} />
      </View>
    </Animated.View>
  );
};

// Styled text components for inside bubbles
export const BubbleText: React.FC<{ children: string; style?: any }> = ({ children, style }) => (
  <Text style={[styles.text, style]}>{children}</Text>
);

export const BubbleStrong: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.strong}>{children}</Text>
);

export const BubbleEm: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.em}>{children}</Text>
);

// Chat message bubble (for conversation screens)
interface ChatMessageProps {
  children: React.ReactNode;
  sender: 'pika' | 'kid';
  show?: boolean;
  delay?: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  children,
  sender,
  show = true,
  delay = 0,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    if (show) {
      opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
    }
  }, [show, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const isPika = sender === 'pika';

  return (
    <Animated.View
      style={[
        styles.chatMessage,
        isPika ? styles.chatPika : styles.chatKid,
        animatedStyle,
      ]}
    >
      <Text style={[styles.chatText, isPika ? styles.chatTextPika : styles.chatTextKid]}>
        {children}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 8,
  },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    maxWidth: '95%',
  },
  text: {
    ...Typography.body,
    color: Colors.text,
  },
  strong: {
    ...Typography.bodySemibold,
    color: Colors.primary,
  },
  em: {
    ...Typography.bodySemibold,
    color: Colors.orange,
    fontStyle: 'italic',
  },
  tail: {
    position: 'absolute',
    bottom: -10,
    left: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
  },
  tailInner: {
    position: 'absolute',
    bottom: -6,
    left: 32,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
  },
  tailRight: {
    left: 'auto',
    right: 28,
  },
  tailInnerRight: {
    left: 'auto',
    right: 32,
  },
  chatMessage: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginVertical: Spacing.xs,
  },
  chatPika: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    borderBottomLeftRadius: Radius.sm,
  },
  chatKid: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Radius.sm,
  },
  chatText: {
    ...Typography.caption,
  },
  chatTextPika: {
    color: Colors.text,
  },
  chatTextKid: {
    color: Colors.white,
  },
});
