import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

interface StatRowProps {
  emoji: string;
  label: string;
  value: string;
  percent: number;
  gradient: readonly [string, string];
  delay: number;
  highlight?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ emoji, label, value, percent, gradient, delay, highlight }) => {
  const width = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    width.value = withDelay(delay + 200, withTiming(percent, { duration: 1200 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: (1 - opacity.value) * 10 }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <Animated.View style={[styles.statRow, Shadows.sm, containerStyle]}>
      <View style={styles.statHead}>
        <View style={styles.statLabel}>
          <Text style={styles.statEmoji}>{emoji}</Text>
          <Text style={[styles.statLabelText, highlight && styles.statLabelBold]}>{label}</Text>
        </View>
        <Text style={[styles.statVal, highlight && styles.statValHighlight]}>{value}</Text>
      </View>
      <View style={styles.statTrack}>
        <Animated.View style={[styles.statFillContainer, fillStyle]}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statFill}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export const Screen3Diagnostic: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showVerdict, setShowVerdict] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const vocabPct = Math.max(40, kid.vocab * 18);
  const grammarPct = Math.max(40, kid.grammar * 18);
  const speakingPct = Math.min(28, Math.max(8, kid.speaking * 4));

  const vocabLabel = ['Yếu', 'Cần luyện', 'Khá', 'Khá', 'Tốt', 'Tốt'][kid.vocab] || 'Khá';
  const grammarLabel = ['Yếu', 'Cần luyện', 'Khá', 'Khá', 'Tốt', 'Tốt'][kid.grammar] || 'Ổn';

  const durMap: Record<string, string> = {
    '<6m': '< 6 tháng',
    '6-12m': '6–12 tháng',
    '1-2y': '1–2 năm',
    '2y+': '> 2 năm',
  };
  const extraMap: Record<string, string> = {
    center: 'học thêm trung tâm',
    online: 'có app online',
    none: 'chỉ ở trường',
  };

  useEffect(() => {
    const verdictTimer = setTimeout(() => setShowVerdict(true), 2800);
    const buttonTimer = setTimeout(() => setShowButton(true), 3400);
    return () => {
      clearTimeout(verdictTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={3} currentPanel={3} />

      <ImageBackground
        source={require('../assets/images/onboard_3.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Cùng overview lại trình độ của{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> nhé ạ
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        {/* Patient Card */}
        <View style={[styles.chartHead, Shadows.md]}>
          <LinearGradient colors={Colors.gradientSunset} style={styles.chartStamp}>
            <Text style={styles.chartStampText}>KHÁM</Text>
          </LinearGradient>
          <View style={styles.chartName}>
            <Text style={styles.chartNameText}>
              Bé {kid.name || 'Nameless'} — {kid.age} tuổi
            </Text>
            <Text style={styles.chartSubText}>
              {kid.duration ? `Học ${durMap[kid.duration]}` : 'Đang khám…'}
              {kid.extra ? ` · ${extraMap[kid.extra]}` : ''}
            </Text>
          </View>
        </View>

        <StatRow
          emoji=""
          label="Từ vựng"
          value={vocabLabel}
          percent={vocabPct}
          gradient={Colors.gradientPrimary}
          delay={700}
        />

        <StatRow
          emoji=""
          label="Ngữ pháp"
          value={grammarLabel}
          percent={grammarPct}
          gradient={Colors.gradientForest}
          delay={1200}
        />

        <StatRow
          emoji=""
          label="Kỹ năng Nói"
          value="⚠️ Rất thiếu"
          percent={speakingPct}
          gradient={Colors.gradientWarm}
          delay={1900}
          highlight
        />

        {/* Verdict */}
        {showVerdict && (
          <View style={[styles.verdict, Shadows.sm]}>
            <Text style={styles.verdictText}>
              🩺 <Text style={styles.verdictBold}>Đánh giá:</Text> {kid.name || 'Bạn nhỏ'} có nền tảng từ vựng và ngữ pháp {vocabLabel.toLowerCase()}, nhưng kỹ năng nói đang thiếu thời lượng luyện tập đáng kể. Cần tăng cường luyện nói mỗi ngày!
            </Text>
          </View>
        )}

        {/* Next button */}
        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(5)}>
            Cột mốc cần đạt
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
  chartHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  chartStamp: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  chartStampText: {
    ...Typography.captionSmall,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.white,
  },
  chartName: {
    flex: 1,
  },
  chartNameText: {
    ...Typography.bodySemibold,
    color: Colors.text,
  },
  chartSubText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statRow: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  statHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statEmoji: {
    fontSize: 18,
  },
  statLabelText: {
    ...Typography.body,
    color: Colors.text,
  },
  statLabelBold: {
    fontWeight: '700',
  },
  statVal: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  statValHighlight: {
    color: Colors.orange,
    fontWeight: '700',
  },
  statTrack: {
    height: 12,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  statFillContainer: {
    height: '100%',
  },
  statFill: {
    flex: 1,
    borderRadius: Radius.full,
  },
  verdict: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  verdictText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 20,
  },
  verdictBold: {
    fontWeight: '800',
    color: Colors.accent,
  },
});
