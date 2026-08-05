import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const SAFETY_LAYERS = [
  { emoji: '', title: 'Lọc nội dung trước phản hồi', desc: 'Mọi câu trả lời được kiểm tra — không có nội dung không phù hợp', bg: Colors.accentLight },
  { emoji: '', title: 'Luôn bám mục tiêu học', desc: 'Biết kéo bạn nhỏ về học khi đi lạc chủ đề', bg: Colors.mintLight },
  { emoji: '', title: 'Sửa nhẹ nhàng theo tuổi', desc: 'Không phủ nhận toàn câu — chỉ nhắc nhẹ từng điểm', bg: Colors.purpleLight },
  { emoji: '', title: 'Dashboard cho cô chú', desc: 'Cô chú xem được bạn nhỏ tương tác, luyện gì, chủ đề nào', bg: Colors.primarySoft },
];

const PARENT_TIPS = [
  { text: 'Đồng hành 2–3 ngày đầu để bạn nhỏ quen Pika', bold: '2–3 ngày đầu' },
  { text: 'Nhắc nhẹ mỗi tối: "Hôm nay nói với Pika chưa?"', bold: null },
  { text: 'Khen khi thấy bạn nhỏ tự chủ động — dù chỉ 5 phút', bold: 'dù chỉ 5 phút' },
  { text: 'Cô chú không cần giỏi tiếng Anh — Pika lo phần đó', bold: 'không cần giỏi tiếng Anh' },
];

const SafetyRow: React.FC<{ item: typeof SAFETY_LAYERS[0]; delay: number }> = ({ item, delay }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-10);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.safetyRow, animStyle]}>
      <View style={[styles.safetyIcon, { backgroundColor: item.bg }]}>
        <Text>{item.emoji}</Text>
      </View>
      <View style={styles.safetyBody}>
        <Text style={styles.safetyName}>{item.title}</Text>
        <Text style={styles.safetyDesc}>{item.desc}</Text>
      </View>
      <Text style={styles.safetyCheck}>✓</Text>
    </Animated.View>
  );
};

export const Screen12Safety: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showParentTips, setShowParentTips] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowParentTips(true), 2000);
    setTimeout(() => setShowButton(true), 2800);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={12} currentPanel={12} />

      <ImageBackground
        source={require('../assets/images/onboard_12.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            "AI có an toàn cho <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> không?" Pika được thiết kế như{' '}
            <Text style={styles.strong}>lan can cầu thang</Text> — giữ bạn nhỏ đi an toàn hơn rất nhiều
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.safetyCard, Shadows.md]}>
          <Text style={styles.safetyTitle}>4 LỚP BẢO VỆ</Text>
          {SAFETY_LAYERS.map((item, i) => (
            <SafetyRow key={item.title} item={item} delay={400 + i * 200} />
          ))}
        </View>

        {showParentTips && (
          <View style={[styles.parentCard, Shadows.sm]}>
            <Text style={styles.parentTitle}>Vai trò cô chú — ít nhưng quan trọng</Text>
            {PARENT_TIPS.map((tip, i) => (
              <View key={i} style={styles.parentItem}>
                <Text style={styles.parentArrow}>→</Text>
                <Text style={styles.parentText}>
                  {tip.bold ? (
                    <>
                      {tip.text.split(tip.bold)[0]}
                      <Text style={styles.parentBold}>{tip.bold}</Text>
                      {tip.text.split(tip.bold)[1]}
                    </>
                  ) : (
                    tip.text
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(13)}>
            Pika hợp với bạn nhỏ?
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
  safetyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  safetyTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  safetyIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyBody: {
    flex: 1,
  },
  safetyName: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
  },
  safetyDesc: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  safetyCheck: {
    color: Colors.mint,
    fontSize: 16,
    fontWeight: '800',
  },
  parentCard: {
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  parentTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  parentItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  parentArrow: {
    color: Colors.orange,
    fontWeight: '700',
  },
  parentText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.text,
    lineHeight: 18,
  },
  parentBold: {
    fontWeight: '800',
    color: Colors.primary,
  },
});
