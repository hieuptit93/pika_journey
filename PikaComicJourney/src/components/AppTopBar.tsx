import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useApp, AppScreen } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { buttonFeedback, toggleBackgroundMusic, getIsMusicPlaying } from '../utils/sounds';
import { FaunaColors, FaunaFontSize } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const TABS: { id: AppScreen; icon: string }[] = [
  { id: 'play', icon: 'play' },
  { id: 'topics', icon: 'book' },
  { id: 'journey', icon: 'flag' },
  { id: 'parents', icon: 'parents' },
  { id: 'faq', icon: 'help' },
];

const TabIcon = ({ type, active }: { type: string; active: boolean }) => {
  const color = active ? FaunaColors.amber : FaunaColors.t2;
  const size = s(26);
  const strokeWidth = active ? 2.2 : 1.9;

  switch (type) {
    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
          <Path d="M10 8.5l6 3.5-6 3.5z" fill={color} />
        </Svg>
      );
    case 'book':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 5.5h6.5v13H4zM13.5 5.5H20v13h-6.5zM12 6v12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'flag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 3.5v17M6 5h10l-2.2 3.4L16 12H6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'parents':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={9} cy={9} r={3} stroke={color} strokeWidth={strokeWidth} />
          <Path d="M3.5 19c.6-3.2 2.8-4.8 5.5-4.8S14 15.8 14.6 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx={16.5} cy={10} r={2.3} stroke={color} strokeWidth={strokeWidth} />
          <Path d="M15 19c.4-2.2 1.3-3.4 3-3.4 1.4 0 2.3.8 2.8 2.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
          <Path d="M9.6 9.4c.2-1.4 1.2-2.2 2.5-2.2 1.4 0 2.4.9 2.4 2.1 0 1.5-1.6 1.8-2.3 2.8-.3.4-.3.9-.3 1.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx={12} cy={17} r={0.9} fill={color} />
        </Svg>
      );
  }
};

export const AppTopBar: React.FC = () => {
  const { t } = useTranslation();
  const { currentScreen, setCurrentScreen } = useApp();
  const { logout } = useAuth();
  const [isMusicOn, setIsMusicOn] = useState(() => getIsMusicPlaying());

  const showTabs = currentScreen !== 'welcome';

  const handleTabPress = (tabId: AppScreen) => {
    buttonFeedback();
    setCurrentScreen(tabId);
  };

  const handleMusicToggle = () => {
    buttonFeedback();
    toggleBackgroundMusic();
    setIsMusicOn(getIsMusicPlaying());
  };

  const handleHome = () => {
    buttonFeedback();
    setCurrentScreen('welcome');
  };

  return (
    <View style={styles.container}>
      {/* Brand */}
      <Pressable style={styles.brand} onPress={handleHome}>
        <Image
          source={require('../../assets/fauna/hero-pika.webp')}
          style={styles.brandImage}
          resizeMode="contain"
        />
      </Pressable>

      {/* Nav tabs */}
      {showTabs && (
        <View style={styles.navTabs}>
          {TABS.map(tab => {
            const isActive = currentScreen === tab.id;
            return (
              <Pressable
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => handleTabPress(tab.id)}
              >
                <View style={styles.tabIcon}>
                  <TabIcon type={tab.icon} active={isActive} />
                </View>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {t(`tabs.${tab.id}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Sound toggle */}
      <Pressable style={styles.soundBtn} onPress={handleMusicToggle}>
        <View style={styles.soundBtnInner}>
          {!isMusicOn && <Text style={styles.muteX}>✕</Text>}
          <Svg width={s(24)} height={s(24)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M11 5L6 9H2v6h4l5 4V5z"
              stroke={FaunaColors.t1}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
              stroke={FaunaColors.t1}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>

      {/* Sign out */}
      <Pressable style={styles.signOut} onPress={() => { buttonFeedback(); logout(); }}>
        <Text style={styles.signOutText}>⏻</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: s(124),
    paddingTop: s(26),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    gap: s(14),
    backgroundColor: FaunaColors.night1,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(245,185,78,0.22)',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    height: s(64),
    paddingRight: s(14),
    borderRightWidth: 1,
    borderRightColor: FaunaColors.line,
  },
  brandImage: {
    width: s(52),
    height: s(52),
  },
  brandName: {
    fontSize: s(22),
    fontWeight: '800',
    color: FaunaColors.amber,
    letterSpacing: -0.3,
  },
  navTabs: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(6),
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    height: s(60),
    paddingHorizontal: s(16),
    borderRadius: s(18),
    backgroundColor: 'rgba(167,196,234,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(167,196,234,0.12)',
  },
  tabActive: {
    backgroundColor: 'rgba(245,185,78,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(245,185,78,0.75)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.45,
    shadowRadius: s(14),
    elevation: 8,
  },
  tabIcon: {
    width: s(26),
    height: s(26),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t2,
  },
  tabLabelActive: {
    color: FaunaColors.amberHi,
    fontWeight: '800',
  },
  soundBtn: {
    width: s(58),
    height: s(58),
    borderRadius: s(29),
    backgroundColor: 'rgba(167,196,234,0.14)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.3,
    shadowRadius: s(8),
    elevation: 5,
  },
  soundBtnInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteX: {
    position: 'absolute',
    fontSize: s(28),
    fontWeight: '800',
    color: '#FFE3C0',
    zIndex: 1,
  },
  signOut: {
    width: s(58),
    height: s(58),
    borderRadius: s(29),
    backgroundColor: 'rgba(255,100,100,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,120,120,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6464',
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.35,
    shadowRadius: s(10),
    elevation: 5,
  },
  signOutText: {
    fontSize: s(24),
    color: '#fff',
    fontWeight: '700',
  },
});
