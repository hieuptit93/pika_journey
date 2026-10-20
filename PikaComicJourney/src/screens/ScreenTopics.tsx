import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Modal,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buttonFeedback, successFeedback } from '../utils/sounds';
import { apiService, ApiLesson } from '../services/api';
import { Toast } from '../components/Toast';
import { logEvent } from '../services/tracking';
import { FaunaColors, FaunaFontSize, FaunaTouchTarget } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

type Lesson = {
  id: string;
  ico: string;
  title: string;
  desc: string;
  time: string;
  tasks: [string, string][];
};

const ZONES = [
  {
    id: 1,
    badge: '1',
    image: require('../../assets/fauna/isl-meet.webp'),
    lessons: ['z1a', 'z1b', 'z1c'],
    isHero: true,
    position: { left: s(80), top: s(150), width: s(792), height: s(296) },
  },
  {
    id: 2,
    badge: '2',
    image: require('../../assets/fauna/isl-prea1.webp'),
    lessons: ['z2a', 'z2b', 'z2c', 'z2d'],
    isHero: false,
    position: { left: s(80), top: s(458), width: s(386), height: s(283) },
  },
  {
    id: 3,
    badge: '3',
    image: require('../../assets/fauna/isl-castle.webp'),
    lessons: ['z3a', 'z3b', 'z3c', 'z3d'],
    isHero: false,
    position: { left: s(486), top: s(458), width: s(386), height: s(283) },
  },
  {
    id: 4,
    badge: '4',
    image: require('../../assets/fauna/isl-explore.webp'),
    lessons: ['z4a', 'z4b', 'z4c', 'z4d'],
    isHero: false,
    position: { left: s(80), top: s(753), width: s(386), height: s(283) },
  },
  {
    id: 5,
    badge: '5',
    image: require('../../assets/fauna/isl-party.webp'),
    lessons: ['z5a', 'z5b', 'z5c', 'z5d'],
    isHero: false,
    position: { left: s(486), top: s(753), width: s(386), height: s(283) },
  },
];

export const ScreenTopics: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { selectedZone, setSelectedZone, addStars } = useApp();
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState<typeof ZONES[0] | null>(null);
  const [lessons, setLessons] = useState<Record<string, Lesson>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const artAnims = useRef(ZONES.map(() => new Animated.Value(0))).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;
  const [typedText, setTypedText] = useState('');
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number; emoji: string}[]>([]);
  const [sparkleCenter, setSparkleCenter] = useState({ x: 0, y: 0 });
  const sparkleAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    fetchLessons();
  }, [user?.token]);

  useEffect(() => {
    const selectedIndex = ZONES.findIndex(z => z.id === selectedZone);
    if (selectedIndex >= 0) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(artAnims[selectedIndex], {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(artAnims[selectedIndex], {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [selectedZone]);

  const fetchLessons = async () => {
    if (!user?.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      apiService.setToken(user.token);
      const response = await apiService.getExperienceMap();

      if (response.status === 200 && response.data?.lessons) {
        const lessonsMap: Record<string, Lesson> = {};
        response.data.lessons.forEach((lesson: ApiLesson) => {
          lessonsMap[lesson.id] = {
            id: lesson.id,
            ico: lesson.ico,
            title: lesson.title,
            desc: lesson.desc,
            time: lesson.time,
            tasks: lesson.tasks,
          };
        });
        setLessons(lessonsMap);
      }
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectZone = (id: number, zoneIndex: number) => {
    buttonFeedback();
    if (id !== selectedZone) {
      setSelectedZone(id);
      addStars(1);
      // Tracking luôn ghi tên tiếng Việt để số liệu không bị tách theo ngôn ngữ.
      logEvent('select_zone', 'topics', { zoneId: id, zoneTitle: i18n.t(`topics.zones.zone${id}.title`, { lng: 'vi' }) });

      // Get zone position for sparkles
      const zone = ZONES[zoneIndex];
      const centerX = zone.position.left + zone.position.width / 2;
      const centerY = zone.position.top + zone.position.height / 2;
      setSparkleCenter({ x: centerX, y: centerY });

      // Sparkle/firework effect
      const emojis = ['✨', '⭐', '🌟', '💫', '✦', '★'];
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * s(200) - s(100),
        y: Math.random() * s(150) - s(75),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }));

      setSparkles(newSparkles);

      const anims = newSparkles.map(() => new Animated.Value(0));
      sparkleAnims.length = 0;
      sparkleAnims.push(...anims);

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

      setTimeout(() => setSparkles([]), 1000);
    }
  };

  // Bottom bar typewriter effect
  useEffect(() => {
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
    }

    if (selectedZone) {
      const zone = ZONES.find(z => z.id === selectedZone);
      if (zone) {
        const fullText = t(`topics.zones.zone${zone.id}.info`);
        setTypedText('');

        Animated.spring(bottomBarAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }).start();

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
  }, [selectedZone, i18n.language]);

  const handleLessonPress = (lessonId: string, zone: typeof ZONES[0]) => {
    buttonFeedback();
    setSelectedLesson(lessonId);
    setCurrentZone(zone);
    setModalVisible(true);
    logEvent('select_lesson', 'topics', { lessonId, zoneId: zone.id });
  };

  const handleAssign = async () => {
    if (!selectedLesson) return;

    const lessonTitle = lessons[selectedLesson]?.title || t('topics.lessonFallback');

    try {
      const response = await apiService.assignLesson(selectedLesson);
      if (response.status === 200) {
        successFeedback();
        addStars(2);
        setToastMessage(t('topics.assignSuccess', { title: lessonTitle }));
        setToastVisible(true);
        logEvent('assign_lesson', 'topics', { lessonId: selectedLesson, lessonTitle });
      }
    } catch (err) {
      console.error('Failed to assign lesson:', err);
      const errorMessage = err instanceof Error ? err.message : t('topics.assignFailed');
      setToastMessage(errorMessage);
      setToastVisible(true);
    } finally {
      setModalVisible(false);
    }
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/fauna/bg-land.webp')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={FaunaColors.amber} />
          <Text style={styles.loadingText}>{t('topics.loading')}</Text>
        </View>
      </ImageBackground>
    );
  }

  const lesson = selectedLesson ? lessons[selectedLesson] : null;

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Title */}
      <Text style={styles.title}>{t('topics.title')}</Text>
      <Text style={styles.subtitle}>{t('topics.subtitle')}</Text>

      {/* Zones */}
      {ZONES.map((zone, index) => {
        const isSelected = selectedZone === zone.id;

        if (zone.isHero) {
          return (
            <Pressable
              key={zone.id}
              onPress={() => handleSelectZone(zone.id, index)}
              style={[styles.zoneHero, zone.position, isSelected && styles.zoneSelected]}
            >
              <LinearGradient
                colors={FaunaColors.zone as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.zoneHeroGradient}
              >
                {/* Header */}
                <View style={styles.zoneHeroHead}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{zone.badge}</Text>
                  </View>
                  <Text style={styles.heroKicker}>{t(`topics.zones.zone${zone.id}.kicker`)}</Text>
                </View>

                {/* Title */}
                <Text style={styles.heroTitle}>{t(`topics.zones.zone${zone.id}.title`)}</Text>
                <Text style={styles.heroDesc}>{t(`topics.zones.zone${zone.id}.desc`)}</Text>

                {/* Chips */}
                <View style={styles.heroChips}>
                  {zone.lessons.map(lessonId => (
                    <Pressable
                      key={lessonId}
                      style={styles.chip}
                      onPress={() => handleLessonPress(lessonId, zone)}
                    >
                      <Text style={styles.chipText}>{t(`topics.chips.${lessonId}`)}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* Art */}
                <Animated.Image
                  source={zone.image}
                  style={[
                    styles.heroArt,
                    isSelected && {
                      transform: [
                        {
                          translateY: artAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -s(9)],
                          }),
                        },
                        {
                          rotate: artAnims[index].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ['-0.6deg', '0.6deg', '-0.6deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </LinearGradient>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={zone.id}
            onPress={() => handleSelectZone(zone.id, index)}
            style={[styles.zone, zone.position, isSelected && styles.zoneSelected]}
          >
            <LinearGradient
              colors={FaunaColors.zone as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zoneGradient}
            >
              {/* Art */}
              <View style={styles.zoneArt}>
                <Animated.Image
                  source={zone.image}
                  style={[
                    styles.zoneArtImage,
                    isSelected && {
                      transform: [
                        {
                          translateY: artAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -s(9)],
                          }),
                        },
                        {
                          rotate: artAnims[index].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ['-0.6deg', '0.6deg', '-0.6deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </View>

              {/* Name Row */}
              <View style={styles.zoneNameRow}>
                <View style={styles.badgeSmall}>
                  <Text style={styles.badgeTextSmall}>{zone.badge}</Text>
                </View>
                <Text style={styles.zoneName}>{t(`topics.zones.zone${zone.id}.title`)}</Text>
              </View>

              {/* Chips Grid */}
              <View style={styles.zoneChips}>
                {zone.lessons.map(lessonId => (
                  <Pressable
                    key={lessonId}
                    style={styles.zoneChip}
                    onPress={() => handleLessonPress(lessonId, zone)}
                  >
                    <Text style={styles.zoneChipText}>{t(`topics.chips.${lessonId}`)}</Text>
                  </Pressable>
                ))}
              </View>
            </LinearGradient>
          </Pressable>
        );
      })}

      {/* Sparkles */}
      {sparkles.map((spark, i) => (
        <Animated.Text
          key={spark.id}
          style={[
            styles.sparkle,
            {
              left: sparkleCenter.x + spark.x,
              top: sparkleCenter.y + spark.y,
              opacity: sparkleAnims[i] || 0,
              transform: [
                {
                  scale: sparkleAnims[i]?.interpolate?.({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 0.8],
                  }) || 1,
                },
              ],
            },
          ]}
        >
          {spark.emoji}
        </Animated.Text>
      ))}

      {/* Bottom Bar with Typewriter */}
      {selectedZone && (
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
            <Text style={styles.bottomBarIcon}>🏝️</Text>
            <Text style={styles.bottomBarText} numberOfLines={2}>
              {typedText}
              <Text style={styles.cursor}>|</Text>
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Lesson Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']}>
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modal} onPress={e => e.stopPropagation()}>
            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>

            <View style={styles.modalHead}>
              <View style={styles.modalIconWrap}>
                <Image
                  source={require('../../assets/fauna/pika-lesson.webp')}
                  style={styles.modalIcon}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.modalHeadText}>
                <Text style={styles.modalKicker}>{currentZone ? t(`topics.zones.zone${currentZone.id}.title`) : ''}</Text>
                <Text style={styles.modalTitle}>{lesson?.title}</Text>
              </View>
            </View>

            <Text style={styles.modalDesc}>{lesson?.desc}</Text>

            <View style={styles.tasks}>
              {lesson?.tasks?.map((task, i) => (
                <View key={i} style={styles.taskRow}>
                  <Text style={styles.taskIcon}>{task[0]}</Text>
                  <Text style={styles.taskText}>{task[1]}</Text>
                </View>
              ))}
            </View>

            <View style={styles.modalMeta}>
              <Text style={styles.metaItem}>⏱️ {lesson?.time}</Text>
              <Text style={styles.metaItem}>🎯 {t('topics.metaSpeakingTask')}</Text>
              <Text style={styles.metaItem}>⭐ {t('topics.metaStar')}</Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnAmber} onPress={handleAssign}>
                <Text style={styles.btnAmberText}>{t('common.assignToPika')}</Text>
              </Pressable>
              <Pressable style={styles.btnGhost} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnGhostText}>{t('common.later')}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Toast
        visible={toastVisible}
        type="success"
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: s(14),
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    color: FaunaColors.t2,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(24),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['5xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['5xl'] * 1.2),
    color: FaunaColors.t1,
  },
  subtitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(100),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.xl),
    fontWeight: '700',
    lineHeight: s(FaunaFontSize.xl * 1.25),
    color: '#F0C273',
  },
  // Hero Zone (z1)
  zoneHero: {
    position: 'absolute',
    borderRadius: s(30),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.3)',
  },
  zoneHeroGradient: {
    flex: 1,
    padding: s(20),
    paddingRight: s(26),
  },
  zoneHeroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
  },
  heroKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 2.4,
    color: FaunaColors.amberHi,
  },
  heroTitle: {
    marginTop: s(6),
    marginBottom: s(4),
    fontSize: s(FaunaFontSize['2xl']),
    fontWeight: '800',
    letterSpacing: -0.3,
    color: FaunaColors.t1,
    maxWidth: s(490),
  },
  heroDesc: {
    marginBottom: s(10),
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: '#C6D4EE',
    maxWidth: s(490),
  },
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    maxWidth: s(510),
  },
  heroArt: {
    position: 'absolute',
    right: s(26),
    top: s(32),
    width: s(216),
    height: s(228),
  },
  // Regular Zones (z2-z5)
  zone: {
    position: 'absolute',
    borderRadius: s(30),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.3)',
  },
  zoneGradient: {
    flex: 1,
  },
  zoneSelected: {
    borderWidth: 3,
    borderColor: FaunaColors.amber,
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: s(40),
    elevation: 12,
  },
  zoneArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(8),
    height: s(92),
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneArtImage: {
    maxHeight: s(90),
    maxWidth: s(220),
  },
  zoneNameRow: {
    position: 'absolute',
    left: s(22),
    right: s(22),
    top: s(104),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  zoneName: {
    flex: 1,
    fontSize: s(FaunaFontSize.xl),
    fontWeight: '800',
    letterSpacing: -0.3,
    color: FaunaColors.t1,
  },
  zoneChips: {
    position: 'absolute',
    left: s(20),
    right: s(20),
    top: s(150),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  zoneChip: {
    width: '47.5%',
    height: s(54),
    paddingHorizontal: s(8),
    borderRadius: s(18),
    backgroundColor: 'rgba(245,185,78,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneChipText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: FaunaColors.amberHi,
    textAlign: 'center',
  },
  // Shared
  badge: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,240,205,0.85)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: s(18),
    elevation: 8,
  },
  badgeText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: '#26200A',
  },
  badgeSmall: {
    width: s(42),
    height: s(42),
    borderRadius: s(21),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,240,205,0.85)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: s(16),
    elevation: 6,
  },
  badgeTextSmall: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: '#26200A',
  },
  chip: {
    height: s(54),
    paddingHorizontal: s(18),
    borderRadius: s(20),
    backgroundColor: 'rgba(245,185,78,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: FaunaColors.amberHi,
  },
  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: s(700),
    backgroundColor: 'rgba(20,32,72,0.98)',
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
    gap: s(20),
    marginBottom: s(22),
    paddingRight: s(60),
  },
  modalIconWrap: {
    width: s(86),
    height: s(86),
    borderRadius: s(30),
    backgroundColor: 'rgba(245,185,78,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon: {
    width: s(70),
    height: s(70),
  },
  modalHeadText: {
    flex: 1,
  },
  modalKicker: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: s(1.5),
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
    marginBottom: s(6),
  },
  modalTitle: {
    fontSize: s(FaunaFontSize['2xl']),
    fontWeight: '800',
    color: FaunaColors.t1,
    lineHeight: s(FaunaFontSize['2xl'] * 1.2),
  },
  modalDesc: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.45),
    color: FaunaColors.t2,
    marginBottom: s(22),
  },
  tasks: {
    marginBottom: s(22),
    gap: s(12),
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
    paddingVertical: s(16),
    paddingHorizontal: s(20),
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: s(22),
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.3)',
    shadowColor: '#1B2A57',
    shadowOffset: { width: 0, height: s(2) },
    shadowOpacity: 0.06,
    shadowRadius: s(4),
  },
  taskIcon: {
    fontSize: s(26),
  },
  taskText: {
    flex: 1,
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: '#1B2A57',
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(24),
    marginBottom: s(26),
    paddingVertical: s(16),
    backgroundColor: 'rgba(167,196,234,0.1)',
    borderRadius: s(22),
    borderWidth: 1,
    borderColor: 'rgba(167,196,234,0.2)',
  },
  metaItem: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: s(14),
  },
  btnAmber: {
    flex: 1,
    height: s(FaunaTouchTarget.cta),
    borderRadius: s(34),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(180,130,30,0.5)',
    borderBottomColor: 'rgba(160,100,20,0.7)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.6,
    shadowRadius: s(22),
    elevation: 12,
  },
  btnAmberText: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    color: '#26200A',
  },
  btnGhost: {
    flex: 1,
    height: s(FaunaTouchTarget.cta),
    borderRadius: s(34),
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
  // Sparkle
  sparkle: {
    position: 'absolute',
    fontSize: s(30),
    textShadowColor: 'rgba(255,220,150,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: s(12),
    zIndex: 100,
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
    zIndex: 50,
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
