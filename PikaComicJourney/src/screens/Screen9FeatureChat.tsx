import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { SCENE_HEIGHT_RATIO } from '../constants/responsive';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { Bubble, PrimaryButton, TopChrome } from '../components';
import { useJourney } from '../context/JourneyContext';
import { Colors, Radius, Shadows, Spacing } from '../constants/colors';
import { Typography } from '../constants/theme';

const { height } = Dimensions.get('window');

interface ChatMsgProps {
  text: string;
  isPika: boolean;
  delay: number;
}

const ChatMsg: React.FC<ChatMsgProps> = ({ text, isPika, delay }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.chatMsg, isPika ? styles.pikaMsg : styles.kidMsg, animStyle]}>
      <Text style={[styles.chatMsgText, !isPika && styles.kidMsgText]}>{text}</Text>
    </Animated.View>
  );
};

const TOPICS = ['🎬 Phim', '🎮 Game', '🏫 Trường', '👨‍👩‍👧 Gia đình', '⚽ Thể thao', '🍕 Đồ ăn', '🐶 Thú cưng'];

export const Screen9FeatureChat: React.FC = () => {
  const { kid, setCurrentScreen } = useJourney();
  const [showMemory, setShowMemory] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowMemory(true), 2500);
    setTimeout(() => setShowButton(true), 3200);
  }, []);

  return (
    <View style={styles.container}>
      <TopChrome panelNumber={9} currentPanel={9} />

      <ImageBackground
        source={require('../assets/images/onboard_9.jpeg')}
        style={styles.sceneImage}
        resizeMode="cover"
      >
        <Bubble show>
          <Text style={styles.bubbleText}>
            <Text style={styles.strong}>Tính năng 1:</Text> Pika trò chuyện với{' '}
            <Text style={styles.strong}>{kid.name || 'bạn nhỏ'}</Text> như 2 người bạn — về phim, game, sở thích. Càng nói càng{' '}
            <Text style={styles.em}>hiểu bạn nhỏ hơn</Text>
          </Text>
        </Bubble>
      </ImageBackground>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.interactionContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.chatCard, Shadows.md]}>
          <ChatMsg text={`Hey ${kid.name || 'bạn nhỏ'}! Hôm qua xem Spider-Man chưa? 🕷️`} isPika={true} delay={300} />
          <ChatMsg text="Yes! Spider-Man saved a cat from a tree!" isPika={false} delay={600} />
          <ChatMsg text={'Cool! "Saved" là quá khứ của save đó. Kể tiếp đi!'} isPika={true} delay={900} />
          <ChatMsg text="He climbed the building and... umm..." isPika={false} delay={1200} />
          <ChatMsg text={'"Climbed the building" hay quá! Rồi sao nữa? 🤩'} isPika={true} delay={1500} />
        </View>

        {showMemory && (
          <View style={[styles.memoryCard, Shadows.sm]}>
            <View style={styles.memoryIconCircle} />
            <Text style={styles.memoryText}>
              <Text style={styles.memoryBold}>Pika nhớ:</Text>{' '}
              <Text style={styles.memoryEm}>{kid.name || 'bạn nhỏ'} mê siêu anh hùng</Text>, hơi nhút nhát lúc đầu, thích kể chuyện trước khi đi ngủ. Tuần sau Pika sẽ hỏi về Iron Man!
            </Text>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicsScroll}>
          <View style={styles.topicsRow}>
            {TOPICS.map((topic, i) => (
              <View key={topic} style={[styles.topicChip, Shadows.sm]}>
                <Text style={styles.topicText}>{topic}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {showButton && (
          <PrimaryButton onPress={() => setCurrentScreen(10)}>
            Bài học có cấu trúc
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
  em: {
    fontStyle: 'italic',
    color: Colors.orange,
    fontWeight: '700',
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
  chatCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  chatMsg: {
    maxWidth: '85%',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
  },
  pikaMsg: {
    backgroundColor: Colors.primaryLight,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Radius.xs,
  },
  kidMsg: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: Radius.xs,
  },
  chatMsgText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  kidMsgText: {
    color: Colors.white,
  },
  memoryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.yellowLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  memoryIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  memoryIcon: {
    fontSize: 20,
  },
  memoryText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.text,
    lineHeight: 18,
  },
  memoryBold: {
    fontWeight: '800',
  },
  memoryEm: {
    fontStyle: 'italic',
    color: Colors.orange,
  },
  topicsScroll: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  topicsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  topicChip: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  topicText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text,
  },
});
