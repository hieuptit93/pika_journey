import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { Button3D } from '../components/Button3D';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const FEATURES = [
  {
    id: 'send',
    icon: '📤',
    title: 'Giao bài 1 chạm',
    desc: 'Chọn chủ đề, gửi xuống robot ngay lập tức.',
    color: '#3B82F6',
  },
  {
    id: 'report',
    icon: '📊',
    title: 'Theo dõi tiến độ',
    desc: 'Xem con nói bao lâu, học từ nào mỗi ngày.',
    color: '#10B981',
  },
  {
    id: 'safety',
    icon: '🛡️',
    title: 'An toàn tuyệt đối',
    desc: 'Kiểm soát chủ đề, lọc nội dung, xem trí nhớ.',
    color: '#8B5CF6',
  },
];

const PHONE_DATA: Record<string, string[]> = {
  send: ['🧒 Bé 7 tuổi', '🦸 Chủ đề: siêu anh hùng', '🔊 Bài: luyện phát âm', '▶️ Gửi sang Pika'],
  report: ['⏱️ Hôm nay: nói 12 phút', '🆕 7 từ mới học', '📈 Tiến bộ 72%', '🎯 Kế tiếp: âm "sh"'],
  safety: ['✅ Chủ đề an toàn: BẬT', '🖼️ Lọc hình ảnh: BẬT', '🧠 Xem trí nhớ Pika', '🗑️ Xoá lịch sử'],
};

export const ScreenParents: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [activeFeature, setActiveFeature] = useState('send');

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>App Phụ huynh</Text>
            <Text style={styles.headerSub}>Ba mẹ cầm lái từ một app duy nhất</Text>
          </View>
          <Button3D title="THỬ NGAY" onPress={() => setCurrentScreen('topics')} color="purple" size="medium" />
        </View>

        {/* Main layout */}
        <View style={styles.mainLayout}>
          {/* Features */}
          <View style={styles.featuresCol}>
            {FEATURES.map(feature => (
              <Pressable
                key={feature.id}
                style={[styles.featureCard, activeFeature === feature.id && styles.featureCardActive]}
                onPress={() => setActiveFeature(feature.id)}
              >
                <LinearGradient
                  colors={[feature.color, feature.color]}
                  style={styles.featureIcon}
                >
                  <Text style={styles.iconText}>{feature.icon}</Text>
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
                {activeFeature === feature.id && (
                  <View style={styles.activeIndicator} />
                )}
              </Pressable>
            ))}
          </View>

          {/* Phone mockup */}
          <View style={styles.phoneSection}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneNotch} />
              <View style={styles.phoneScreen}>
                {PHONE_DATA[activeFeature]?.map((row, idx) => (
                  <View key={idx} style={styles.phoneRow}>
                    <Text style={styles.phoneRowText}>{row}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.phoneCaption}>
              Giao diện app dành cho ba mẹ
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F4FD' },
  scroll: { flex: 1 },
  content: { padding: isCompact ? 16 : 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: isCompact ? 24 : 30,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: '600',
    color: '#64748B',
  },
  mainLayout: {
    flexDirection: 'row',
    gap: isCompact ? 16 : 24,
  },
  featuresCol: {
    flex: 1,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isCompact ? 14 : 18,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
  },
  featureCardActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#F0F7FF',
  },
  featureIcon: {
    width: isCompact ? 48 : 56,
    height: isCompact ? 48 : 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: isCompact ? 22 : 26 },
  featureText: { flex: 1 },
  featureTitle: {
    fontSize: isCompact ? 15 : 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: isCompact ? 12 : 13,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: isCompact ? 17 : 19,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  phoneSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneMockup: {
    width: isCompact ? 200 : 240,
    backgroundColor: '#1E293B',
    borderRadius: 28,
    padding: 10,
    elevation: 12,
  },
  phoneNotch: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginBottom: 10,
  },
  phoneScreen: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 12,
    minHeight: isCompact ? 200 : 260,
  },
  phoneRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  phoneRowText: {
    fontSize: isCompact ? 12 : 14,
    fontWeight: '700',
    color: '#475569',
  },
  phoneCaption: {
    marginTop: 16,
    fontSize: isCompact ? 12 : 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
