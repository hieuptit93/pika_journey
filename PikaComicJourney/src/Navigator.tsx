import React, { memo, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { useApp, AppScreen } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Colors } from './constants/colors';
import { AppTopBar } from './components/AppTopBar';
import { ScreenLogin } from './screens/ScreenLogin';
import { ScreenWelcome } from './screens/ScreenWelcome';
import { ScreenPlay } from './screens/ScreenPlay';
import { ScreenTopics } from './screens/ScreenTopics';
import { ScreenJourney } from './screens/ScreenJourney';
import { ScreenParents } from './screens/ScreenParents';
import { ScreenFAQ } from './screens/ScreenFAQ';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isCompact = SCREEN_WIDTH / SCREEN_HEIGHT < 1.5;

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

  const currentIndex = useMemo(
    () => TAB_ORDER.indexOf(currentScreen as AppScreen),
    [currentScreen]
  );

  const showNavArrows = currentScreen !== 'welcome';
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < TAB_ORDER.length - 1 && currentIndex >= 0;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentScreen(TAB_ORDER[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentScreen(TAB_ORDER[currentIndex + 1]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <ScreenLogin />;
  }

  return (
    <View style={styles.container}>
      <AppTopBar />
      <View style={styles.screenContainer}>
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

        {showNavArrows && (
          <>
            {canGoPrev && (
              <Pressable style={[styles.navArrow, styles.navArrowLeft]} onPress={handlePrev}>
                <Text style={styles.navArrowText}>{'<'}</Text>
              </Pressable>
            )}
            {canGoNext && (
              <Pressable style={[styles.navArrow, styles.navArrowRight]} onPress={handleNext}>
                <Text style={styles.navArrowText}>{'>'}</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
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
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: isCompact ? 40 : 48,
    height: isCompact ? 40 : 48,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  navArrowLeft: {
    left: isCompact ? 6 : 10,
  },
  navArrowRight: {
    right: isCompact ? 6 : 10,
  },
  navArrowText: {
    fontSize: isCompact ? 26 : 32,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
