import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { buttonFeedback } from '../utils/sounds';
import { FaunaColors, FaunaFontSize, FaunaRadius } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

export const ScreenLogin: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Lưu key (hoặc chữ server trả về) thay vì chữ đã dịch, để đổi ngôn ngữ vẫn đúng.
  const [error, setError] = useState<{ key?: string; message?: string } | null>(null);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    buttonFeedback();
    if (!phone.trim()) {
      setError({ key: 'login.phoneRequired' });
      return;
    }
    if (!password.trim()) {
      setError({ key: 'login.passwordRequired' });
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await login(phone, password);

    setIsLoading(false);
    if (!result.success) {
      setError(result.message ? { message: result.message } : { key: result.errorKey || 'login.retry' });
    }
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -s(4)],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainLayout}>
            {/* Branding */}
            <Animated.View
              style={[
                styles.brandSection,
                { transform: [{ translateY: floatTranslate }] }
              ]}
            >
              <View style={styles.mascotOuter}>
                <LinearGradient
                  colors={[FaunaColors.night2, FaunaColors.night1]}
                  style={styles.mascotGradient}
                >
                  <View style={styles.mascotInner}>
                    <Image
                      source={require('../assets/pika-wave.png')}
                      style={styles.mascotImage}
                      resizeMode="cover"
                    />
                  </View>
                </LinearGradient>
              </View>
              <Text style={styles.welcomeText}>{t('login.greeting')}</Text>
              <Text style={styles.brandName}>Pika World</Text>
              <Text style={styles.tagline}>{t('login.tagline')}</Text>
            </Animated.View>

            {/* Form */}
            <View style={styles.formSection}>
              <View style={styles.formCard3D}>
                <LinearGradient
                  colors={[FaunaColors.night2, FaunaColors.night1]}
                  style={styles.formCardGradient}
                >
                  <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>{t('login.formTitle')}</Text>
                    <Text style={styles.formSubtitle}>{t('login.formSubtitle')}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('login.phoneLabel')}</Text>
                    <View style={styles.inputWrapper3D}>
                      <TextInput
                        style={styles.input}
                        placeholder={t('login.phonePlaceholder')}
                        placeholderTextColor={FaunaColors.t4}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('login.passwordLabel')}</Text>
                    <View style={styles.inputWrapper3D}>
                      <TextInput
                        style={styles.input}
                        placeholder={t('login.passwordPlaceholder')}
                        placeholderTextColor={FaunaColors.t4}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {error ? (
                    <View style={styles.errorBubble}>
                      <Text style={styles.errorText}>{error.message ?? t(error.key!)}</Text>
                    </View>
                  ) : null}

                  <Pressable
                    style={styles.buttonWrapper}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Animated.View style={[
                      styles.buttonGlow,
                      { opacity: glowOpacity }
                    ]} />
                    <View style={styles.button3D}>
                      <LinearGradient
                        colors={['#F5B94E', '#E5A73E', '#D4962E']}
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                      >
                        {isLoading ? (
                          <ActivityIndicator color={FaunaColors.night0} />
                        ) : (
                          <Text style={styles.buttonText}>{t('login.submit')}</Text>
                        )}
                      </LinearGradient>
                    </View>
                  </Pressable>

                  <Text style={styles.helpText}>{t('login.help')}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Decorative sparkles */}
      <Animated.View style={[styles.sparkle, styles.sparkleTL, { opacity: glowOpacity }]}>
        <Text style={styles.sparkleText}>✦</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkleTR, { opacity: glowOpacity }]}>
        <Text style={styles.sparkleText}>✧</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkleBL, { opacity: glowOpacity }]}>
        <Text style={styles.sparkleText}>✦</Text>
      </Animated.View>
      <Animated.View style={[styles.sparkle, styles.sparkleBR, { opacity: glowOpacity }]}>
        <Text style={styles.sparkleText}>✧</Text>
      </Animated.View>

      {/* Đẩy xuống dưới vùng an toàn để không bị đồng hồ/pin của hệ thống che. */}
      <LanguageSwitcher style={[styles.languageBtn, { top: Math.max(s(40), insets.top + s(12)) }]} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: s(24),
    paddingTop: s(60),
    paddingBottom: s(40),
  },
  mainLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(24),
  },
  brandSection: {
    alignItems: 'center',
  },
  mascotOuter: {
    borderRadius: s(70),
    padding: s(3),
    marginBottom: s(12),
    borderWidth: 2,
    borderTopColor: 'rgba(245, 185, 78, 0.5)',
    borderLeftColor: 'rgba(245, 185, 78, 0.3)',
    borderRightColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
  },
  mascotGradient: {
    borderRadius: s(64),
    padding: s(5),
  },
  mascotInner: {
    width: s(104),
    height: s(104),
    borderRadius: s(52),
    backgroundColor: FaunaColors.night3,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: FaunaColors.amber,
  },
  mascotImage: {
    width: s(116),
    height: s(116),
  },
  welcomeText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '600',
    color: FaunaColors.t2,
    marginBottom: s(2),
  },
  brandName: {
    fontSize: s(FaunaFontSize['3xl']),
    fontWeight: '800',
    color: FaunaColors.amber,
    textShadowColor: 'rgba(245, 185, 78, 0.4)',
    textShadowOffset: { width: 0, height: s(3) },
    textShadowRadius: s(10),
    marginBottom: s(4),
  },
  tagline: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '500',
    color: FaunaColors.t3,
  },
  formSection: {
    width: '100%',
    maxWidth: s(520),
  },
  formCard3D: {
    borderRadius: s(36),
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(12) },
    shadowOpacity: 0.4,
    shadowRadius: s(24),
    elevation: 12,
  },
  formCardGradient: {
    borderRadius: s(34),
    padding: s(24),
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: s(16),
  },
  formTitle: {
    fontSize: s(FaunaFontSize.xl),
    fontWeight: '700',
    color: FaunaColors.t1,
    marginBottom: s(2),
  },
  formSubtitle: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '500',
    color: FaunaColors.t3,
  },
  inputGroup: {
    marginBottom: s(14),
  },
  inputLabel: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    color: FaunaColors.t2,
    marginBottom: s(6),
  },
  inputWrapper3D: {
    borderRadius: s(18),
    borderWidth: 2,
    borderTopColor: 'rgba(0, 0, 0, 0.3)',
    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: FaunaColors.night3,
  },
  input: {
    backgroundColor: FaunaColors.night3,
    borderRadius: s(16),
    paddingVertical: s(16),
    paddingHorizontal: s(18),
    fontSize: s(FaunaFontSize.sm),
    color: FaunaColors.t1,
    fontWeight: '500',
  },
  errorBubble: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: s(16),
    padding: s(12),
    marginBottom: s(12),
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginTop: s(8),
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    top: -s(8),
    left: -s(8),
    right: -s(8),
    bottom: -s(8),
    borderRadius: s(36),
    backgroundColor: FaunaColors.amber,
  },
  button3D: {
    borderRadius: s(28),
    borderWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.4,
    shadowRadius: s(16),
    elevation: 8,
  },
  button: {
    borderRadius: s(26),
    paddingVertical: s(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '700',
    color: FaunaColors.night0,
  },
  helpText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '500',
    color: FaunaColors.t3,
    textAlign: 'center',
    marginTop: s(16),
  },
  sparkle: {
    position: 'absolute',
  },
  languageBtn: {
    position: 'absolute',
    right: s(28),
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    backgroundColor: 'rgba(167,196,234,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkleTL: { top: s(60), left: s(40) },
  sparkleTR: { top: s(100), right: s(50) },
  sparkleBL: { bottom: s(80), left: s(60) },
  sparkleBR: { bottom: s(60), right: s(40) },
  sparkleText: {
    fontSize: s(24),
    color: FaunaColors.amber,
  },
});
