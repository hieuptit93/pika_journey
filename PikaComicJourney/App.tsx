import 'react-native-reanimated';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { Navigator } from './src/Navigator';
import { FaunaColors } from './src/constants/theme';
import { ResponsiveContainer } from './src/components';
import { initSounds, cleanupSounds } from './src/utils/sounds';
import { endSession } from './src/services/tracking';

export default function App() {
  useEffect(() => {
    initSounds().catch(() => {});
    return () => {
      cleanupSounds();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        endSession();
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <View style={styles.outer}>
            <ResponsiveContainer style={styles.container}>
              <Navigator />
              <StatusBar style="light" />
            </ResponsiveContainer>
          </View>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
});
