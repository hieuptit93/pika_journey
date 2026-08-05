import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import Svg, { Line, Path, Circle, Text as SvgText, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withDelay } from 'react-native-reanimated';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const Screen7Regression: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showWarning, setShowWarning] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const goodPathProgress = useSharedValue(0);
  const badPathProgress = useSharedValue(0);

  useEffect(() => {
    goodPathProgress.value = withDelay(400, withTiming(1, { duration: 1800 }));
    badPathProgress.value = withDelay(1200, withTiming(1, { duration: 2400 }));
    setTimeout(() => setShowWarning(true), 3600);
    setTimeout(() => setShowButton(true), 4200);
  }, []);

  const goodPathProps = useAnimatedProps(() => ({
    strokeDashoffset: 600 * (1 - goodPathProgress.value),
  }));

  const badPathProps = useAnimatedProps(() => ({
    strokeDashoffset: 600 * (1 - badPathProgress.value),
  }));

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={7} currentPanel={7} />

      <ImageBackground
        source={require('../assets/images/onboard_7.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Còn một <Text style={styles.strong}>bí mật quan trọng</Text> về{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> mà cô chú cần biết trước cột mốc 400 giờ
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.chartCard, Shadows.md]}>
          <Text style={styles.chartTitle}>Kỹ năng nói theo thời gian</Text>

          <Svg width="100%" height={140} viewBox="0 0 300 140">
            <Line x1="20" y1="120" x2="290" y2="120" stroke={Colors.text} strokeWidth="1.5" />
            <Line x1="20" y1="120" x2="20" y2="10" stroke={Colors.text} strokeWidth="1.5" />

            <SvgText x="14" y="14" fontSize="9" fontWeight="700" textAnchor="end" fill={Colors.textSecondary}>Giỏi</SvgText>
            <SvgText x="14" y="118" fontSize="9" fontWeight="700" textAnchor="end" fill={Colors.textSecondary}>0</SvgText>
            <SvgText x="20" y="135" fontSize="9" fontWeight="700" fill={Colors.textSecondary}>bắt đầu</SvgText>
            <SvgText x="155" y="135" fontSize="9" fontWeight="800" textAnchor="middle" fill={Colors.accent}>⚠ NGẮT</SvgText>

            <Rect x="155" y="10" width="135" height="110" fill={Colors.accent} opacity={0.06} />
            <Line x1="155" y1="10" x2="155" y2="120" stroke={Colors.accent} strokeWidth="1.5" strokeDasharray="3 3" />

            <AnimatedPath
              d="M 20 110 Q 80 90 140 60 T 290 20"
              fill="none"
              stroke={Colors.mint}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="600"
              animatedProps={goodPathProps}
            />

            <AnimatedPath
              d="M 20 110 Q 80 90 140 60 L 155 58 Q 200 78 240 96 T 290 108"
              fill="none"
              stroke={Colors.accent}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 4"
              animatedProps={badPathProps}
            />

            <Circle cx="290" cy="20" r="5" fill={Colors.mint} stroke={Colors.text} strokeWidth="2" />
            <Circle cx="290" cy="108" r="5" fill={Colors.accent} stroke={Colors.text} strokeWidth="2" />
          </Svg>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: Colors.mint }]} />
              <Text style={styles.legendText}>Có Pika hàng ngày</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: Colors.accent, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.accent }]} />
              <Text style={styles.legendText}>Ngắt quãng</Text>
            </View>
          </View>
        </View>

        {showWarning && (
          <View style={[styles.warningCard, Shadows.sm]}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>!</Text>
            </View>
            <Text style={styles.warningText}>
              Trước cột mốc <Text style={styles.warningBold}>400 giờ</Text>, nếu ngừng nói vài tuần thì phản xạ{' '}
              <Text style={styles.warningBold}>tụt nhanh</Text>. Đây là lý do{' '}
              <Text style={styles.warningBold}>luyện hàng ngày</Text> quan trọng hơn nhiều việc học dồn cuối tuần.
            </Text>
          </View>
        )}

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(4)}>
            Cùng xem giải pháp của Pika
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
  sfx: {
    position: 'absolute',
    top: '14%',
    left: '6%',
    fontWeight: '800',
    fontSize: 28,
    color: Colors.accent,
    transform: [{ rotate: '-12deg' }],
  },
  pikaContainer: {
    position: 'absolute',
    bottom: '6%',
    alignSelf: 'center',
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
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  chartTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendSwatch: {
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  legendText: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  warningIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  warningText: {
    flex: 1,
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: '800',
    color: Colors.accent,
  },
});
