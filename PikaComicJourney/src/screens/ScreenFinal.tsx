import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, GhostButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

export const ScreenFinal: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();

  return (
    <View style={styles.container}>
      <TopChrome panelNumber="🎉" currentPanel={14} />

      <ImageBackground
        source={require('../assets/images/onboard_14.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Cùng trải nghiệm các tính năng của Pika nhé!
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.interactionContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success card */}
        <View style={[styles.successCard, Shadows.lg]}>
          <LinearGradient
            colors={Colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successGradient}
          >
            <View style={styles.successIcon} />
            <Text style={styles.successTitle}>
              Cùng Pika bắt đầu hành trình của{' '}
              <Text style={styles.successName}>{kid.name || 'bạn nhỏ'}</Text>!
            </Text>
          </LinearGradient>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Mỗi ngày 30 phút — không bỏ ngày nào — Pika đồng hành cùng bạn nhỏ tới cột mốc{' '}
          <Text style={styles.highlight}>100 giờ</Text> rồi{' '}
          <Text style={styles.highlight}>400 giờ</Text> nói tiếng Anh tự nhiên.
        </Text>

        {/* CTAs */}
        <View style={styles.ctaContainer}>
          <PrimaryButton onPress={() => setCurrentScreen('qr')}>
            Đăng ký tư vấn
          </PrimaryButton>

          <GhostButton onPress={() => setCurrentScreen('home')}>
            Trải nghiệm các tính năng
          </GhostButton>

          <GhostButton onPress={() => setCurrentScreen(0)}>
            Đọc lại từ đầu
          </GhostButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneImage: {
    height: height * SCENE_HEIGHT_RATIO,
    width: '100%',
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.text,
  },
  scrollView: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    flex: 1,
  },
  interactionContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  successCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  successGradient: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },
  successTitle: {
    ...Typography.h3,
    color: Colors.white,
    textAlign: 'center',
  },
  successName: {
    color: Colors.yellowLight,
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  highlight: {
    ...Typography.bodySemibold,
    color: Colors.primary,
  },
  ctaContainer: {
    gap: Spacing.md,
  },
});
