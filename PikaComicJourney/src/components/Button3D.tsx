import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, View, Dimensions } from 'react-native';
import { buttonFeedback } from '../utils/sounds';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

type ButtonColor = 'orange' | 'green' | 'purple' | 'yellow' | 'blue' | 'pink';

interface Button3DProps {
  title: string;
  onPress: () => void;
  color?: ButtonColor;
  size?: 'small' | 'medium' | 'large';
}

const COLORS: Record<ButtonColor, { main: string; shadow: string; text: string }> = {
  orange: { main: '#FF6B35', shadow: '#CC4D1A', text: '#fff' },
  green: { main: '#10B981', shadow: '#059669', text: '#fff' },
  purple: { main: '#8B5CF6', shadow: '#6D3FD9', text: '#fff' },
  yellow: { main: '#FFD93D', shadow: '#E6B800', text: '#1E293B' },
  blue: { main: '#3B82F6', shadow: '#2563EB', text: '#fff' },
  pink: { main: '#EC4899', shadow: '#DB2777', text: '#fff' },
};

const SIZES = {
  small: {
    paddingVertical: isCompact ? 8 : 10,
    paddingHorizontal: isCompact ? 16 : 20,
    fontSize: isCompact ? 12 : 13,
    borderRadius: 12,
    outerRadius: 14,
    depth: 4,
  },
  medium: {
    paddingVertical: isCompact ? 12 : 14,
    paddingHorizontal: isCompact ? 24 : 28,
    fontSize: isCompact ? 14 : 15,
    borderRadius: 14,
    outerRadius: 18,
    depth: 5,
  },
  large: {
    paddingVertical: isCompact ? 14 : 18,
    paddingHorizontal: isCompact ? 28 : 36,
    fontSize: isCompact ? 15 : 18,
    borderRadius: 18,
    outerRadius: 22,
    depth: 6,
  },
};

export const Button3D: React.FC<Button3DProps> = ({
  title,
  onPress,
  color = 'orange',
  size = 'medium',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const colorScheme = COLORS[color];
  const sizeScheme = SIZES[size];

  const handlePress = () => {
    buttonFeedback();
    onPress();
  };

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={handlePress}
      style={[
        styles.outer,
        {
          backgroundColor: colorScheme.shadow,
          borderRadius: sizeScheme.outerRadius,
          paddingBottom: isPressed ? 1 : sizeScheme.depth,
          marginTop: isPressed ? sizeScheme.depth - 1 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            backgroundColor: colorScheme.main,
            paddingVertical: sizeScheme.paddingVertical,
            paddingHorizontal: sizeScheme.paddingHorizontal,
            borderRadius: sizeScheme.borderRadius,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: sizeScheme.fontSize,
              color: colorScheme.text,
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    elevation: 6,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
