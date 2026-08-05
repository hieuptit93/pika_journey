import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { HERO_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, GhostButton } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

export const Screen0Hero: React.FC = () => {
  const { setCurrentScreen } = useJourney();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/onboard_0.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        {/* Speech bubble */}
        <Bubble show delay={300}>
          <Text style={styles.bubbleText}>
            Chào cô chú! Pika đây!{'\n'}
            Pika muốn kể một câu chuyện nhỏ về việc{' '}
            <Text style={styles.em}>học tiếng Anh</Text> của bạn nhỏ nhà mình
          </Text>
        </Bubble>
      </ImageBackground>

      {/* Bottom interaction area */}
      <View style={styles.interaction}>
        {/* Tag */}
        <LinearGradient
          colors={Colors.gradientSunset}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroTag}
        >
          <Text style={styles.heroTagText}>COMIC JOURNEY</Text>
        </LinearGradient>

        {/* Title */}
        <Text style={styles.heroTitle}>
          Hành trình cùng{'\n'}
          <Text style={styles.titleHighlight}>Pika</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.heroSub}>
          14 panel ngắn — Pika kiểm tra tiếng Anh của bạn nhỏ, vẽ bản đồ cột mốc, và chỉ ra khoa học đằng sau việc nói mỗi ngày.
        </Text>

        {/* CTA Buttons */}
        <View style={styles.buttonGroup}>
          <PrimaryButton onPress={() => setCurrentScreen(1)}>
            Bắt đầu khám phá
          </PrimaryButton>

          <GhostButton onPress={() => setCurrentScreen('home')}>
            Trải nghiệm ngay
          </GhostButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sceneImage: {
    height: height * HERO_HEIGHT_RATIO,
    width: '100%',
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  em: {
    ...Typography.bodySemibold,
    color: Colors.orange,
  },
  interaction: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  heroTag: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    marginBottom: Spacing.xs,
  },
  heroTagText: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 1,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
  },
  titleHighlight: {
    color: Colors.primary,
  },
  heroSub: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.sm,
  },
});
