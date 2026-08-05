import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, ActivityIndicator, Image } from 'react-native';
import { Toast, ToastType } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Colors, Radius, Spacing } from '../constants/colors';
import { s, isTablet } from '../constants/responsive';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const API_URL = 'https://robot-api.hacknao.edu.vn/robot/api/v1/temp-session/experience-map';
const ASSIGN_LESSON_URL = 'https://robot-api.hacknao.edu.vn/robot/api/v1/temp-session/assign-lesson';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  duration_label: string;
  sort_order: number;
}

interface ApiUnit {
  id: string;
  title: string;
  lessons: ApiLesson[];
  unit_number: number;
  sort_order: number;
}

interface Lesson {
  id: string;
  title: string;
  icon: string;
  duration: string;
  completed?: boolean;
}

interface Unit {
  id: string;
  number: number;
  title: string;
  gradient: readonly [string, string];
  lessons: Lesson[];
  position: { top: number; left: number };
  tabletPosition: { top: number; left: number };
}

// Gradients và positions cho 4 units
const UNIT_CONFIGS = [
  {
    gradient: ['#69c573ff', '#278234ff'] as const,
    position: { top: 0.22, left: 0.04 },
    tabletPosition: { top: 0.18, left: 0.08 },
  },
  {
    gradient: ['#A78BFA', '#8B5CF6'] as const,
    position: { top: 0.24, left: 0.58 },
    tabletPosition: { top: 0.20, left: 0.55 },
  },
  {
    gradient: ['#60A5FA', '#3B82F6'] as const,
    position: { top: 0.48, left: 0.02 },
    tabletPosition: { top: 0.42, left: 0.06 },
  },
  {
    gradient: ['#FB923C', '#F97316'] as const,
    position: { top: 0.52, left: 0.56 },
    tabletPosition: { top: 0.46, left: 0.52 },
  },
];

// Tablet: dùng giá trị cố định nhỏ hơn, không scale
const LESSON_CARD_WIDTH = isTablet ? 48 : s(38);
const LESSON_FONT_SIZE = isTablet ? 8 : s(6);
const LESSON_ICON_SIZE = isTablet ? 18 : s(14);
const HEADER_NUM_SIZE = isTablet ? 20 : s(16);
const HEADER_FONT_SIZE = isTablet ? 9 : s(7);

interface LessonMiniCardProps {
  lesson: Lesson;
  unitNumber: number;
  index: number;
  onPress: () => void;
}

interface UnitCardProps {
  unit: Unit;
  onLessonPress: (lessonId: string) => void;
}

const LessonMiniCard: React.FC<LessonMiniCardProps> = ({ lesson, unitNumber, index, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => (scale.value = withSpring(0.92))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
    >
      <Animated.View style={[styles.lessonCard, animStyle]}>
        <View style={styles.lessonNumberBadge}>
          <Text style={styles.lessonNumber}>{unitNumber}.{index + 1}</Text>
        </View>
        <Text style={styles.lessonCardTitle} numberOfLines={2}>
          {lesson.title}
        </Text>
        {lesson.icon.startsWith('http') ? (
          <Image source={{ uri: lesson.icon }} style={styles.lessonCardIconImage} />
        ) : (
          <Text style={styles.lessonCardIcon}>{lesson.icon || '📚'}</Text>
        )}
        {lesson.completed && (
          <View style={styles.lessonCheckMark}>
            <Text style={styles.lessonCheckText}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const UnitCard: React.FC<UnitCardProps> = ({ unit, onLessonPress }) => {
  const pos = isTablet ? unit.tabletPosition : unit.position;
  return (
    <View
      style={[
        styles.unitCardWrapper,
        { top: height * pos.top, left: width * pos.left },
      ]}
    >
      <View style={styles.unitCard}>
        <LinearGradient colors={unit.gradient} style={styles.unitHeader}>
          <View style={styles.unitNumberBadge}>
            <Text style={styles.unitNumberText}>{unit.number}</Text>
          </View>
          <Text style={styles.unitTitle} numberOfLines={1}>{unit.title}</Text>
        </LinearGradient>

        <View style={styles.lessonsRow}>
          {unit.lessons.map((lesson, idx) => (
            <LessonMiniCard
              key={lesson.id}
              lesson={lesson}
              unitNumber={unit.number}
              index={idx}
              onPress={() => onLessonPress(lesson.id)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const ScreenHome: React.FC = () => {
  const { user, logout } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.token) {
      fetchMapData();
    } else {
      setIsLoading(false);
      setError('Không có token. Vui lòng đăng xuất và đăng nhập lại.');
    }
  }, [user?.token]);

  const fetchMapData = async () => {
    try {
      setIsLoading(true);

      if (!user?.token) {
        setError('Không có token. Vui lòng đăng nhập lại.');
        setIsLoading(false);
        return;
      }

      console.log('Fetching map with token:', user.token.substring(0, 20) + '...');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Map API response:', JSON.stringify(data, null, 2));

      if (data.status === 200 && data.data?.units) {
        const apiUnits: ApiUnit[] = data.data.units.slice(0, 4); // Chỉ lấy tối đa 4 units

        const mappedUnits: Unit[] = apiUnits.map((apiUnit, index) => ({
          id: apiUnit.id,
          number: apiUnit.unit_number,
          title: apiUnit.title.replace(/^Unit \d+ - /, ''), // Bỏ prefix "Unit X - "
          gradient: UNIT_CONFIGS[index]?.gradient || UNIT_CONFIGS[0].gradient,
          position: UNIT_CONFIGS[index]?.position || UNIT_CONFIGS[0].position,
          tabletPosition: UNIT_CONFIGS[index]?.tabletPosition || UNIT_CONFIGS[0].tabletPosition,
          lessons: apiUnit.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            icon: lesson.icon,
            duration: lesson.duration_label,
          })),
        }));

        setUnits(mappedUnits);
      } else {
        console.log('API error:', data.message || data.data?.message);
        setError(data.message || data.data?.message || 'Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Fetch map error:', err);
      setError('Lỗi kết nối: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  const [isAssigning, setIsAssigning] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; type: ToastType; message: string }>({
    visible: false,
    type: 'success',
    message: '',
  });

  const showToast = (type: ToastType, message: string) => {
    setToast({ visible: true, type, message });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleLessonPress = async (lessonId: string) => {
    if (isAssigning || !user?.token) return;

    try {
      setIsAssigning(true);
      console.log('Assigning lesson:', lessonId);

      const response = await fetch(ASSIGN_LESSON_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ lesson_id: lessonId }),
      });

      const data = await response.json();
      console.log('Assign lesson response:', JSON.stringify(data, null, 2));

      if (data.status === 200) {
        showToast('success', 'Đã giao bài xuống robot');
      } else {
        showToast('error', data.message || 'Không thể giao bài');
      }
    } catch (err) {
      console.error('Assign lesson error:', err);
      showToast('error', 'Không thể kết nối server');
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMapData}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButtonError} onPress={logout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/map.png')}
        style={styles.mapImage}
        resizeMode="cover"
      >
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onLessonPress={handleLessonPress}
          />
        ))}

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Loading overlay when assigning lesson */}
        {isAssigning && (
          <View style={styles.assigningOverlay}>
            <ActivityIndicator size="large" color={Colors.white} />
            <Text style={styles.assigningText}>Đang giao bài...</Text>
          </View>
        )}

        {/* Toast notification */}
        <Toast
          visible={toast.visible}
          type={toast.type}
          message={toast.message}
          onHide={hideToast}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  errorText: {
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  retryText: {
    color: Colors.white,
    fontWeight: '600',
  },

  // Unit Card
  unitCardWrapper: {
    position: 'absolute',
  },
  unitCard: {
    borderRadius: Radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: isTablet ? 6 : 3,
    paddingHorizontal: isTablet ? 12 : 6,
    borderRadius: Radius.full,
    marginHorizontal: 2,
    marginTop: 2,
    gap: isTablet ? 8 : 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  unitNumberBadge: {
    width: HEADER_NUM_SIZE,
    height: HEADER_NUM_SIZE,
    borderRadius: HEADER_NUM_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  unitNumberText: {
    fontSize: isTablet ? 11 : s(9),
    fontWeight: '900',
    color: '#333',
  },
  unitTitle: {
    fontSize: HEADER_FONT_SIZE,
    fontWeight: '800',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Lessons row
  lessonsRow: {
    flexDirection: 'row',
    padding: isTablet ? 4 : 3,
    gap: isTablet ? 4 : 3,
    justifyContent: 'center',
  },

  // Lesson card
  lessonCard: {
    width: LESSON_CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: Radius.sm,
    padding: isTablet ? 4 : 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(180,180,180,0.6)',
    borderRightColor: 'rgba(200,200,200,0.5)',
  },
  lessonNumberBadge: {
    backgroundColor: Colors.grayLight,
    borderRadius: 4,
    paddingHorizontal: isTablet ? 4 : 3,
    paddingVertical: isTablet ? 2 : 1,
    marginBottom: isTablet ? 2 : 2,
  },
  lessonNumber: {
    fontSize: LESSON_FONT_SIZE,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  lessonCardTitle: {
    fontSize: LESSON_FONT_SIZE,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    height: isTablet ? 20 : s(16),
  },
  lessonCardIcon: {
    fontSize: LESSON_ICON_SIZE,
    marginTop: isTablet ? 1 : 1,
  },
  lessonCardIconImage: {
    width: LESSON_ICON_SIZE,
    height: LESSON_ICON_SIZE,
    marginTop: isTablet ? 1 : 1,
  },
  lessonCheckMark: {
    position: 'absolute',
    top: isTablet ? 2 : 1,
    right: isTablet ? 2 : 1,
    width: isTablet ? 12 : s(10),
    height: isTablet ? 12 : s(10),
    borderRadius: isTablet ? 6 : s(5),
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCheckText: {
    color: Colors.white,
    fontSize: isTablet ? 8 : s(6),
    fontWeight: '800',
  },
  logoutButton: {
    position: 'absolute',
    top: isTablet ? 20 : 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButtonError: {
    backgroundColor: Colors.textSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Radius.md,
    marginTop: Spacing.md,
  },
  assigningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigningText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
});
