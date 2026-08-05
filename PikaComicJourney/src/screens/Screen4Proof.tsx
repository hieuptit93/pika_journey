import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated as RNAnimated, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

interface MiniStatProps {
  value: string;
  label: string;
  delay: number;
}

const MiniStat: React.FC<MiniStatProps> = ({ value, label, delay }) => {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(8)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      RNAnimated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View style={[styles.miniStat, Shadows.sm, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </RNAnimated.View>
  );
};

export const Screen4Proof: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [count, setCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const target = 3195;
    const duration = 1800;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(target * progress));

      if (progress >= 1) {
        clearInterval(timer);
        setTimeout(() => setShowButton(true), 700);
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={4} currentPanel={8} />

      <ImageBackground
        source={require('../assets/images/onboard_4.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Đây là kết quả thật của 1 bạn nhỏ sau <Text style={styles.strong}>1 tháng</Text> với Pika — nếu{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> bắt đầu hôm nay cũng được như vậy!
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        {/* Big number card */}
        <View style={[styles.bigNum, Shadows.lg]}>
          <LinearGradient colors={Colors.gradientPrimary} style={styles.bigNumBadge}>
            <Text style={styles.bigNumBadgeText}>KẾT QUẢ</Text>
          </LinearGradient>
          <Text style={styles.bigNumValue}>{count.toLocaleString('vi-VN')}</Text>
          <Text style={styles.bigNumLabel}>lượt mở miệng nói tiếng Anh / 1 tháng</Text>
        </View>

        {/* Mini stats */}
        <View style={styles.miniStats}>
          <MiniStat value="20" label="ngày học" delay={0} />
          <MiniStat value="13.441" label="từ đã nói" delay={130} />
          <MiniStat value="115" label="từ mới học" delay={260} />
          <MiniStat value="23'" label="TB/buổi" delay={390} />
        </View>

        {/* Next button */}
        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(8)}>
            Pika làm gì để được vậy?
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
  bigNum: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  bigNumBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  bigNumBadgeText: {
    ...Typography.captionSmall,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.white,
  },
  bigNumValue: {
    ...Typography.numberLarge,
    letterSpacing: 2,
  },
  bigNumLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  miniStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  miniStat: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  miniStatValue: {
    ...Typography.numberSmall,
    fontSize: 20,
  },
  miniStatLabel: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
