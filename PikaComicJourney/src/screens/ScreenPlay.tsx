import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ImageBackground,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation, Trans } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FaunaColors, FaunaFontSize, FaunaRadius, FaunaTouchTarget } from '../constants/theme';
import { apiService, PlayType } from '../services/api';
import { successFeedback, buttonFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const PLAY_TYPE_MAP: Record<string, PlayType> = {
  story: 'STORY_TELLING',
  song: 'SINGING',
  english: 'SPEAK_ENGLISH',
  guess: 'CHARACTER_GUESSING',
};

const PLAY_CARDS = [
  {
    id: 'story',
    image: require('../../assets/fauna/play-story.webp'),
    gradient: FaunaColors.playStory as [string, string],
    ico: '📖',
    sentence: 'Tell me a story, please.',
    badge: { e: '📖', name: 'Story Starter' },
  },
  {
    id: 'song',
    image: require('../../assets/fauna/play-song.webp'),
    gradient: FaunaColors.playSong as [string, string],
    ico: '🎵',
    sentence: "Let's sing together!",
    badge: { e: '🎵', name: 'Music Star' },
  },
  {
    id: 'english',
    image: require('../../assets/fauna/play-english.webp'),
    gradient: FaunaColors.playEnglish as [string, string],
    ico: '💬',
    sentence: 'I can speak English!',
    badge: { e: '✨', name: 'Magic Speaker' },
  },
  {
    id: 'guess',
    image: require('../../assets/fauna/play-guess.webp'),
    gradient: FaunaColors.playGuess as [string, string],
    ico: '🦸',
    sentence: 'I am ready.',
    badge: { e: '🦸', name: 'Brave Hero' },
  },
];

const CHAR_SPELLS = {
  elsa: { sentence: 'Elsa is brave.', badge: { e: '❄️', name: 'Ice Magic Speaker' } },
  doraemon: { sentence: 'Doraemon is funny.', badge: { e: '🔵', name: 'Magic Pocket' } },
  hero: { sentence: 'I am ready.', badge: { e: '🦸', name: 'Brave Hero' } },
};

export const ScreenPlay: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { selectedPlay, setSelectedPlay, addStars } = useApp();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const connectStepTexts = t('play.connectSteps', { returnObjects: true }) as string[];
  // Đếm số bước đã hiện thay vì lưu chữ, để đổi ngôn ngữ vẫn đúng.
  const [connectStepCount, setConnectStepCount] = useState(0);
  const [selectedChar, setSelectedChar] = useState('elsa');

  const cardScales = useRef(PLAY_CARDS.map(() => new Animated.Value(1))).current;
  const artAnims = useRef(PLAY_CARDS.map(() => new Animated.Value(0))).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState('');
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number; emoji: string}[]>([]);
  const sparkleAnims = useRef<Animated.Value[]>([]).current;

  // Set initial card scales based on selection
  useEffect(() => {
    const selectedIndex = PLAY_CARDS.findIndex(c => c.id === selectedPlay);
    PLAY_CARDS.forEach((_, i) => {
      Animated.spring(cardScales[i], {
        toValue: i === selectedIndex ? 1.02 : (selectedPlay ? 0.96 : 1),
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    const selectedIndex = PLAY_CARDS.findIndex(c => c.id === selectedPlay);
    if (selectedIndex >= 0) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(artAnims[selectedIndex], {
            toValue: 1,
            duration: 1450,
            useNativeDriver: true,
          }),
          Animated.timing(artAnims[selectedIndex], {
            toValue: 0,
            duration: 1450,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [selectedPlay]);

  // Bottom bar typewriter effect
  useEffect(() => {
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
    }

    if (selectedPlay) {
      const card = PLAY_CARDS.find(c => c.id === selectedPlay);
      if (card) {
        const fullText = `${t(`play.cards.${card.id}.challengeTitle`)} — ${t(`play.cards.${card.id}.challengeText`)}`;
        setTypedText('');

        // Animate bottom bar in
        Animated.spring(bottomBarAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }).start();

        // Typewriter effect
        let i = 0;
        typewriterRef.current = setInterval(() => {
          if (i < fullText.length) {
            setTypedText(fullText.slice(0, i + 1));
            i++;
          } else {
            if (typewriterRef.current) clearInterval(typewriterRef.current);
          }
        }, 25);
      }
    } else {
      Animated.timing(bottomBarAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [selectedPlay, i18n.language]);

  const handleCardPress = (id: string, index: number) => {
    if (id === selectedPlay) return;
    buttonFeedback();
    setSelectedPlay(id);
    addStars(1);
    logEvent('select_play_card', 'play', { playId: id });

    // Animate all cards: selected one scales up, others scale down
    PLAY_CARDS.forEach((_, i) => {
      if (i === index) {
        // Selected card: bounce then settle at 1.02
        Animated.sequence([
          Animated.spring(cardScales[i], {
            toValue: 0.95,
            friction: 5,
            tension: 300,
            useNativeDriver: true,
          }),
          Animated.spring(cardScales[i], {
            toValue: 1.02,
            friction: 6,
            tension: 150,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Other cards: scale down smoothly
        Animated.spring(cardScales[i], {
          toValue: 0.96,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }).start();
      }
    });

    // Sparkle/firework effect
    const emojis = ['✨', '⭐', '🌟', '💫', '✦', '★'];
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * s(250) - s(125),
      y: Math.random() * s(160) - s(80),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setSparkles(newSparkles);

    // Create animations for each sparkle
    const anims = newSparkles.map(() => new Animated.Value(0));
    sparkleAnims.length = 0;
    sparkleAnims.push(...anims);

    // Animate sparkles
    anims.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(i * 50),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Clear sparkles after animation
    setTimeout(() => setSparkles([]), 1000);
  };

  const handlePlayPress = () => {
    buttonFeedback();
    setShowModal(true);
  };

  const handleAssign = async () => {
    if (connecting) return;
    setConnecting(true);
    setConnectStepCount(0);

    const card = PLAY_CARDS.find(c => c.id === selectedPlay) || PLAY_CARDS[0];
    const isGuess = card.id === 'guess';
    const spell = isGuess ? CHAR_SPELLS[selectedChar as keyof typeof CHAR_SPELLS] : card;

    for (let i = 0; i < connectStepTexts.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setConnectStepCount(i + 1);
      buttonFeedback();
    }

    await new Promise(resolve => setTimeout(resolve, 700));

    if (user?.token) {
      try {
        apiService.setToken(user.token);
        const playType = PLAY_TYPE_MAP[card.id];
        await apiService.assignByPlayType(playType);
        successFeedback();
        addStars(1);
        // Tracking luôn ghi tên tiếng Việt để số liệu không bị tách theo ngôn ngữ.
        logEvent('assign_by_play_type', 'play', { playType, playTitle: i18n.t(`play.cards.${card.id}.title`, { lng: 'vi' }) });
      } catch (err) {
        console.error('Failed to assign play:', err);
      }
    }

    setConnecting(false);
    setShowModal(false);
  };

  const selectedCard = PLAY_CARDS.find(c => c.id === selectedPlay) || PLAY_CARDS[0];
  const currentSpell = selectedCard.id === 'guess'
    ? CHAR_SPELLS[selectedChar as keyof typeof CHAR_SPELLS]
    : selectedCard;

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Title */}
      <Text style={styles.title}>
        <Trans t={t} i18nKey="play.title" components={{ amber: <Text style={styles.titleAmber} /> }} />
      </Text>

      {/* Play Grid */}
      <View style={styles.playGrid}>
        {PLAY_CARDS.map((card, index) => {
          const isSelected = selectedPlay === card.id;
          return (
            <Pressable
              key={card.id}
              onPress={() => handleCardPress(card.id, index)}
              style={styles.cardWrapper}
            >
              <Animated.View
                style={[
                  styles.cardAnimWrapper,
                  { transform: [{ scale: cardScales[index] }] },
                ]}
              >
                {/* Sparkles - outside LinearGradient */}
                {isSelected && sparkles.map((spark, i) => (
                  <Animated.Text
                    key={spark.id}
                    style={[
                      styles.sparkle,
                      {
                        left: s(160) + spark.x,
                        top: s(200) + spark.y,
                        opacity: sparkleAnims[i] || 0,
                        transform: [
                          {
                            scale: sparkleAnims[i]?.interpolate?.({
                              inputRange: [0, 0.5, 1],
                              outputRange: [0, 1.5, 0.8],
                            }) || 1,
                          },
                          {
                            translateY: sparkleAnims[i]?.interpolate?.({
                              inputRange: [0, 1],
                              outputRange: [0, spark.y * 0.5],
                            }) || 0,
                          },
                        ],
                      },
                    ]}
                  >
                    {spark.emoji}
                  </Animated.Text>
                ))}

                <LinearGradient
                  colors={card.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.playCard,
                    isSelected && styles.playCardSelected,
                    !isSelected && selectedPlay && styles.playCardDimmed,
                  ]}
                >
                  {/* Card Top */}
                  <View style={styles.cardTop}>
                    <View style={styles.cardTopLeft}>
                      <Text style={styles.cardKicker}>{t(`play.cards.${card.id}.kicker`)}</Text>
                      <Text style={styles.cardTime}>{t(`play.cards.${card.id}.time`)}</Text>
                    </View>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Card Name */}
                  <Text style={styles.cardName}>{t(`play.cards.${card.id}.title`)}</Text>

                  {/* Card Art */}
                  <View style={styles.cardArt}>
                    <Animated.Image
                      source={card.image}
                      style={[
                        styles.cardImage,
                        isSelected && {
                          transform: [
                            {
                              translateY: artAnims[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -s(11)],
                              }),
                            },
                            {
                              rotate: artAnims[index].interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: ['-1.6deg', '1.4deg', '-1.6deg'],
                              }),
                            },
                          ],
                        },
                      ]}
                      resizeMode="contain"
                    />
                    <View style={[styles.artShadow, isSelected && styles.artShadowActive]} />
                  </View>

                  {/* Card Footer */}
                  <View style={styles.cardFoot}>
                    <Text style={styles.cardDesc}>{t(`play.cards.${card.id}.desc`)}</Text>
                    <Pressable
                      style={[styles.pillButton, isSelected && styles.pillButtonActive]}
                      onPress={handlePlayPress}
                    >
                      <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                        {t('play.playNow')}
                      </Text>
                    </Pressable>
                  </View>
                </LinearGradient>
              </Animated.View>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Bar with Typewriter */}
      {selectedPlay && (
        <Animated.View
          style={[
            styles.bottomBar,
            {
              opacity: bottomBarAnim,
              transform: [
                {
                  translateY: bottomBarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [s(60), 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.bottomBarContent}>
            <Text style={styles.bottomBarIcon}>{selectedCard.ico}</Text>
            <Text style={styles.bottomBarText} numberOfLines={2}>
              {typedText}
              <Text style={styles.cursor}>|</Text>
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Challenge Modal */}
      <Modal visible={showModal} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => !connecting && setShowModal(false)}>
          <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
            {/* Close Button */}
            <Pressable
              style={styles.closeBtn}
              onPress={() => !connecting && setShowModal(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            {/* Modal Header */}
            <View style={styles.modalHead}>
              <View style={styles.modalIcon}>
                <Text style={styles.modalIconText}>{selectedCard.ico}</Text>
              </View>
              <View style={styles.modalHeadText}>
                <Text style={styles.modalKicker}>{t('play.modalKicker')}</Text>
                <Text style={styles.modalTitle}>{t(`play.cards.${selectedCard.id}.title`)}</Text>
              </View>
            </View>

            {/* Character Chips (only for guess) */}
            {selectedCard.id === 'guess' && (
              <View style={styles.charChips}>
                {[
                  { id: 'elsa', label: '❄️ Elsa' },
                  { id: 'doraemon', label: '🔵 Doraemon' },
                  { id: 'hero', label: `🦸 ${t('play.charHero')}` },
                ].map(char => (
                  <Pressable
                    key={char.id}
                    style={[styles.charChip, selectedChar === char.id && styles.charChipActive]}
                    onPress={() => setSelectedChar(char.id)}
                  >
                    <Text style={[styles.charChipText, selectedChar === char.id && styles.charChipTextActive]}>
                      {char.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Spell */}
            <View style={styles.spellBox}>
              <Text style={styles.spellText}>"{currentSpell.sentence}"</Text>
              <Text style={styles.spellLabel}>{t('play.spellLabel')}</Text>
            </View>

            {/* Tasks */}
            <View style={styles.tasks}>
              {(t('play.tasks', { returnObjects: true }) as string[]).map((task, i) => (
                <View key={i} style={styles.taskRow}>
                  <Text style={styles.taskIcon}>{['1️⃣', '2️⃣', '3️⃣'][i]}</Text>
                  <Text style={styles.taskText}>{task}</Text>
                </View>
              ))}
            </View>

            {/* Connect Steps */}
            {connectStepCount > 0 && (
              <View style={styles.connectSteps}>
                {connectStepTexts.slice(0, connectStepCount).map((step, i) => (
                  <Text key={i} style={styles.connectStep}>{step}</Text>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.btnAmber, connecting && styles.btnDisabled]}
                onPress={handleAssign}
                disabled={connecting}
              >
                <Text style={styles.btnAmberText}>
                  {connecting ? t('play.connecting') : t('common.assignToPika')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.btnGhost}
                onPress={() => !connecting && setShowModal(false)}
                disabled={connecting}
              >
                <Text style={styles.btnGhostText}>{t('common.later')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(30),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['5xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['5xl'] * 1.16),
    color: FaunaColors.t1,
  },
  titleAmber: {
    color: FaunaColors.amber,
    textShadowColor: 'rgba(245,185,78,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: s(20),
  },
  playGrid: {
    position: 'absolute',
    left: s(107),
    top: s(184),
    width: s(738),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(26),
    overflow: 'visible',
  },
  cardWrapper: {
    width: s(356),
    overflow: 'visible',
  },
  cardAnimWrapper: {
    overflow: 'visible',
  },
  playCard: {
    height: s(413),
    borderRadius: s(28),
    padding: s(22),
    paddingBottom: s(20),
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.5)',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.45,
    shadowRadius: s(18),
    elevation: 6,
  },
  playCardSelected: {
    borderWidth: 3,
    borderColor: FaunaColors.amber,
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: s(45),
    elevation: 14,
  },
  // Selection is signalled by the amber border + glow above, NOT by fading the
  // card out — dimming the whole card also dims its text, art and CTA.
  playCardDimmed: {
    opacity: 0.94,
  },
  checkBadge: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,240,205,0.9)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.7,
    shadowRadius: s(12),
    elevation: 8,
  },
  checkText: {
    fontSize: s(20),
    fontWeight: '800',
    color: '#26200A',
  },
  sparkle: {
    position: 'absolute',
    fontSize: s(26),
    textShadowColor: 'rgba(255,220,150,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: s(10),
    zIndex: 20,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTopLeft: {
    flex: 1,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  cardKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 2,
    color: FaunaColors.t2,
    textTransform: 'uppercase',
  },
  cardTime: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 1.4,
    color: FaunaColors.amberHi,
    marginTop: s(3),
  },
  cardName: {
    marginTop: s(10),
    fontSize: s(FaunaFontSize['2xl']),
    fontWeight: '800',
    letterSpacing: -0.3,
    color: FaunaColors.t1,
  },
  cardArt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: s(150),
  },
  cardImage: {
    maxHeight: s(190),
    width: s(184),
  },
  artShadow: {
    position: 'absolute',
    bottom: s(4),
    width: s(168),
    height: s(22),
    borderRadius: s(84),
    backgroundColor: 'rgba(245,185,78,0.14)',
  },
  artShadowActive: {
    backgroundColor: 'rgba(245,185,78,0.24)',
  },
  cardFoot: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,196,234,0.45)',
    paddingTop: s(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(12),
  },
  cardDesc: {
    flex: 1,
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.xs * 1.4),
    color: '#E2E9F8',
  },
  pillButton: {
    height: s(FaunaTouchTarget.cta),
    paddingHorizontal: s(20),
    borderRadius: FaunaRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245,185,78,0.24)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.75)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.35,
    shadowRadius: s(14),
    elevation: 6,
  },
  pillButtonActive: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,245,220,0.95)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.65,
    shadowRadius: s(22),
    elevation: 12,
  },
  pillText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.amberHi,
  },
  pillTextActive: {
    color: '#26200A',
  },
  // Modal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: s(700),
    backgroundColor: FaunaColors.night2,
    borderRadius: s(40),
    padding: s(32),
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.4)',
    borderLeftColor: 'rgba(167,196,234,0.25)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(20) },
    shadowOpacity: 0.6,
    shadowRadius: s(40),
    elevation: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: s(22),
    top: s(22),
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: 'rgba(167,196,234,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: s(22),
    fontWeight: '700',
    color: FaunaColors.t1,
  },
  modalHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(18),
    marginBottom: s(24),
    paddingRight: s(60),
  },
  modalIcon: {
    width: s(72),
    height: s(72),
    borderRadius: s(26),
    backgroundColor: 'rgba(245,185,78,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIconText: {
    fontSize: s(36),
  },
  modalHeadText: {
    flex: 1,
  },
  modalKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 1.5,
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
    marginBottom: s(6),
  },
  modalTitle: {
    fontSize: s(FaunaFontSize['3xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['3xl'] * 1.2),
    color: FaunaColors.t1,
  },
  charChips: {
    flexDirection: 'row',
    gap: s(12),
    marginBottom: s(20),
  },
  charChip: {
    height: s(FaunaTouchTarget.chip),
    paddingHorizontal: s(20),
    borderRadius: s(20),
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  charChipActive: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,245,220,0.95)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.55,
    shadowRadius: s(16),
    elevation: 8,
  },
  charChipText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: '#E4EBFA',
  },
  charChipTextActive: {
    color: '#26200A',
    fontWeight: '800',
  },
  spellBox: {
    padding: s(22),
    borderRadius: s(24),
    backgroundColor: 'rgba(245,185,78,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.3)',
    alignItems: 'center',
    marginBottom: s(20),
  },
  spellText: {
    fontSize: s(FaunaFontSize.xl),
    fontWeight: '800',
    fontStyle: 'italic',
    color: FaunaColors.amberHi,
    marginBottom: s(8),
    textAlign: 'center',
  },
  spellLabel: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t3,
  },
  tasks: {
    marginBottom: s(20),
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
    paddingVertical: s(14),
    paddingHorizontal: s(18),
    backgroundColor: 'rgba(167,196,234,0.09)',
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: FaunaColors.line2,
    marginBottom: s(10),
  },
  taskIcon: {
    fontSize: s(24),
  },
  taskText: {
    flex: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.4),
    color: FaunaColors.t2,
  },
  connectSteps: {
    marginBottom: s(20),
    padding: s(18),
    backgroundColor: 'rgba(102,198,230,0.12)',
    borderRadius: s(20),
    borderWidth: 2,
    borderColor: 'rgba(102,198,230,0.35)',
  },
  connectStep: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.cyan,
    marginBottom: s(8),
  },
  modalActions: {
    flexDirection: 'row',
    gap: s(14),
  },
  btnAmber: {
    flex: 1,
    height: s(FaunaTouchTarget.cta),
    borderRadius: FaunaRadius.pill,
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,245,220,0.9)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.6,
    shadowRadius: s(22),
    elevation: 12,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnAmberText: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    color: '#26200A',
  },
  btnGhost: {
    flex: 1,
    height: s(FaunaTouchTarget.cta),
    borderRadius: FaunaRadius.pill,
    backgroundColor: 'rgba(167,196,234,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnGhostText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    color: FaunaColors.t1,
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: s(14),
    left: s(60),
    right: s(60),
    backgroundColor: 'rgba(20,32,72,0.96)',
    borderRadius: s(26),
    padding: s(16),
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.4)',
    borderLeftColor: 'rgba(167,196,234,0.22)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(10) },
    shadowOpacity: 0.5,
    shadowRadius: s(20),
    elevation: 12,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  bottomBarIcon: {
    fontSize: s(36),
  },
  bottomBarText: {
    flex: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.42),
    color: FaunaColors.t2,
  },
  cursor: {
    color: FaunaColors.amber,
    fontWeight: '400',
  },
});
