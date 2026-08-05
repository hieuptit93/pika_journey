import 'react-native-reanimated';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { Navigator } from './src/Navigator';
import { Colors } from './src/constants/colors';
import { ResponsiveContainer } from './src/components';
import { initSounds, playBackgroundMusic, cleanupSounds } from './src/utils/sounds';

export default function App() {
  useEffect(() => {
    const setupSounds = async () => {
      await initSounds();
      await playBackgroundMusic();
    };
    setupSounds();

    return () => {
      cleanupSounds();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <View style={styles.outer}>
            <ResponsiveContainer style={styles.container}>
              <Navigator />
              <StatusBar style="dark" />
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF7',
  },
});
