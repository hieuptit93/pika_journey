import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FaunaColors, FaunaFontSize, FaunaRadius } from '../constants/theme';
import { buttonFeedback, toggleBackgroundMusic, getIsMusicPlaying } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;

const s = (v: number) => v * scale;

const HERO_LINES = [
  'Hi hi! Tớ là Pika — chạm "Chơi Ngay" đi!',
  'Cậu sẵn sàng nói tiếng Anh với tớ chưa?',
  'Tớ biết kể chuyện, hát và cả đóng vai nữa!',
  'Nhột quá! Mình cùng chơi 15 phút nhé?',
];

export const ScreenWelcome: React.FC = () => {
  const { setCurrentScreen, addStars } = useApp();
  const { logout } = useAuth();
  const [isMusicOn, setIsMusicOn] = useState(() => getIsMusicPlaying());
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  const heroFloat = useRef(new Animated.Value(0)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const ctaPulse = useRef(new Animated.Value(1)).current;
  const sparkles = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Hero floating animation
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    );
    floatAnimation.start();

    // CTA pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(ctaPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      floatAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const handlePikaPress = () => {
    buttonFeedback();
    logEvent('tap_pika', 'welcome');
    const randomLine = HERO_LINES[Math.floor(Math.random() * HERO_LINES.length)];
    setBubbleText(randomLine);
    setShowBubble(true);

    Animated.sequence([
      Animated.timing(bubbleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(bubbleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowBubble(false));

    // Sparkle animations
    sparkles.forEach((spark, i) => {
      Animated.sequence([
        Animated.delay(i * 150),
        Animated.timing(spark, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(spark, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleStart = () => {
    buttonFeedback();
    logEvent('start_play', 'welcome');
    addStars(1);
    setCurrentScreen('play');
  };

  const handleSoundToggle = () => {
    buttonFeedback();
    toggleBackgroundMusic();
    setIsMusicOn(getIsMusicPlaying());
  };

  const handleLogout = () => {
    buttonFeedback();
    logout();
  };

  return (
    <ImageBackground
      source={require('../../assets/fauna/home_bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <Image
              source={require('../../assets/fauna/hero-pika.webp')}
              style={styles.brandImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.brandName}>Robot Pika</Text>
            <Text style={styles.brandSub}>GÓC TRẢI NGHIỆM</Text>
          </View>
        </View>

        <View style={styles.headerControls}>
          <Pressable style={styles.soundBtn} onPress={handleSoundToggle}>
            {!isMusicOn && <Text style={styles.muteX}>✕</Text>}
            <Text style={styles.soundIcon}>🔊</Text>
          </Pressable>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>⏻</Text>
          </Pressable>
        </View>
      </View>

      {/* Eyebrow */}
      <Text style={styles.eyebrow}>ROBOT BẠN THÂN CỦA BÉ</Text>

      {/* Main Title */}
      <View style={styles.titleArea}>
        <Text style={styles.title}>Chào cậu!</Text>
        <Text style={styles.titleAccent}>Tớ là Pika!</Text>
      </View>

      {/* Hero Pika */}
      <Pressable style={styles.heroArea} onPress={handlePikaPress}>
        <Animated.Image
          source={require('../../assets/fauna/hero-pika.webp')}
          style={[
            styles.heroPika,
            {
              transform: [
                {
                  translateY: heroFloat.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -s(15)],
                  }),
                },
                {
                  rotate: heroFloat.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: ['-2deg', '2deg', '-2deg'],
                  }),
                },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {/* Sparkles */}
        {sparkles.map((spark, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.sparkle,
              i === 0 && { left: s(20), top: s(80) },
              i === 1 && { right: s(20), top: s(120) },
              i === 2 && { left: s(60), bottom: s(100) },
              { opacity: spark },
            ]}
          >
            ✦
          </Animated.Text>
        ))}

        {/* Stage light effect */}
        <View style={styles.stageLight} />
      </Pressable>

      {/* Speech Bubble */}
      {showBubble && (
        <Animated.View
          style={[
            styles.bubble,
            {
              opacity: bubbleAnim,
              transform: [
                {
                  translateY: bubbleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [s(10), 0],
                  }),
                },
                {
                  scale: bubbleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.bubbleText}>{bubbleText}</Text>
        </Animated.View>
      )}

      {/* CTA Button */}
      <Animated.View style={[styles.ctaWrapper, { transform: [{ scale: ctaPulse }] }]}>
        <Pressable onPress={handleStart}>
          <LinearGradient
            colors={['#FFD98A', '#F5B94E', '#E09B21']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>Chơi Ngay</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Chạm để bắt đầu hành trình cùng Pika</Text>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Feature Badges */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>🛡️</Text>
            </View>
            <Text style={styles.badgeTitle}>An toàn</Text>
            <Text style={styles.badgeDesc}>cho trẻ 4-10 tuổi</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>🎓</Text>
            </View>
            <Text style={styles.badgeTitle}>Cambridge YLE</Text>
            <Text style={styles.badgeDesc}>chuẩn quốc tế</Text>
          </View>
          <View style={styles.badge}>
            <View style={styles.badgeIcon}>
              <Text style={styles.badgeEmoji}>⏰</Text>
            </View>
            <Text style={styles.badgeTitle}>15 phút</Text>
            <Text style={styles.badgeDesc}>mỗi ngày là đủ</Text>
          </View>
        </View>

        {/* QR Section */}
        <View style={styles.qrSection}>
          <Image
            source={require('../../assets/fauna/qr-zalo.png')}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <View style={styles.qrText}>
            <Text style={styles.qrTitle}>Ba mẹ cần Pika hỗ trợ?</Text>
            <Text style={styles.qrDesc}>
              Quét mã để kết nối Zalo OA — tư vấn và hỗ trợ nhanh chóng!
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  // Header
  header: {
    position: 'absolute',
    top: s(50),
    left: s(24),
    right: s(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  brandIcon: {
    width: s(56),
    height: s(56),
    borderRadius: s(16),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  brandImage: {
    width: s(48),
    height: s(48),
  },
  brandName: {
    fontSize: s(26),
    fontWeight: '800',
    color: FaunaColors.t1,
  },
  brandSub: {
    fontSize: s(14),
    fontWeight: '700',
    letterSpacing: 1.5,
    color: FaunaColors.t3,
  },
  headerControls: {
    flexDirection: 'row',
    gap: s(12),
  },
  soundBtn: {
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.4,
    shadowRadius: s(12),
    elevation: 6,
  },
  soundIcon: {
    fontSize: s(28),
  },
  muteX: {
    position: 'absolute',
    fontSize: s(28),
    fontWeight: '800',
    color: '#26200A',
    zIndex: 1,
  },
  logoutBtn: {
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    backgroundColor: 'rgba(180,80,80,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B45050',
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.4,
    shadowRadius: s(12),
    elevation: 6,
  },
  logoutIcon: {
    fontSize: s(26),
    color: '#fff',
    fontWeight: '700',
  },
  // Eyebrow
  eyebrow: {
    position: 'absolute',
    top: s(140),
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: s(17),
    fontWeight: '800',
    letterSpacing: s(3),
    color: FaunaColors.amberHi,
  },
  // Title
  titleArea: {
    position: 'absolute',
    top: s(170),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: s(52),
    fontWeight: '800',
    color: FaunaColors.t1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: s(2) },
    textShadowRadius: s(8),
  },
  titleAccent: {
    fontSize: s(52),
    fontWeight: '800',
    color: FaunaColors.amber,
    fontStyle: 'italic',
    textShadowColor: 'rgba(245,185,78,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: s(20),
  },
  // Hero
  heroArea: {
    position: 'absolute',
    top: s(296),
    left: '50%',
    marginLeft: -s(180),
    width: s(360),
    height: s(424),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPika: {
    width: s(310),
    height: s(388),
  },
  sparkle: {
    position: 'absolute',
    fontSize: s(24),
    color: '#FFEFCB',
    textShadowColor: 'rgba(255,220,150,0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: s(12),
  },
  stageLight: {
    position: 'absolute',
    bottom: s(20),
    width: s(280),
    height: s(40),
    borderRadius: s(140),
    backgroundColor: 'rgba(255,214,140,0.2)',
  },
  // Bubble
  bubble: {
    position: 'absolute',
    left: s(80),
    top: s(420),
    maxWidth: s(300),
    padding: s(16),
    paddingHorizontal: s(20),
    borderRadius: s(18),
    borderBottomRightRadius: s(6),
    backgroundColor: 'rgba(24,36,78,0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,185,78,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(12) },
    shadowOpacity: 0.4,
    shadowRadius: s(24),
    elevation: 10,
  },
  bubbleText: {
    fontSize: s(19),
    fontWeight: '700',
    lineHeight: s(27),
    color: '#F6E7C6',
  },
  // CTA
  ctaWrapper: {
    position: 'absolute',
    top: s(748),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  ctaButton: {
    paddingVertical: s(26),
    paddingHorizontal: s(80),
    borderRadius: s(50),
    borderWidth: 4,
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(180,130,30,0.5)',
    borderBottomColor: 'rgba(160,100,20,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(16) },
    shadowOpacity: 0.5,
    shadowRadius: s(24),
    elevation: 20,
  },
  ctaText: {
    fontSize: s(38),
    fontWeight: '800',
    color: '#26200A',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255,255,255,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  // Subtitle
  subtitle: {
    position: 'absolute',
    top: s(858),
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: s(27),
    fontWeight: '700',
    color: FaunaColors.amber,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: s(2) },
    textShadowRadius: s(8),
  },
  // Bottom Section
  bottomSection: {
    position: 'absolute',
    bottom: s(28),
    left: s(50),
    right: s(50),
  },
  // Badges
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: s(20),
  },
  badge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: s(18),
    paddingHorizontal: s(10),
    backgroundColor: 'rgba(20,32,72,0.75)',
    borderRadius: s(22),
    marginHorizontal: s(6),
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.25)',
  },
  badgeIcon: {
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: 'rgba(245,185,78,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245,185,78,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(12),
  },
  badgeEmoji: {
    fontSize: s(28),
  },
  badgeTitle: {
    fontSize: s(22),
    fontWeight: '800',
    color: FaunaColors.t1,
    textAlign: 'center',
    marginBottom: s(5),
  },
  badgeDesc: {
    fontSize: s(16),
    fontWeight: '600',
    lineHeight: s(21),
    color: FaunaColors.t3,
    textAlign: 'center',
  },
  // QR Section
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
    backgroundColor: 'rgba(20,32,72,0.95)',
    borderRadius: s(26),
    padding: s(20),
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.4)',
    borderLeftColor: 'rgba(167,196,234,0.2)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(10) },
    shadowOpacity: 0.5,
    shadowRadius: s(20),
    elevation: 12,
  },
  qrImage: {
    width: s(88),
    height: s(88),
    borderRadius: s(12),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  qrText: {
    flex: 1,
  },
  qrTitle: {
    fontSize: s(22),
    fontWeight: '800',
    color: FaunaColors.amber,
    marginBottom: s(6),
  },
  qrDesc: {
    fontSize: s(16),
    fontWeight: '600',
    lineHeight: s(22),
    color: FaunaColors.t3,
  },
});
