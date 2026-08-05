import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const SCHOOL_DAYS = [true, false, true, false, true, false, false];

const DayDot: React.FC<{ day: string; isSchool: boolean; isPika: boolean; delay: number }> = ({ day, isSchool, isPika, delay }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.dayCol}>
      <Text style={styles.dayLabel}>{day}</Text>
      {!isPika ? (
        <Animated.View style={[styles.dayDot, isSchool ? styles.schoolDot : styles.emptyDot, animStyle]}>
          <Text style={styles.dayDotText}>{isSchool ? '✓' : '×'}</Text>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.dayDot, styles.pikaDot, animStyle]}>
          <Text style={styles.dayDotText}>★</Text>
        </Animated.View>
      )}
    </View>
  );
};

export const Screen6SchoolGap: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showComparison, setShowComparison] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const schoolBarWidth = useSharedValue(0);
  const pikaBarWidth = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => setShowComparison(true), 1500);
    setTimeout(() => {
      schoolBarWidth.value = withTiming(12, { duration: 800 });
    }, 1800);
    setTimeout(() => {
      pikaBarWidth.value = withTiming(100, { duration: 1000 });
    }, 2400);
    setTimeout(() => setShowButton(true), 3500);
  }, []);

  const schoolBarStyle = useAnimatedStyle(() => ({
    width: `${schoolBarWidth.value}%`,
  }));

  const pikaBarStyle = useAnimatedStyle(() => ({
    width: `${pikaBarWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={6} currentPanel={6} />

      <ImageBackground
        source={require('../assets/images/onboard_6.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Đi học thêm 2-3 buổi/tuần, Pika lấp đầy khoảng trống 5/7 ngày còn lại — để{' '}
            <Text style={styles.strong}>ngày nào cũng nói</Text>!
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.narrator}>7 ngày trong tuần với {kid.name || 'bạn nhỏ'}</Text>

        <View style={[styles.weekCard, Shadows.md]}>
          <Text style={styles.weekLabel}>Chỉ học trên trường:</Text>
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => (
              <DayDot key={day} day={day} isSchool={SCHOOL_DAYS[i]} isPika={false} delay={300 + i * 100} />
            ))}
          </View>

          <Text style={[styles.weekLabel, styles.pikaLabel]}>Có Pika đồng hành:</Text>
          <View style={styles.weekRow}>
            {DAYS.map((day, i) => (
              <DayDot key={`pika-${day}`} day="" isSchool={false} isPika={true} delay={1000 + i * 80} />
            ))}
          </View>
        </View>

        {showComparison && (
          <View style={[styles.compareCard, Shadows.md]}>
            <View style={styles.compareRow}>
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>Chỉ trường</Text>
                <Text style={styles.compareSubText}>nói/tuần</Text>
              </View>
              <View style={styles.compareTrack}>
                <Animated.View style={[styles.compareFillSchool, schoolBarStyle]}>
                  <Text style={styles.compareFillText}>~15p</Text>
                </Animated.View>
              </View>
            </View>

            <View style={styles.compareRow}>
              <View style={styles.compareLabel}>
                <Text style={styles.compareLabelText}>+ Pika</Text>
                <Text style={styles.compareSubText}>nói/tuần</Text>
              </View>
              <View style={styles.compareTrack}>
                <Animated.View style={styles.compareFillPika}>
                  <LinearGradient
                    colors={Colors.gradientWarm}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: Radius.sm }]}
                  />
                  <Animated.View style={[StyleSheet.absoluteFill, pikaBarStyle]}>
                    <LinearGradient
                      colors={Colors.gradientWarm}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.compareFillInner]}
                    >
                      <Text style={styles.compareFillText}>3h 30p</Text>
                    </LinearGradient>
                  </Animated.View>
                </Animated.View>
              </View>
            </View>
          </View>
        )}

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(7)}>
            Nếu ngắt quãng?
          </PrimaryButton>
        )}
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
  strong: {
    ...Typography.bodySemibold,
    color: Colors.primary,
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
    gap: Spacing.md,
  },
  narrator: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  weekCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  weekLabel: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  pikaLabel: {
    color: Colors.orange,
    marginTop: Spacing.md,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolDot: {
    backgroundColor: Colors.primarySoft,
  },
  emptyDot: {
    backgroundColor: Colors.accentLight,
  },
  pikaDot: {
    backgroundColor: Colors.yellow,
  },
  dayDotText: {
    ...Typography.captionSmall,
    fontWeight: '800',
    color: Colors.text,
  },
  compareCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  compareLabel: {
    width: 70,
  },
  compareLabelText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
  },
  compareSubText: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
  },
  compareTrack: {
    flex: 1,
    height: 28,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  compareFillSchool: {
    height: '100%',
    backgroundColor: Colors.gray,
    borderRadius: Radius.sm,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: Spacing.sm,
  },
  compareFillPika: {
    height: '100%',
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  compareFillInner: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: Spacing.sm,
    borderRadius: Radius.sm,
  },
  compareFillText: {
    ...Typography.captionSmall,
    fontWeight: '800',
    color: Colors.white,
  },
});
