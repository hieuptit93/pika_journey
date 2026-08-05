import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageBackground, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buttonFeedback, successFeedback } from '../utils/sounds';
import { apiService, ApiLesson } from '../services/api';
import { Button3D } from '../components/Button3D';
import { Toast } from '../components/Toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

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
    title: 'Làm quen với Pika',
    zone: 'Khu 1 · Làm quen',
    image: require('../assets/zone-1.png'),
    lessons: ['z1a', 'z1b', 'z1c'],
    gradient: ['#F5A623', '#CC7A00'] as const,
  },
  {
    id: 2,
    title: 'Học tiếng Anh (Pre-A1)',
    zone: 'Khu 2 · Pre-A1',
    image: require('../assets/zone-2.png'),
    lessons: ['z2a', 'z2b', 'z2c', 'z2d'],
    gradient: ['#3B82F6', '#1D4ED8'] as const,
  },
  {
    id: 3,
    title: 'Học tiếng Anh (A1/A2)',
    zone: 'Khu 3 · A1/A2',
    image: require('../assets/zone-3.png'),
    lessons: ['z3a', 'z3b', 'z3c', 'z3d'],
    gradient: ['#10B981', '#047857'] as const,
  },
  {
    id: 4,
    title: 'Mở rộng cùng Pika',
    zone: 'Khu 4 · Mở rộng',
    image: require('../assets/zone-4.png'),
    lessons: ['z4a', 'z4b', 'z4c', 'z4d'],
    gradient: ['#8B5CF6', '#6D28D9'] as const,
  },
  {
    id: 5,
    title: 'Dịp đặc biệt',
    zone: 'Khu 5 · Dịp đặc biệt',
    image: require('../assets/zone-5.png'),
    lessons: ['z5a', 'z5b', 'z5c', 'z5d'],
    gradient: ['#EC4899', '#BE185D'] as const,
  },
];

const LessonModal = ({
  visible,
  lesson,
  zoneName,
  zoneColor,
  onClose,
  onAssign,
}: {
  visible: boolean;
  lesson: Lesson | null;
  zoneName: string;
  zoneColor: string;
  onClose: () => void;
  onAssign: () => void;
}) => {
  if (!lesson) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          {/* Decorations */}
          <Text style={styles.modalStarTL}>⭐</Text>
          <Text style={styles.modalStarTR}>✨</Text>
          <Text style={styles.modalStarBL}>🌟</Text>
          <Text style={styles.modalStarBR}>💫</Text>

          {/* Close button - fun style */}
          <Pressable style={styles.modalClose} onPress={onClose}>
            <View style={styles.modalCloseInner}>
              <Text style={styles.modalCloseText}>✖️</Text>
            </View>
          </Pressable>

          {/* Ribbon banner */}
          <View style={[styles.modalRibbon, { backgroundColor: zoneColor }]}>
            <Text style={styles.modalRibbonText}>{zoneName}</Text>
          </View>

          {/* Icon bubble */}
          <View style={styles.modalIconOuter}>
            <View style={[styles.modalIcon, { backgroundColor: zoneColor + '30', borderColor: zoneColor }]}>
              <Text style={styles.modalIconText}>{lesson.ico}</Text>
            </View>
          </View>

          {/* Title & description */}
          <Text style={styles.modalTitle}>{lesson.title}</Text>
          <View style={styles.modalTimeBadge}>
            <Text style={styles.modalTimeText}>⏱️ {lesson.time}</Text>
          </View>
          <Text style={styles.modalDesc}>{lesson.desc}</Text>

          {/* Tasks with fun bullets */}
          <View style={styles.modalTasks}>
            <Text style={styles.tasksTitle}>🎯 Nhiệm vụ của con:</Text>
            {(lesson.tasks || []).map((task, idx) => (
              <View key={idx} style={[styles.taskRow, { borderLeftColor: zoneColor }]}>
                <View style={[styles.taskBullet, { backgroundColor: zoneColor }]}>
                  <Text style={styles.taskBulletText}>{idx + 1}</Text>
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskIcon}>{task[0]}</Text>
                  <Text style={styles.taskText}>{task[1]}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Actions - Button3D */}
          <View style={styles.modalActions}>
            <View style={styles.btnWrapper}>
              <Button3D title="Để sau" onPress={onClose} color="yellow" size="small" />
            </View>
            <View style={styles.btnWrapperLarge}>
              <Button3D title="📚 Giao bài" onPress={onAssign} color="green" size="small" />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const ZoneCard = ({
  zone,
  index,
  isSelected,
  onPress,
  onLessonPress,
  lessons,
}: {
  zone: typeof ZONES[0];
  index: number;
  isSelected: boolean;
  onPress: () => void;
  onLessonPress: (lessonId: string) => void;
  lessons: Record<string, Lesson>;
}) => {
  const isEven = index % 2 === 0;

  return (
    <Pressable
      style={[
        styles.cardOuter,
        { backgroundColor: zone.gradient[1] },
        {
          marginTop: isEven ? 0 : 16,
          marginBottom: isEven ? 16 : 0,
          transform: [{ rotate: isEven ? '-2deg' : '2deg' }],
        },
        isSelected && styles.cardOuterSelected,
      ]}
      onPress={onPress}
    >
      <View style={[styles.cardInner, { borderColor: zone.gradient[0] }]}>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        )}

        <Image source={zone.image} style={styles.cardImage} resizeMode="cover" />

        <LinearGradient colors={zone.gradient} style={styles.titleBar}>
          <View style={styles.numBadge}>
            <Text style={styles.numText}>{zone.id}</Text>
          </View>
          <Text style={styles.titleText} numberOfLines={1}>{zone.title}</Text>
        </LinearGradient>

        <View style={styles.lessonsWrap}>
          {zone.lessons.map((lessonId) => {
            const lesson = lessons[lessonId];
            if (!lesson) return null;
            return (
              <Pressable
                key={lessonId}
                style={[styles.lessonBtn, { borderColor: zone.gradient[0] }]}
                onPress={(e) => {
                  e.stopPropagation();
                  onLessonPress(lessonId);
                }}
              >
                <Text style={styles.lessonBtnText} numberOfLines={1}>{lesson.title}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Pressable>
  );
};

export const ScreenTopics: React.FC = () => {
  const { selectedZone, setSelectedZone, addStars } = useApp();
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState<typeof ZONES[0] | null>(null);
  const [lessons, setLessons] = useState<Record<string, Lesson>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchLessons();
  }, [user?.token]);

  const fetchLessons = async () => {
    if (!user?.token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      apiService.setToken(user.token);
      const response = await apiService.getExperienceMap();

      console.log('📦 Experience Map Response:', JSON.stringify(response, null, 2));
      console.log('📋 Lesson IDs from API:', response.data?.lessons?.map((l: ApiLesson) => l.id));

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
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectZone = (id: number) => {
    buttonFeedback();
    if (id !== selectedZone) {
      setSelectedZone(id);
      addStars(1);
    }
  };

  const handleLessonPress = (lessonId: string, zone: typeof ZONES[0]) => {
    buttonFeedback();
    setSelectedLesson(lessonId);
    setCurrentZone(zone);
    setModalVisible(true);
  };

  const handleAssign = async () => {
    if (!selectedLesson) return;

    const lessonTitle = lessons[selectedLesson]?.title || 'Bài học';

    try {
      const response = await apiService.assignLesson(selectedLesson);
      if (response.status === 200) {
        successFeedback();
        addStars(2);
        setToastMessage(`Đã giao "${lessonTitle}" thành công!`);
        setToastVisible(true);
      }
    } catch (err) {
      console.error('Failed to assign lesson:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể giao bài. Thử lại nhé!';
      setToastMessage(errorMessage);
      setToastVisible(true);
    } finally {
      setModalVisible(false);
    }
  };

  const topRow = ZONES.slice(0, 3);
  const bottomRow = ZONES.slice(3, 5);

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/graden_pika.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F5A623" />
          <Text style={styles.loadingText}>Đang tải khu vườn...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/graden_pika.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header title */}
      <View style={styles.headerTitle}>
        <Text style={styles.headerTitleText}>Hãy chọn thử một bài học muốn giao thử cho con</Text>
      </View>

      {/* Top row - 3 cards */}
      <View style={styles.cardsRow}>
        {topRow.map((zone, index) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            index={index}
            isSelected={selectedZone === zone.id}
            onPress={() => handleSelectZone(zone.id)}
            onLessonPress={(lessonId) => handleLessonPress(lessonId, zone)}
            lessons={lessons}
          />
        ))}
      </View>

      {/* Bottom row - 2 cards */}
      <View style={[styles.cardsRow, styles.bottomRow]}>
        {bottomRow.map((zone, index) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            index={index}
            isSelected={selectedZone === zone.id}
            onPress={() => handleSelectZone(zone.id)}
            onLessonPress={(lessonId) => handleLessonPress(lessonId, zone)}
            lessons={lessons}
          />
        ))}
      </View>

      {/* Lesson Modal */}
      <LessonModal
        visible={modalVisible}
        lesson={selectedLesson ? lessons[selectedLesson] : null}
        zoneName={currentZone?.zone || ''}
        zoneColor={currentZone?.gradient[0] || '#F5A623'}
        onClose={() => setModalVisible(false)}
        onAssign={handleAssign}
      />

      {/* Toast */}
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
    paddingHorizontal: isCompact ? 10 : 16,
    paddingTop: isCompact ? 4 : 8,
    paddingBottom: isCompact ? 8 : 12,
  },
  headerTitle: {
    alignItems: 'center',
    marginBottom: isCompact ? 6 : 10,
  },
  headerTitleText: {
    fontSize: isCompact ? 16 : 20,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#8B4513',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isCompact ? 8 : 12,
  },
  bottomRow: {
    marginTop: isCompact ? 8 : 12,
  },
  cardOuter: {
    width: isCompact ? '30%' : '28%',
    borderRadius: 16,
    paddingBottom: 4,
    elevation: 8,
  },
  cardOuterSelected: {
    elevation: 12,
  },
  cardInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    overflow: 'hidden',
  },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
  },
  checkText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  cardImage: {
    width: '100%',
    height: isCompact ? 55 : 70,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: isCompact ? 5 : 6,
    paddingHorizontal: isCompact ? 6 : 8,
  },
  numBadge: {
    width: isCompact ? 18 : 22,
    height: isCompact ? 18 : 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: {
    fontSize: isCompact ? 10 : 12,
    fontWeight: '900',
    color: '#333',
  },
  titleText: {
    flex: 1,
    fontSize: isCompact ? 9 : 11,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lessonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isCompact ? 4 : 5,
    padding: isCompact ? 5 : 6,
    backgroundColor: '#F8FAFC',
  },
  lessonBtn: {
    backgroundColor: '#fff',
    paddingVertical: isCompact ? 5 : 6,
    paddingHorizontal: isCompact ? 7 : 8,
    borderRadius: 8,
    borderWidth: 2,
    elevation: 2,
  },
  lessonBtnText: {
    fontSize: isCompact ? 8 : 9,
    fontWeight: '800',
    color: '#1E293B',
  },
  // Modal styles - Compact cartoon style for kids
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,42,74,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: isCompact ? '92%' : '80%',
    maxWidth: 380,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    padding: isCompact ? 12 : 14,
    paddingTop: isCompact ? 32 : 36,
    borderWidth: 4,
    borderColor: '#FFD93D',
    elevation: 20,
  },
  modalStarTL: { position: 'absolute', top: -6, left: 15, fontSize: 18 },
  modalStarTR: { position: 'absolute', top: 6, right: 40, fontSize: 14 },
  modalStarBL: { position: 'absolute', bottom: 6, left: 10, fontSize: 14 },
  modalStarBR: { position: 'absolute', bottom: -4, right: 20, fontSize: 16 },
  modalClose: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: '#CC4444',
    borderRadius: 16,
    padding: 2,
    paddingBottom: 4,
  },
  modalCloseInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB4B4',
  },
  modalCloseText: {
    fontSize: 12,
  },
  modalRibbon: {
    position: 'absolute',
    top: 8,
    left: -4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    elevation: 4,
  },
  modalRibbonText: {
    fontSize: isCompact ? 9 : 10,
    fontWeight: '900',
    color: '#fff',
  },
  modalIconOuter: {
    alignItems: 'center',
    marginBottom: 4,
  },
  modalIcon: {
    width: isCompact ? 44 : 50,
    height: isCompact ? 44 : 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  modalIconText: {
    fontSize: isCompact ? 22 : 26,
  },
  modalTitle: {
    fontSize: isCompact ? 15 : 17,
    fontWeight: '900',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalTimeBadge: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E6A800',
    marginBottom: 4,
  },
  modalTimeText: {
    fontSize: isCompact ? 9 : 10,
    fontWeight: '800',
    color: '#8B4513',
  },
  modalDesc: {
    fontSize: isCompact ? 10 : 11,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: isCompact ? 14 : 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTasks: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: isCompact ? 8 : 10,
    borderWidth: 2,
    borderColor: '#FFE66D',
    marginBottom: 10,
  },
  tasksTitle: {
    fontSize: isCompact ? 11 : 12,
    fontWeight: '900',
    color: '#8B4513',
    marginBottom: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFDF7',
    padding: isCompact ? 6 : 7,
    borderRadius: 8,
    marginBottom: 4,
    borderLeftWidth: 3,
  },
  taskBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskBulletText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskIcon: {
    fontSize: isCompact ? 12 : 14,
  },
  taskText: {
    flex: 1,
    fontSize: isCompact ? 9 : 10,
    fontWeight: '700',
    color: '#475569',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  btnWrapper: {
    flex: 1,
  },
  btnWrapperLarge: {
    flex: 1.5,
  },
});
