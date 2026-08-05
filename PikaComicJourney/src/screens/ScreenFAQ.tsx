import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { Button3D } from '../components/Button3D';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const FAQS = [
  // === CÂU HỎI MỚI ===
  {
    id: 'price',
    icon: '💳',
    q: 'Chi phí sử dụng?',
    a: 'Gói Cơ bản:\n• 3.420.000đ cho 6 tháng sử dụng phần mềm\n• 4.140.000đ cho 12 tháng + tặng thêm 2 tháng\n\nGồm robot và phần mềm.',
    color: '#EF4444',
  },
  {
    id: 'share',
    icon: '👨‍👩‍👧‍👦',
    q: 'Nhiều bạn nhỏ dùng chung 1 Pika được không?',
    a: 'Hiện tại không.\n\nPika được thiết kế để cá nhân hoá hành trình học và theo dõi tiến bộ cho một bé duy nhất.',
    color: '#6366F1',
  },
  {
    id: 'reset',
    icon: '🔄',
    q: 'Pika có thể reset cho người dùng khác không?',
    a: 'Có. Pika có thể reset để chuyển lượt sử dụng cho bạn nhỏ thứ 2, tối đa 2 bé/gia đình.\n\nVí dụ: Khi bé lớn đã lên cấp 2 hoặc vượt quá trình độ, phụ huynh có thể chuyển Pika cho em nhỏ sử dụng từ cấp 1.',
    color: '#14B8A6',
  },
  {
    id: 'warranty',
    icon: '🛡️',
    q: 'Chính sách bảo hành và hỗ trợ kỹ thuật?',
    a: '• Bảo hành chính hãng 12 tháng cho lỗi kỹ thuật, linh kiện hoặc lỗi sản xuất\n• Đổi mới 1-1 trong 15 ngày nếu robot gặp lỗi nghiêm trọng\n• Sản phẩm cần còn nguyên tem niêm phong, tem bảo hành, số seri rõ ràng và không bị tự ý tháo lắp\n\nKhông bảo hành miễn phí nếu hư hỏng do rơi vỡ, va đập, ngấm nước, cháy nổ hoặc sử dụng sai hướng dẫn.',
    color: '#F59E0B',
  },
  {
    id: 'software',
    icon: '💻',
    q: 'Robot Pika cần phần mềm để hoạt động không?',
    a: 'Có. Pika cần phần mềm để hoạt động đầy đủ.\n\nPhần mềm giúp Pika:\n• Phản hồi nhanh hơn, nói chuyện tự nhiên hơn và hiểu con tốt hơn theo thời gian\n• Cập nhật liên tục bài học, chủ đề và hoạt động mới\n• Tăng tính ổn định và sửa lỗi định kỳ\n• Ghi nhớ, cá nhân hoá hành trình học của con\n• Cập nhật và phát triển tính năng liên tục\n\nPhí duy trì phần mềm sau khi hết hạn gói: 120.000đ/tháng.',
    color: '#0EA5E9',
  },
  {
    id: 'no-software',
    icon: '🤖',
    q: 'Không có phần mềm, robot Pika làm được gì?',
    a: 'Khi không có phần mềm, Pika vẫn hoạt động ở chế độ cơ bản:\n• Trò chuyện đơn giản trong một vài chủ đề\n• Phản hồi chậm hơn và tối đa khoảng 20 phút mỗi ngày\n• Hát và kể chuyện trong kho nội dung có sẵn\n• Thực hiện một số tương tác cơ bản\n• Học 100 bài học có sẵn\n\nTuy nhiên, ở chế độ này Pika không cá nhân hoá, không còn trí nhớ về con và chưa phát huy hết khả năng đồng hành cùng bé.',
    color: '#A855F7',
  },
  // === CÂU HỎI CŨ ===
  {
    id: 'age',
    icon: '👶',
    q: 'Độ tuổi phù hợp?',
    a: 'Pika lý tưởng cho trẻ 4-10 tuổi.\n\nGiao diện và cách nói chuyện được thiết kế riêng cho từng độ tuổi.',
    color: '#F5A623',
  },
  {
    id: 'screen',
    icon: '📺',
    q: 'Có cần dùng màn hình không?',
    a: 'Pika hoạt động hoàn toàn bằng giọng nói.\n\nKhông cần điện thoại hay TV.',
    color: '#3B82F6',
  },
  {
    id: 'daily',
    icon: '⏱️',
    q: 'Mỗi ngày nên dùng bao lâu?',
    a: '15-20 phút mỗi ngày là lý tưởng.\n\nPika sẽ tự động nghỉ sau thời gian này để bảo vệ mắt và giọng.',
    color: '#10B981',
  },
  {
    id: 'data',
    icon: '🔒',
    q: 'Dữ liệu con tôi có an toàn?',
    a: 'Tất cả hội thoại được mã hoá và lưu riêng cho từng tài khoản.\n\nBa mẹ có quyền xoá bất cứ lúc nào.',
    color: '#8B5CF6',
  },
  {
    id: 'wifi',
    icon: '📶',
    q: 'Cần kết nối wifi không?',
    a: 'Có, Pika cần wifi để xử lý giọng nói và tạo nội dung.\n\nKhông có chế độ offline.',
    color: '#EC4899',
  },
];

export const ScreenFAQ: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>('price');

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Câu hỏi thường gặp</Text>
            <Text style={styles.headerSub}>Chạm vào câu hỏi để xem chi tiết</Text>
          </View>
          <Button3D title="BẮT ĐẦU NGAY" onPress={() => setCurrentScreen('play')} color="green" size="medium" />
        </View>

        {/* FAQ Grid */}
        <View style={styles.faqGrid}>
          {FAQS.map(faq => {
            const isExpanded = expandedId === faq.id;
            return (
              <Pressable
                key={faq.id}
                style={[styles.faqCard, isExpanded && styles.faqCardExpanded]}
                onPress={() => toggleExpand(faq.id)}
              >
                <View style={styles.faqHeader}>
                  <LinearGradient
                    colors={[faq.color, faq.color]}
                    style={styles.faqIcon}
                  >
                    <Text style={styles.iconText}>{faq.icon}</Text>
                  </LinearGradient>
                  <Text style={styles.faqQuestion}>{faq.q}</Text>
                  <View style={[styles.expandIcon, isExpanded && styles.expandIconOpen]}>
                    <Text style={[styles.expandIconText, isExpanded && styles.expandIconTextOpen]}>▼</Text>
                  </View>
                </View>
                {isExpanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{faq.a}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.bottomCard}>
            <View style={styles.bottomContent}>
              <Text style={styles.bottomTitle}>Vẫn còn thắc mắc?</Text>
              <Text style={styles.bottomDesc}>
                Liên hệ đội ngũ hỗ trợ của Pika qua Zalo hoặc email.
              </Text>
            </View>
            <Button3D title="LIÊN HỆ HỖ TRỢ" onPress={() => {}} color="yellow" size="medium" />
          </LinearGradient>
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
  faqGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  faqCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 3,
  },
  faqCardExpanded: {
    borderColor: '#3B82F6',
    backgroundColor: '#F0F7FF',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: isCompact ? 14 : 16,
  },
  faqIcon: {
    width: isCompact ? 44 : 50,
    height: isCompact ? 44 : 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: isCompact ? 20 : 24 },
  faqQuestion: {
    flex: 1,
    fontSize: isCompact ? 14 : 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  expandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandIconOpen: {
    backgroundColor: '#3B82F6',
    transform: [{ rotate: '180deg' }],
  },
  expandIconText: {
    fontSize: 12,
    color: '#64748B',
  },
  expandIconTextOpen: {
    color: '#fff',
  },
  faqAnswer: {
    paddingHorizontal: isCompact ? 14 : 16,
    paddingBottom: isCompact ? 14 : 16,
  },
  answerText: {
    fontSize: isCompact ? 13 : 14,
    fontWeight: '600',
    color: '#475569',
    lineHeight: isCompact ? 20 : 22,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
  },
  bottomCta: {
    marginTop: 8,
  },
  bottomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isCompact ? 20 : 24,
    borderRadius: 20,
  },
  bottomContent: {
    flex: 1,
    marginRight: 16,
  },
  bottomTitle: {
    fontSize: isCompact ? 18 : 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  bottomDesc: {
    fontSize: isCompact ? 13 : 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: isCompact ? 19 : 21,
  },
});
