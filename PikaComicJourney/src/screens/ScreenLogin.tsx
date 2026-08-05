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
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { buttonFeedback } from '../utils/sounds';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

export const ScreenLogin: React.FC = () => {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
    buttonFeedback();
    if (!phone.trim()) {
      setError('Nhập số điện thoại nào! 📱');
      return;
    }
    if (!password.trim()) {
      setError('Quên mật khẩu rồi! 🔑');
      return;
    }

    setError('');
    setIsLoading(true);

    const result = await login(phone, password);

    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Ôi không! Thử lại nhé 😅');
    }
  };

  return (
    <LinearGradient
      colors={['#FFE66D', '#FFD93D', '#FFC107']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.scrollContentKeyboard,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[
            styles.mainLayout,
            isKeyboardVisible && styles.mainLayoutKeyboard,
          ]}>
            {/* Form - hiển thị đầu tiên */}
            <View style={[
              styles.formSection,
              isKeyboardVisible && styles.formSectionKeyboard,
            ]}>
              <View style={[
                styles.formCard,
                isKeyboardVisible && styles.formCardKeyboard,
              ]}>
                {!isKeyboardVisible && (
                  <Text style={styles.formTitle}>🎮 Đăng nhập</Text>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>📱 Số điện thoại</Text>
                  <View style={styles.inputOuter}>
                    <TextInput
                      style={[styles.input, isKeyboardVisible && styles.inputFocused]}
                      placeholder="VD: 0962367123"
                      placeholderTextColor="#A0AEC0"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>🔑 Mật khẩu</Text>
                  <View style={styles.inputOuter}>
                    <TextInput
                      style={[styles.input, isKeyboardVisible && styles.inputFocused]}
                      placeholder="Nhập mật khẩu bí mật"
                      placeholderTextColor="#A0AEC0"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      editable={!isLoading}
                    />
                  </View>
                </View>

                {error ? (
                  <View style={styles.errorBubble}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Pressable
                  style={[
                    styles.buttonOuter,
                    isKeyboardVisible && styles.buttonOuterKeyboard,
                  ]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <View style={[styles.button, isLoading && styles.buttonDisabled]}>
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>🚀 Vào chơi thôi!</Text>
                    )}
                  </View>
                </Pressable>

                {!isKeyboardVisible && (
                  <Text style={styles.helpText}>
                    Chưa có tài khoản? Nhờ ba mẹ gọi hotline nhé! 📞
                  </Text>
                )}
              </View>
            </View>

            {/* Branding - ẩn khi keyboard hiện */}
            {!isKeyboardVisible && (
              <View style={styles.brandSection}>
                <View style={styles.mascotOuter}>
                  <View style={styles.mascotCircle}>
                    <Image
                      source={require('../assets/pika-wave.png')}
                      style={styles.mascotImage}
                      resizeMode="cover"
                    />
                  </View>
                </View>
                <Text style={styles.welcomeText}>Xin chào! 👋</Text>
                <Text style={styles.brandName}>Pika World</Text>
                <View style={styles.taglineBubble}>
                  <Text style={styles.tagline}>Cùng học và chơi với Pika nào!</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Decorations - ẩn khi keyboard hiện */}
      {!isKeyboardVisible && (
        <>
          <View style={styles.starTL}>
            <Text style={styles.starEmoji}>⭐</Text>
          </View>
          <View style={styles.starTR}>
            <Text style={styles.starEmoji}>✨</Text>
          </View>
          <View style={styles.starBL}>
            <Text style={styles.starEmoji}>🌟</Text>
          </View>
          <View style={styles.starBR}>
            <Text style={styles.starEmoji}>💫</Text>
          </View>
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: isLandscape ? 20 : 16,
  },
  scrollContentKeyboard: {
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  mainLayout: {
    flexDirection: isLandscape ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isLandscape ? 40 : 20,
  },
  mainLayoutKeyboard: {
    justifyContent: 'flex-start',
  },
  brandSection: {
    alignItems: 'center',
    flex: isLandscape ? 1 : undefined,
  },
  mascotOuter: {
    backgroundColor: '#E6A800',
    borderRadius: 60,
    padding: 5,
    paddingBottom: 8,
    marginBottom: 12,
  },
  mascotCircle: {
    width: isLandscape ? 100 : 90,
    height: isLandscape ? 100 : 90,
    borderRadius: 50,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFE66D',
  },
  mascotImage: {
    width: isLandscape ? 110 : 100,
    height: isLandscape ? 110 : 100,
  },
  welcomeText: {
    fontSize: isLandscape ? 20 : 18,
    fontWeight: '700',
    color: '#8B4513',
    marginBottom: 4,
  },
  brandName: {
    fontSize: isLandscape ? 36 : 32,
    fontWeight: '900',
    color: '#8B4513',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 8,
  },
  taglineBubble: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: '#E6A800',
  },
  tagline: {
    fontSize: isLandscape ? 14 : 13,
    fontWeight: '700',
    color: '#8B4513',
  },
  formSection: {
    flex: isLandscape ? 1 : undefined,
    width: isLandscape ? undefined : '100%',
    maxWidth: 400,
  },
  formSectionKeyboard: {
    flex: undefined,
    width: '100%',
    maxWidth: isLandscape ? 500 : 400,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: isLandscape ? 20 : 24,
    borderWidth: 4,
    borderColor: '#E6A800',
    elevation: 8,
  },
  formCardKeyboard: {
    padding: isLandscape ? 16 : 20,
    borderRadius: 20,
  },
  formTitle: {
    fontSize: isLandscape ? 20 : 22,
    fontWeight: '900',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: isLandscape ? 12 : 16,
  },
  inputGroup: {
    marginBottom: isLandscape ? 10 : 14,
  },
  inputLabel: {
    fontSize: isLandscape ? 12 : 13,
    fontWeight: '800',
    color: '#8B4513',
    marginBottom: 6,
  },
  inputOuter: {
    backgroundColor: '#E6A800',
    borderRadius: 14,
    paddingBottom: 3,
  },
  input: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    paddingVertical: isLandscape ? 10 : 12,
    paddingHorizontal: 14,
    fontSize: isLandscape ? 14 : 16,
    color: '#1E293B',
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#FFE66D',
  },
  inputFocused: {
    backgroundColor: '#fff',
    borderColor: '#FF6B35',
    fontSize: isLandscape ? 16 : 18,
  },
  errorBubble: {
    backgroundColor: '#FFE4E4',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FF9999',
  },
  errorText: {
    fontSize: isLandscape ? 12 : 13,
    fontWeight: '700',
    color: '#CC4444',
    textAlign: 'center',
  },
  buttonOuter: {
    backgroundColor: '#CC4D1A',
    borderRadius: 18,
    paddingBottom: 5,
    marginTop: isLandscape ? 4 : 8,
  },
  buttonOuterKeyboard: {
    marginTop: 4,
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    paddingVertical: isLandscape ? 12 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FF9966',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: isLandscape ? 16 : 18,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  helpText: {
    fontSize: isLandscape ? 11 : 12,
    fontWeight: '600',
    color: '#8B4513',
    textAlign: 'center',
    marginTop: isLandscape ? 10 : 14,
  },
  starTL: { position: 'absolute', top: 20, left: 20 },
  starTR: { position: 'absolute', top: 30, right: 30 },
  starBL: { position: 'absolute', bottom: 30, left: 30 },
  starBR: { position: 'absolute', bottom: 20, right: 20 },
  starEmoji: { fontSize: 24, opacity: 0.6 },
});
