import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
