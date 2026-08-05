import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp, AppScreen } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buttonFeedback, toggleBackgroundMusic } from '../utils/sounds';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

const TABS: { id: AppScreen; icon: string; label: string; color: string; shadowColor: string }[] = [
  { id: 'play', icon: '🎮', label: 'Chơi', color: '#FF6B6B', shadowColor: '#CC4444' },
  { id: 'topics', icon: '🌳', label: 'Khu vườn', color: '#4ECB71', shadowColor: '#2E9B4E' },
  { id: 'journey', icon: '🚀', label: 'Lộ trình', color: '#5B9DFF', shadowColor: '#3366CC' },
  { id: 'parents', icon: '💜', label: 'Ba mẹ', color: '#A855F7', shadowColor: '#7C3AED' },
  { id: 'faq', icon: '💡', label: 'Hỏi đáp', color: '#FBBF24', shadowColor: '#D97706' },
];

export const AppTopBar: React.FC = () => {
  const { currentScreen, setCurrentScreen, stars } = useApp();
  const { logout } = useAuth();
  const [isMusicOn, setIsMusicOn] = useState(true);

  const handleTabPress = (tabId: AppScreen) => {
    buttonFeedback();
    setCurrentScreen(tabId);
  };

  const handleMusicToggle = async () => {
    buttonFeedback();
    await toggleBackgroundMusic();
    setIsMusicOn(!isMusicOn);
  };

  return (
    <LinearGradient
      colors={['#FFE66D', '#FFD93D', '#FFC107']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Brand */}
      <Pressable style={styles.brand} onPress={() => { buttonFeedback(); setCurrentScreen('welcome'); }}>
        <View style={styles.brandOuter}>
          <View style={styles.brandBadge}>
            <Image
              source={require('../assets/pika-wave.png')}
              style={styles.brandImage}
              resizeMode="cover"
            />
          </View>
        </View>
        {!isCompact && (
          <Text style={styles.brandName}>Pika ở Fahasa</Text>
        )}
      </Pressable>

      {/* Nav tabs */}
      <View style={styles.navTabs}>
        {TABS.map(tab => {
          const isActive = currentScreen === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[
                styles.navTabOuter,
                { backgroundColor: isActive ? tab.shadowColor : 'transparent' },
              ]}
              onPress={() => handleTabPress(tab.id)}
            >
              <View style={[
                styles.navTab,
                isActive && { backgroundColor: tab.color },
              ]}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}>
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.actionBtnOuter} onPress={handleMusicToggle}>
          <View style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{isMusicOn ? '🔊' : '🔇'}</Text>
          </View>
        </Pressable>

        <View style={styles.starPillOuter}>
          <View style={styles.starPill}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starCount}>{stars}</Text>
          </View>
        </View>

        <Pressable style={styles.signOutOuter} onPress={() => { buttonFeedback(); logout(); }}>
          <View style={styles.signOutBtn}>
            <Text style={styles.signOutText}>👋</Text>
          </View>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: isCompact ? 62 : 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isCompact ? 12 : 20,
    gap: isCompact ? 10 : 16,
    borderBottomWidth: 4,
    borderBottomColor: '#E6A800',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandOuter: {
    backgroundColor: '#E6A800',
    borderRadius: 16,
    padding: 3,
    paddingBottom: 5,
  },
  brandBadge: {
    width: isCompact ? 40 : 48,
    height: isCompact ? 40 : 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFE66D',
  },
  brandImage: {
    width: isCompact ? 44 : 52,
    height: isCompact ? 44 : 52,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#8B4513',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  navTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isCompact ? 6 : 10,
  },
  navTabOuter: {
    borderRadius: 16,
    paddingBottom: 3,
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: isCompact ? 36 : 42,
    paddingHorizontal: isCompact ? 10 : 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  tabIcon: { fontSize: isCompact ? 16 : 18 },
  tabLabel: {
    fontSize: isCompact ? 11 : 13,
    fontWeight: '800',
    color: '#8B4513',
  },
  tabLabelActive: {
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isCompact ? 8 : 12,
  },
  actionBtnOuter: {
    backgroundColor: '#E6A800',
    borderRadius: 14,
    paddingBottom: 3,
  },
  actionBtn: {
    width: isCompact ? 38 : 44,
    height: isCompact ? 38 : 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE66D',
  },
  actionIcon: {
    fontSize: isCompact ? 18 : 22,
  },
  starPillOuter: {
    backgroundColor: '#E6A800',
    borderRadius: 18,
    paddingBottom: 3,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: isCompact ? 38 : 44,
    paddingHorizontal: isCompact ? 12 : 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFE66D',
  },
  starIcon: { fontSize: isCompact ? 18 : 22 },
  starCount: {
    fontSize: isCompact ? 16 : 18,
    fontWeight: '900',
    color: '#FF6B35',
  },
  signOutOuter: {
    backgroundColor: '#CC4444',
    borderRadius: 14,
    paddingBottom: 3,
  },
  signOutBtn: {
    width: isCompact ? 38 : 44,
    height: isCompact ? 38 : 44,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB4B4',
  },
  signOutText: {
    fontSize: isCompact ? 18 : 22,
  },
});
