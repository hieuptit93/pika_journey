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

const FeatureCard: React.FC<{ emoji: string; title: string; delay: number; gradient: readonly [string, string] }> = ({
  emoji, title, delay, gradient
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.featureCard, Shadows.sm, animStyle]}>
      <LinearGradient colors={gradient} style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </LinearGradient>
      <Text style={styles.featureTitle}>{title}</Text>
    </Animated.View>
  );
};

export const Screen8PikaBrain: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowButton(true), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={8} currentPanel={8} />

      <ImageBackground
        source={require('../assets/images/onboard_8.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Pika không phải 1 chatbot — phía sau là một{' '}
            <Text style={styles.strong}>bộ não có kế hoạch</Text>. Mỗi sáng Pika tự "lập trình" hôm nay nên làm gì với{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text>
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.planCard, Shadows.md]}>
          <Text style={styles.planCardHead}>Hôm nay Pika quyết định:</Text>

          <View style={styles.planItem}>
            <Text style={styles.planTime}>7:30</Text>
            <Text style={styles.planText}>
              Khởi động bằng chủ đề <Text style={styles.em}>siêu anh hùng</Text> — bạn nhỏ thích nhất tuần qua
            </Text>
          </View>

          <View style={styles.planItem}>
            <Text style={styles.planTime}>7:35</Text>
            <Text style={styles.planText}>
              Ôn 3 từ <Text style={styles.em}>fly, save, hero</Text> — bạn nhỏ còn yếu thứ 5
            </Text>
          </View>

          <View style={styles.planItem}>
            <Text style={styles.planTime}>7:42</Text>
            <Text style={styles.planText}>
              Nhập vai bảo vệ thành phố — luyện <Text style={styles.em}>câu dài hơn 8 từ</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>3 việc Pika làm với bạn nhỏ mỗi ngày</Text>

        <View style={styles.featureRow}>
          <FeatureCard emoji="" title="Trò chuyện" delay={800} gradient={Colors.gradientPrimary} />
          <FeatureCard emoji="" title="Bài học" delay={1000} gradient={Colors.gradientForest} />
          <FeatureCard emoji="" title="Đồng hành trường" delay={1200} gradient={Colors.gradientWarm} />
        </View>

        <View style={[styles.adaptiveCard, Shadows.sm]}>
          <Text style={styles.adaptiveTitle}>Pika hiểu bạn nhỏ hơn mỗi ngày</Text>
          <View style={styles.adaptiveBar}>
            <LinearGradient
              colors={Colors.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.adaptiveFill}
            />
          </View>
          <View style={styles.adaptiveMarks}>
            <View style={styles.adaptiveMark}>
              <Text style={styles.adaptiveDay}>Ngày 1</Text>
              <Text style={styles.adaptiveDesc}>Học tên & sở thích</Text>
            </View>
            <View style={styles.adaptiveMark}>
              <Text style={styles.adaptiveDay}>Tuần 2</Text>
              <Text style={styles.adaptiveDesc}>Nhớ điểm yếu</Text>
            </View>
            <View style={styles.adaptiveMark}>
              <Text style={styles.adaptiveDay}>Tháng 3+</Text>
              <Text style={styles.adaptiveDesc}>Tự chọn bài tối ưu</Text>
            </View>
          </View>
        </View>

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(9)}>
            Xem từng tính năng
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
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  planCardHead: {
    ...Typography.bodySemibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  planItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  planTime: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    width: 40,
  },
  planText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.text,
    lineHeight: 18,
  },
  em: {
    fontStyle: 'italic',
    color: Colors.orange,
    fontWeight: '700',
  },
  sectionTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTitle: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  adaptiveCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  adaptiveTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  adaptiveBar: {
    height: 8,
    backgroundColor: Colors.grayLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  adaptiveFill: {
    height: '100%',
    width: '66%',
    borderRadius: Radius.full,
  },
  adaptiveMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adaptiveMark: {
    alignItems: 'center',
    flex: 1,
  },
  adaptiveDay: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.primary,
  },
  adaptiveDesc: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
