import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';
import { ProgressDots } from './ProgressDots';

interface TopChromeProps {
  panelNumber: number | string;
  currentPanel: number;
  totalPanels?: number;
}

export const TopChrome: React.FC<TopChromeProps> = ({
  panelNumber,
  currentPanel,
  totalPanels = 14,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
      <ProgressDots total={totalPanels} current={currentPanel} />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.panelTag}
      >
        <Text style={styles.panelTagText}>
          {typeof panelNumber === 'number'
            ? `${panelNumber}/${totalPanels}`
            : panelNumber}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTag: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    minWidth: 44,
    alignItems: 'center',
  },
  panelTagText: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.text,
    fontSize: 11,
  },
});
