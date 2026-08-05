import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface FieldInputProps {
  label: string;
  emoji?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const FieldInput: React.FC<FieldInputProps> = ({
  label,
  emoji,
  value,
  onChangeText,
  placeholder,
  maxLength,
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>
      {emoji && <Text style={styles.labelEmoji}>{emoji} </Text>}
      {label}
    </Text>
    <View style={[styles.inputWrapper, Shadows.sm]}>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        maxLength={maxLength}
        autoCapitalize="words"
      />
    </View>
  </View>
);

interface SegmentedPickerProps {
  label?: string;
  emoji?: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  columns?: number;
}

export const SegmentedPicker: React.FC<SegmentedPickerProps> = ({
  label,
  emoji,
  options,
  selectedValue,
  onSelect,
  columns = 4,
}) => (
  <View style={styles.fieldGroup}>
    {label && (
      <Text style={styles.fieldLabel}>
        {emoji && <Text style={styles.labelEmoji}>{emoji} </Text>}
        {label}
      </Text>
    )}
    <View style={styles.segmentContainer}>
      {options.map((option, index) => {
        const isSelected = selectedValue === option.value;
        return (
          <SegmentButton
            key={option.value}
            label={option.label}
            selected={isSelected}
            onPress={() => onSelect(option.value)}
            width={`${100 / columns - 2}%`}
          />
        );
      })}
    </View>
  </View>
);

interface SegmentButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  width: string;
}

const SegmentButton: React.FC<SegmentButtonProps> = ({ label, selected, onPress, width }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      activeOpacity={0.8}
      style={[{ width: width as any }, animatedStyle]}
    >
      {selected ? (
        <LinearGradient
          colors={Colors.gradientPrimary}
          style={styles.segmentButtonSelected}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.segmentTextSelected}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.segmentButton, Shadows.sm]}>
          <Text style={styles.segmentText}>{label}</Text>
        </View>
      )}
    </AnimatedTouchable>
  );
};

interface StarRatingProps {
  label: string;
  emoji?: string;
  value: number;
  onSelect: (value: number) => void;
  maxStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  label,
  emoji,
  value,
  onSelect,
  maxStars = 5,
}) => (
  <View style={[styles.ratingRow, Shadows.sm]}>
    <View style={styles.ratingHeader}>
      <Text style={styles.ratingLabel}>
        {emoji && <Text style={styles.labelEmoji}>{emoji} </Text>}
        {label}
      </Text>
    </View>
    <View style={styles.starsContainer}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const isActive = index < value;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index + 1)}
            activeOpacity={0.7}
            style={styles.starButton}
          >
            {isActive ? (
              <LinearGradient
                colors={Colors.gradientWarm}
                style={styles.starActive}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.starTextActive}>★</Text>
              </LinearGradient>
            ) : (
              <View style={styles.starInactive}>
                <Text style={styles.starTextInactive}>☆</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// Modern stat bar component
interface StatBarProps {
  label: string;
  emoji?: string;
  value: string;
  percent: number;
  color: string;
  delay?: number;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  emoji,
  value,
  percent,
  color,
}) => (
  <View style={[styles.statBar, Shadows.sm]}>
    <View style={styles.statHeader}>
      <Text style={styles.statLabel}>
        {emoji && <Text style={styles.labelEmoji}>{emoji} </Text>}
        {label}
      </Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <View style={styles.statTrack}>
      <LinearGradient
        colors={[color, color + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.statFill, { width: `${percent}%` }]}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    ...Typography.label,
    color: Colors.text,
  },
  labelEmoji: {
    fontSize: 16,
  },
  inputWrapper: {
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
  },
  fieldInput: {
    ...Typography.body,
    color: Colors.text,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  segmentButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  segmentButtonSelected: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
  },
  segmentText: {
    ...Typography.captionSmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextSelected: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.white,
  },
  ratingRow: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratingLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  starButton: {
    padding: 2,
  },
  starActive: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starInactive: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starTextActive: {
    fontSize: 20,
    color: Colors.white,
  },
  starTextInactive: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  statBar: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  statValue: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
  },
  statTrack: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: {
    height: '100%',
    borderRadius: 4,
  },
});
