import React, { memo, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { useApp, AppScreen } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { FaunaColors } from './constants/theme';
import { AppTopBar } from './components/AppTopBar';
import { ScreenLogin } from './screens/ScreenLogin';
import { ScreenWelcome } from './screens/ScreenWelcome';
import { ScreenPlay } from './screens/ScreenPlay';
import { ScreenTopics } from './screens/ScreenTopics';
import { ScreenJourney } from './screens/ScreenJourney';
import { ScreenParents } from './screens/ScreenParents';
import { ScreenFAQ } from './screens/ScreenFAQ';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const SWIPE_THRESHOLD = 50;
const TAB_ORDER: AppScreen[] = ['play', 'topics', 'journey', 'parents', 'faq'];

const MemoizedScreenWelcome = memo(ScreenWelcome);
const MemoizedScreenPlay = memo(ScreenPlay);
const MemoizedScreenTopics = memo(ScreenTopics);
const MemoizedScreenJourney = memo(ScreenJourney);
const MemoizedScreenParents = memo(ScreenParents);
const MemoizedScreenFAQ = memo(ScreenFAQ);

interface CachedScreenProps {
  isActive: boolean;
  children: React.ReactNode;
}

const CachedScreen: React.FC<CachedScreenProps> = memo(({ isActive, children }) => (
  <View
    style={[
      styles.cachedScreen,
      !isActive && styles.hiddenScreen,
    ]}
    pointerEvents={isActive ? 'auto' : 'none'}
  >
    {children}
  </View>
));

export const Navigator: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useApp();
  const { isLoggedIn, isLoading } = useAuth();

  const currentScreenRef = useRef(currentScreen);
  currentScreenRef.current = currentScreen;

  const setCurrentScreenRef = useRef(setCurrentScreen);
  setCurrentScreenRef.current = setCurrentScreen;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        const screen = currentScreenRef.current;

        if (screen === 'welcome') return;

        const currentIndex = TAB_ORDER.indexOf(screen);
        if (currentIndex === -1) return;

        if (dx < -SWIPE_THRESHOLD && currentIndex < TAB_ORDER.length - 1) {
          setCurrentScreenRef.current(TAB_ORDER[currentIndex + 1]);
        } else if (dx > SWIPE_THRESHOLD && currentIndex > 0) {
          setCurrentScreenRef.current(TAB_ORDER[currentIndex - 1]);
        }
      },
    })
  ).current;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={FaunaColors.amber} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <ScreenLogin />;
  }

  const showTopBar = currentScreen !== 'welcome';

  return (
    <View style={styles.container}>
      {showTopBar && <AppTopBar />}
      <View style={styles.screenContainer} {...panResponder.panHandlers}>
        <CachedScreen isActive={currentScreen === 'welcome'}>
          <MemoizedScreenWelcome />
        </CachedScreen>

        <CachedScreen isActive={currentScreen === 'play'}>
          <MemoizedScreenPlay />
        </CachedScreen>

        <CachedScreen isActive={currentScreen === 'topics'}>
          <MemoizedScreenTopics />
        </CachedScreen>

        <CachedScreen isActive={currentScreen === 'journey'}>
          <MemoizedScreenJourney />
        </CachedScreen>

        <CachedScreen isActive={currentScreen === 'parents'}>
          <MemoizedScreenParents />
        </CachedScreen>

        <CachedScreen isActive={currentScreen === 'faq'}>
          <MemoizedScreenFAQ />
        </CachedScreen>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FaunaColors.night0,
  },
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  screenContainer: {
    flex: 1,
  },
  cachedScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hiddenScreen: {
    opacity: 0,
  },
});
