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
import { useTranslation } from 'react-i18next';
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

export const ScreenFAQ: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setCurrentScreen } = useApp();
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];

  const handleToggle = (index: number) => {
    buttonFeedback();
    const isOpening = openIndex !== index;
    setOpenIndex(openIndex === index ? -1 : index);
    if (isOpening) {
      // Tracking luôn ghi câu hỏi tiếng Việt để số liệu không bị tách theo ngôn ngữ.
      const viFaqs = i18n.t('faq.items', { lng: 'vi', returnObjects: true }) as { q: string }[];
      logEvent('open_faq', 'faq', { faqIndex: index, question: viFaqs[index]?.q });
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
      <Text style={styles.eyebrow}>{t('faq.eyebrow')}</Text>
      <Text style={styles.title}>{t('faq.title')}</Text>
      <Text style={styles.subtitle}>{t('faq.subtitle')}</Text>

      {/* FAQ List */}
      <ScrollView
        style={styles.faqList}
        contentContainerStyle={styles.faqListContent}
        showsVerticalScrollIndicator={false}
      >
        {faqs.map((faq, index) => {
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
            <Text style={styles.qrTitle}>{t('faq.qrTitle')}</Text>
            <Text style={styles.qrDesc}>{t('faq.qrDesc')}</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.ctaButton} onPress={handlePlayAgain}>
          <Text style={styles.ctaText}>{t('faq.cta')}</Text>
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
