import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { FaunaColors, FaunaFontSize, FaunaRadius, FaunaTouchTarget } from '../constants/theme';
import { buttonFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const FAQS = [
  {
    q: 'Có phần mềm đi kèm không?',
    a: 'Có. Pika đi kèm ứng dụng di động dành cho phụ huynh để giao bài, theo dõi tiến độ và quản lý các thiết lập an toàn cho con.',
  },
  {
    q: 'Hết 6 tháng, gia hạn ở đâu?',
    a: 'Ba mẹ có thể gia hạn trực tiếp trên app phụ huynh hoặc liên hệ các điểm bán Pika để mua mã kích hoạt gói phần mềm mới.',
  },
  {
    q: 'Hết hạn phần mềm, Pika ra sao?',
    a: 'Khi hết hạn Pika Pass, các tính năng AI nâng cao và kết nối app sẽ tạm dừng. Pika vẫn thực hiện được các lệnh cơ bản ngoại tuyến, nhưng để luyện nói thông minh thì ba mẹ cần gia hạn gói.',
  },
  {
    q: 'Có bảo hành không?',
    a: 'Pika được bảo hành chính hãng 12 tháng cho các lỗi từ nhà sản xuất. Ba mẹ có thể mang đến bất kỳ điểm bán chính thức nào để được hỗ trợ kỹ thuật.',
  },
  {
    q: 'Pika có an toàn cho trẻ không?',
    a: 'Pika có lớp lọc nội dung, ưu tiên chủ đề phù hợp với trẻ, sửa nhẹ theo tuổi và có app để phụ huynh theo dõi mọi lượt chơi.',
  },
  {
    q: 'Nếu con chỉ muốn chơi thì sao?',
    a: 'Pika có thể bắt đầu từ chơi, truyện, bài hát hoặc nhân vật con thích. Khi phù hợp, Pika gợi ý một câu tiếng Anh ngắn để con nói theo.',
  },
  {
    q: 'Ba mẹ không giỏi tiếng Anh, dùng được không?',
    a: 'Có. Ba mẹ chỉ cần chọn tuổi, sở thích và kiểu bài. Pika lo phần dẫn dắt, nghe con nói, khen và sửa nhẹ.',
  },
  {
    q: 'Reset tablet cho khách tiếp theo?',
    a: 'Giữ nút bánh răng ở góc trên khoảng 1 giây rồi bấm "Reset lượt thử" để xoá lựa chọn, sao thưởng và đưa tablet về màn hình chào ban đầu.',
  },
  {
    q: 'Mua xong, app dùng để làm gì?',
    a: 'App dùng để giao bài, xem tiến độ, đặt giờ học, chọn nội dung theo sách và quản lý các thiết lập an toàn.',
  },
];

export const ScreenFAQ: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index: number) => {
    buttonFeedback();
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? -1 : index);
    if (isOpening) {
      logEvent('open_faq', 'faq', { faqIndex: index, question: FAQS[index].q });
    }
  };

  const handlePlayAgain = () => {
    buttonFeedback();
    setCurrentScreen('play');
  };

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <Text style={styles.eyebrow}>Hỏi đáp · Ba mẹ quan tâm</Text>
      <Text style={styles.title}>Câu hỏi thường gặp</Text>
      <Text style={styles.subtitle}>Những điều ba mẹ hay hỏi Pika nhất tại quầy trải nghiệm.</Text>

      {/* FAQ List */}
      <ScrollView
        style={styles.faqList}
        contentContainerStyle={styles.faqListContent}
        showsVerticalScrollIndicator={false}
      >
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <View key={index} style={[styles.faq, isOpen && styles.faqOpen]}>
              <Pressable style={styles.faqQ} onPress={() => handleToggle(index)}>
                <Text style={styles.faqQText}>{faq.q}</Text>
                <Text style={styles.faqToggle}>{isOpen ? '−' : '+'}</Text>
              </Pressable>
              {isOpen && (
                <View style={styles.faqA}>
                  <Text style={styles.faqAText}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* QR Section */}
        <View style={styles.qrSection}>
          <Image
            source={require('../../assets/fauna/qr-zalo.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <View style={styles.qrText}>
            <Text style={styles.qrTitle}>Còn thắc mắc khác? Nhắn Pika trên Zalo nhé!</Text>
            <Text style={styles.qrDesc}>
              Quét mã để kết nối Zalo OA — ba mẹ được tư vấn, giao bài và hỗ trợ nhanh chóng.
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.ctaButton} onPress={handlePlayAgain}>
          <Text style={styles.ctaText}>Cho con chơi lại</Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  eyebrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(52),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: 2,
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
    zIndex: 10,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(80),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['4xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['4xl'] * 1.16),
    color: FaunaColors.t1,
    zIndex: 10,
  },
  subtitle: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(140),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: FaunaColors.t3,
    zIndex: 10,
  },
  faqList: {
    position: 'absolute',
    left: s(70),
    right: s(70),
    top: s(190),
    bottom: s(20),
  },
  faqListContent: {
    paddingBottom: s(40),
  },
  faq: {
    backgroundColor: 'rgba(22,32,74,0.9)',
    borderRadius: s(24),
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.25)',
    marginBottom: s(14),
    overflow: 'hidden',
  },
  faqOpen: {
    borderColor: FaunaColors.amber,
    backgroundColor: 'rgba(30,42,92,0.95)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.35,
    shadowRadius: s(18),
    elevation: 8,
  },
  faqQ: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: s(20),
    paddingHorizontal: s(24),
    minHeight: s(FaunaTouchTarget.min),
  },
  faqQText: {
    flex: 1,
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    lineHeight: s(FaunaFontSize.base * 1.3),
    color: FaunaColors.t1,
    marginRight: s(14),
  },
  faqToggle: {
    fontSize: s(34),
    fontWeight: '400',
    color: FaunaColors.amberHi,
    width: s(38),
    textAlign: 'center',
  },
  faqA: {
    padding: s(20),
    paddingTop: 0,
    paddingHorizontal: s(24),
  },
  faqAText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.55),
    color: FaunaColors.t2,
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(22),
    padding: s(24),
    backgroundColor: 'rgba(22,32,74,0.9)',
    borderRadius: s(26),
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.25)',
    marginTop: s(24),
    marginBottom: s(26),
  },
  qrImage: {
    width: s(124),
    height: s(124),
    borderRadius: s(12),
  },
  qrText: {
    flex: 1,
  },
  qrTitle: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize.base * 1.3),
    color: FaunaColors.t1,
    marginBottom: s(8),
  },
  qrDesc: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.45),
    color: FaunaColors.t3,
  },
  ctaButton: {
    alignSelf: 'center',
    height: s(FaunaTouchTarget.cta),
    paddingHorizontal: s(48),
    borderRadius: FaunaRadius.pill,
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
    shadowRadius: s(24),
    elevation: 12,
    marginBottom: s(40),
  },
  ctaText: {
    fontSize: s(FaunaFontSize.lg),
    fontWeight: '800',
    color: '#26200A',
  },
});
