import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GhostButton } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { width } = Dimensions.get('window');

export const ScreenQR: React.FC = () => {
  const { setCurrentScreen } = useJourney();

  return (
    <LinearGradient
      colors={['#FFF8F0', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Đăng ký tư vấn</Text>
        <Text style={styles.subtitle}>
          Quét mã QR để được tư vấn miễn phí về lộ trình học tiếng Anh cho bạn nhỏ
        </Text>

        <View style={[styles.qrCard, Shadows.lg]}>
          <Image
            source={require('../assets/images/QR.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.hint}>
          Hoặc truy cập:{'\n'}
          <Text style={styles.link}>pikarobot.edu.vn</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <GhostButton onPress={() => setCurrentScreen('f')}>
            Quay lại
          </GhostButton>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  qrImage: {
    width: width * 0.6,
    height: width * 0.6,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  link: {
    ...Typography.bodySemibold,
    color: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
  },
});
