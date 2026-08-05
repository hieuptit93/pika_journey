import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const LESSONS = [
  {
    id: 'pronunciation',
    emoji: '',
    title: 'Luyện phát âm',
    subtitle: 'Nghe mẫu → nói lại → sửa từng âm',
    gradient: Colors.gradientOcean,
    example: '"ship" /ʃɪp/ vs "sheep" /ʃiːp/\nPika đọc mẫu → bạn nhỏ nhắc lại → AI nghe → khen hoặc gợi ý sửa rất nhẹ.',
  },
  {
    id: 'phrases',
    emoji: '',
    title: 'Học cụm từ thông dụng',
    subtitle: 'Cụm dùng hàng ngày, không học rời',
    gradient: Colors.gradientForest,
    example: '"Could you please…", "What if…?", "I\'d love to…"\nPika dùng cụm trong nhiều tình huống khác nhau để bạn nhỏ nhớ tự nhiên.',
  },
  {
    id: 'roleplay',
    emoji: '',
    title: 'Nhập vai xử lý tình huống',
    subtitle: 'Tình huống thật, xử bằng tiếng Anh',
    gradient: Colors.gradientWarm,
    example: 'SCENE: "Bạn nhỏ đang mua đồ thì phát hiện làm rơi tiền — phải nói gì với cô bán hàng?"\nPika đóng vai cô bán hàng, dắt bạn nhỏ qua cuộc thoại thật.',
  },
  {
    id: 'presentation',
    emoji: '',
    title: 'Luyện thuyết trình',
    subtitle: 'Nói liền 30s–1p về 1 chủ đề',
    gradient: Colors.gradientSunset,
    example: '"Kể về môn học mình yêu thích nhất trong 1 phút"\nPika ghi âm, đếm câu, gợi ý cách mở rộng.',
  },
];

export const Screen10FeatureLessons: React.FC = () => {
  const { setCurrentScreen } = useJourney();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleLesson = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={10} currentPanel={10} />

      <ImageBackground
        source={require('../assets/images/onboard_10.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            <Text style={styles.strong}>Tính năng 2:</Text> Khi cần học có cấu trúc, Pika có sẵn{' '}
            <Text style={styles.strong}>4 kiểu bài luyện</Text> — tap để xem nhé!
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        {LESSONS.map((lesson) => {
          const isExpanded = expandedId === lesson.id;

          return (
            <TouchableOpacity
              key={lesson.id}
              activeOpacity={0.8}
              onPress={() => toggleLesson(lesson.id)}
            >
              <View style={[styles.lessonCard, Shadows.sm]}>
                <View style={styles.lessonHead}>
                  <LinearGradient colors={lesson.gradient} style={styles.lessonIcon}>
                    <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.lessonInfo}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonSub}>{lesson.subtitle}</Text>
                  </View>
                  <Text style={[styles.lessonChev, isExpanded && styles.lessonChevOpen]}>›</Text>
                </View>

                {isExpanded && (
                  <View style={styles.lessonBody}>
                    <Text style={styles.lessonExample}>{lesson.example}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.tapHint}>Tap từng kiểu bài để xem ví dụ</Text>

        <PrimaryButton onPress={() => setCurrentScreen(11)}>
          Đồng hành trường
        </PrimaryButton>
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
    gap: Spacing.sm,
  },
  lessonCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  lessonHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: {
    fontSize: 18,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
  },
  lessonSub: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  lessonChev: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  lessonChevOpen: {
    transform: [{ rotate: '90deg' }],
  },
  lessonBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  lessonExample: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  tapHint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
