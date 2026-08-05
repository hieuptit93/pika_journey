import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import { Bubble, PrimaryButton, TopChrome, SegmentedPicker, StarRating } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

const durationOptions = [
  { value: '<6m', label: '< 6 tháng' },
  { value: '6-12m', label: '6–12 tháng' },
  { value: '1-2y', label: '1–2 năm' },
  { value: '2y+', label: '> 2 năm' },
];

const extraOptions = [
  { value: 'center', label: 'Trung tâm' },
  { value: 'online', label: 'App / Online' },
  { value: 'none', label: 'Chỉ ở trường' },
];

export const Screen2Assessment: React.FC = () => {
  const { kid, setKid, setCurrentScreen } = useJourney();
  const [phase, setPhase] = useState<1 | 2>(1);

  const phase1Valid = kid.duration && kid.extra;
  const phase2Valid = kid.speaking > 0 && kid.vocab > 0 && kid.grammar > 0;

  const handleNext = () => {
    if (phase1Valid) {
      setPhase(2);
    }
  };

  const handleSubmit = () => {
    if (phase2Valid) {
      setCurrentScreen(3);
    }
  };

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={2} currentPanel={2} />

      <ImageBackground
        source={require('../assets/images/onboard_2.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show position="right">
          <Text style={styles.bubbleText}>
            {phase === 1
              ? <>Trải nghiệm học tiếng Anh hiện tại của <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text></>
              : <>Cô chú tự đánh giá kỹ năng của <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> nhé</>
            }
          </Text>
        </Bubble>
      </ImageBackground>

      <View style={styles.contentArea}>
        {phase === 1 ? (
          <>
            <View style={[styles.formCard, Shadows.md]}>
              <SegmentedPicker
                label="Bạn nhỏ học tiếng Anh được bao lâu rồi ạ?"
                emoji=""
                options={durationOptions}
                selectedValue={kid.duration}
                onSelect={(value) => setKid((prev) => ({ ...prev, duration: value as any }))}
                columns={4}
              />

              <View style={styles.spacer} />

              <SegmentedPicker
                label="Đang học thêm ở đâu?"
                emoji=""
                options={extraOptions}
                selectedValue={kid.extra}
                onSelect={(value) => setKid((prev) => ({ ...prev, extra: value as any }))}
                columns={3}
              />
            </View>

            <PrimaryButton onPress={handleNext} disabled={!phase1Valid}>
              Tiếp tục
            </PrimaryButton>
          </>
        ) : (
          <>
            <View style={styles.ratingsContainer}>
              <StarRating
                label="Nói (Speaking)"
                emoji=""
                value={kid.speaking}
                onSelect={(value) => setKid((prev) => ({ ...prev, speaking: value }))}
              />

              <StarRating
                label="Từ vựng (Vocabulary)"
                emoji=""
                value={kid.vocab}
                onSelect={(value) => setKid((prev) => ({ ...prev, vocab: value }))}
              />

              <StarRating
                label="Ngữ pháp (Grammar)"
                emoji=""
                value={kid.grammar}
                onSelect={(value) => setKid((prev) => ({ ...prev, grammar: value }))}
              />
            </View>

            <PrimaryButton onPress={handleSubmit} disabled={!phase2Valid}>
              Xem kết quả khám
            </PrimaryButton>
          </>
        )}
      </View>
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
  contentArea: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  spacer: {
    height: Spacing.lg,
  },
  ratingsContainer: {
    gap: Spacing.sm,
  },
});
