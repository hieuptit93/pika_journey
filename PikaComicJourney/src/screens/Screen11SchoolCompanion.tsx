import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const SCHEDULE = [
  { day: 'T2', topic: '🐘', pika: '+15 từ' },
  { day: 'T3', topic: '🍎', pika: 'Story' },
  { day: 'T4', topic: '⛅', pika: 'Roleplay' },
  { day: 'T5', topic: '👨‍👩‍👧', pika: 'Quiz' },
  { day: 'T6', topic: '🎨', pika: 'Show & Tell' },
];

export const Screen11SchoolCompanion: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showPairing, setShowPairing] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowPairing(true), 1500);
    setTimeout(() => setShowButton(true), 2500);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={11} currentPanel={11} />

      <ImageBackground
        source={require('../assets/images/onboard_11.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            Pika theo dõi chương trình trên trường của{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> — tối là{' '}
            <Text style={styles.strong}>ôn lại + luyện nói</Text> đúng chủ đề hôm đó
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.scheduleCard, Shadows.md]}>
          <Text style={styles.scheduleTitle}>Hỗ trợ chương trình trên trường</Text>

          <View style={styles.scheduleGrid}>
            {SCHEDULE.map((item, i) => (
              <View key={item.day} style={styles.scheduleCol}>
                <Text style={styles.scheduleDay}>{item.day}</Text>
                <View style={styles.schoolCell}>
                  <Text style={styles.topicEmoji}>{item.topic}</Text>
                </View>
                <View style={styles.pikaCell}>
                  <Text style={styles.pikaCellText}>{item.pika}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.legendRow}>
            <Text style={styles.legendSchool}>Bài trường</Text>
            <Text style={styles.legendPika}>Pika ôn tối</Text>
          </View>
        </View>

        {showPairing && (
          <>
            <View style={[styles.pairingCard, Shadows.sm]}>
              <View style={styles.pairingDot} />
              <Text style={styles.pairingText}>Ôn tập, củng cố cấu trúc, từ vựng.</Text>
            </View>

            <View style={[styles.pairingCard, Shadows.sm]}>
              <View style={styles.pairingDot} />
              <Text style={styles.pairingText}>Luyện nói, nghe và giao tiếp cho các chủ đề đó.</Text>
            </View>

            <Text style={styles.hint}>Con không quá tải — ôn đúng nhịp trường</Text>
          </>
        )}

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(12)}>
            An toàn cho bạn nhỏ?
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
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  scheduleTitle: {
    ...Typography.bodySemibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  scheduleGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleCol: {
    alignItems: 'center',
    flex: 1,
  },
  scheduleDay: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  schoolCell: {
    width: 40,
    height: 40,
    backgroundColor: Colors.mintLight,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  topicEmoji: {
    fontSize: 20,
  },
  pikaCell: {
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  pikaCellText: {
    ...Typography.captionSmall,
    fontWeight: '700',
    color: Colors.orange,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  legendSchool: {
    ...Typography.captionSmall,
    color: Colors.textSecondary,
  },
  legendPika: {
    ...Typography.captionSmall,
    color: Colors.orange,
    fontWeight: '700',
  },
  pairingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  pairingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  pairingText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.text,
  },
  hint: {
    ...Typography.body,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
