import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions, ImageBackground, Animated } from 'react-native';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button3D } from '../components/Button3D';
import { Toast } from '../components/Toast';
import { apiService, PlayType } from '../services/api';
import { successFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const PLAY_TYPE_MAP: Record<string, PlayType> = {
  story: 'STORY_TELLING',
  song: 'SINGING',
  english: 'SPEAK_ENGLISH',
  guess: 'CHARACTER_GUESSING',
};

const PLAY_CARDS = [
  {
    id: 'story',
    title: 'Kể chuyện',
    desc: 'Pika kể, con chọn diễn biến tiếp theo.',
    cardImage: require('../../assets/story.png'),
    stageImage: require('../assets/pika-story.png'),
    bubbleTitle: 'Bắt đầu bằng một câu chuyện 📖',
    bubbleText: 'Pika rủ con chọn nhân vật, rồi để con quyết định diễn biến tiếp theo bằng câu rất ngắn.',
  },
  {
    id: 'song',
    title: 'Hát',
    desc: 'Hát bài quen, lặp lại 1 từ thật dễ.',
    cardImage: require('../../assets/song.png'),
    stageImage: require('../assets/pika-song.png'),
    bubbleTitle: 'Cùng hát trước, nói sau 🎵',
    bubbleText: 'Pika dùng nhịp điệu quen thuộc để con vui trước, rồi mời con lặp lại 1 từ hoặc 1 câu thật dễ.',
  },
  {
    id: 'english',
    title: 'Nói tiếng Anh',
    desc: 'Câu "thần chú" nhỏ giúp con dám nói.',
    cardImage: require('../../assets/speak.png'),
    stageImage: require('../assets/pika-wave.png'),
    bubbleTitle: 'Thử nói một câu tiếng Anh 💬',
    bubbleText: 'Pika không kiểm tra bài. Pika biến câu tiếng Anh thành nhiệm vụ nhỏ để con dám mở miệng.',
  },
  {
    id: 'guess',
    title: 'Chơi game',
    desc: 'Vừa học vừa chơi, tư duy sáng ngời',
    cardImage: require('../../assets/explore.png'),
    stageImage: require('../assets/pika-explore.png'),
    bubbleTitle: 'Chơi game cùng Pika 🎮',
    bubbleText: 'Cùng Pika tham gia những trò chơi hấp dẫn, vừa học hỏi vừa khám phá thế giới lạ kì.',
  },
];

export const ScreenPlay: React.FC = () => {
  const { selectedPlay, setSelectedPlay, addStars } = useApp();
  const { user } = useAuth();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const selectedCard = PLAY_CARDS.find(c => c.id === selectedPlay) || PLAY_CARDS[0];

  // Animation refs
  const cardScales = useRef(PLAY_CARDS.map(() => new Animated.Value(1))).current;
  const pikaFloat = useRef(new Animated.Value(0)).current;
  const pikaRotate = useRef(new Animated.Value(0)).current;

  // Looping float animation for Pika
  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pikaFloat, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pikaRotate, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pikaFloat, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pikaRotate, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    floatAnimation.start();
    return () => floatAnimation.stop();
  }, []);

  const animateCardSelect = (index: number) => {
    // Pulse animation for selected card
    Animated.sequence([
      Animated.spring(cardScales[index], {
        toValue: 0.95,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
      Animated.spring(cardScales[index], {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSelectCard = (id: string, index: number) => {
    if (id !== selectedPlay) {
      animateCardSelect(index);
      setSelectedPlay(id);
      addStars(1);
      logEvent('select_play_card', 'play', { playId: id });
    }
  };

  const handlePlay = async () => {
    if (!user?.token) return;

    const playType = PLAY_TYPE_MAP[selectedPlay || 'story'];
    const playTitle = selectedCard.title;

    try {
      apiService.setToken(user.token);
      const response = await apiService.assignByPlayType(playType);
      if (response.status === 200) {
        successFeedback();
        addStars(1);
        setToastType('success');
        setToastMessage(`Đã chọn "${playTitle}"! Pika sẵn sàng rồi!`);
        setToastVisible(true);
        logEvent('assign_by_play_type', 'play', { playType, playTitle });
      }
    } catch (err) {
      console.error('Failed to assign play:', err);
      setToastType('error');
      const errorMessage = err instanceof Error ? err.message : 'Không thể bắt đầu. Thử lại nhé!';
      setToastMessage(errorMessage);
      setToastVisible(true);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/pika_play.jpeg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Con muốn chơi gì với Pika?</Text>
        <Text style={styles.headerSub}>Chọn một hoạt động bên dưới</Text>
      </View>

      {/* Main layout */}
      <View style={styles.mainLayout}>
        {/* Cards grid */}
        <View style={styles.cardsGrid}>
          {PLAY_CARDS.map((card, index) => {
            const isSelected = selectedPlay === card.id;
            return (
              <Pressable
                key={card.id}
                style={styles.cardWrapper}
                onPress={() => handleSelectCard(card.id, index)}
              >
                <Animated.View
                  style={[
                    styles.playCard,
                    isSelected && styles.playCardSelected,
                    { transform: [{ scale: cardScales[index] }] },
                  ]}
                >
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                  <Image source={card.cardImage} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={1}>{card.desc}</Text>
                  </View>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>

        {/* Pika Stage */}
        <View style={styles.pikaStage}>
          <View style={styles.stageBubble}>
            <Text style={styles.bubbleTitle}>{selectedCard.bubbleTitle}</Text>
            <Text style={styles.bubbleText}>{selectedCard.bubbleText}</Text>
          </View>
          <View style={styles.stageContent}>
            <Animated.Image
              source={selectedCard.stageImage}
              style={[
                styles.pikaImage,
                {
                  transform: [
                    {
                      translateY: pikaFloat.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                    {
                      rotate: pikaRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '5deg'],
                      }),
                    },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.playButtonContainer}>
            <Button3D title="CHƠI NGAY" onPress={handlePlay} color="orange" size="medium" />
          </View>
        </View>
      </View>

      {/* Toast */}
      <Toast
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isCompact ? 12 : 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: isCompact ? 10 : 14,
  },
  headerTitle: {
    fontSize: isCompact ? 20 : 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  headerSub: {
    fontSize: isCompact ? 12 : 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: isCompact ? 12 : 16,
  },
  cardsGrid: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isCompact ? 8 : 10,
    alignContent: 'stretch',
  },
  cardWrapper: {
    width: '48.5%',
    height: '48.5%',
  },
  playCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
    elevation: 4,
  },
  playCardSelected: {
    borderColor: '#3B82F6',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  checkText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  cardImage: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E8F4FD',
  },
  cardBottom: {
    padding: isCompact ? 8 : 10,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardDesc: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '600',
    color: '#64748B',
  },
  pikaStage: {
    flex: 2,
    padding: isCompact ? 12 : 16,
    justifyContent: 'space-between',
  },
  playButtonContainer: {
    alignItems: 'flex-end',
  },
  stageContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pikaImage: {
    width: '85%',
    height: '85%',
  },
  stageBubble: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: isCompact ? 10 : 12,
  },
  bubbleTitle: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  bubbleText: {
    fontSize: isCompact ? 10 : 12,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: isCompact ? 14 : 17,
    textAlign: 'center',
  },
});
