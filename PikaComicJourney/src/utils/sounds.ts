import * as Haptics from 'expo-haptics';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

const BUTTON_PLAYER_POOL_SIZE = 5;
let buttonPlayers: AudioPlayer[] = [];
let currentPlayerIndex = 0;
let musicPlayer: AudioPlayer | null = null;
let isMusicPlaying = false;
let isAudioReady = false;
let isInitializing = false;

export const initSounds = async () => {
  if (isInitializing || isAudioReady) return;
  isInitializing = true;

  try {
    for (let i = 0; i < BUTTON_PLAYER_POOL_SIZE; i++) {
      const player = createAudioPlayer(require('../assets/sounds/button_press.mp3'));
      buttonPlayers.push(player);
    }
    musicPlayer = createAudioPlayer(require('../assets/sounds/sound_background.mp3'));
    musicPlayer.loop = true;
    isAudioReady = true;
  } catch (error) {
    console.log('Audio init error:', error);
    isAudioReady = false;
  } finally {
    isInitializing = false;
  }
};

export const playButtonSound = async () => {
  if (!isAudioReady || buttonPlayers.length === 0) return;
  try {
    const player = buttonPlayers[currentPlayerIndex];
    currentPlayerIndex = (currentPlayerIndex + 1) % BUTTON_PLAYER_POOL_SIZE;

    if (player) {
      if (player.playing) {
        player.pause();
      }
      await player.seekTo(0);
      player.play();
    }
  } catch {
    // Silently ignore audio errors
  }
};

export const playBackgroundMusic = () => {
  if (!isAudioReady || !musicPlayer) return;
  try {
    musicPlayer.play();
    isMusicPlaying = true;
  } catch {
    // Silently ignore
  }
};

export const stopBackgroundMusic = () => {
  if (!musicPlayer) return;
  try {
    musicPlayer.pause();
    isMusicPlaying = false;
  } catch {
    // Silently ignore
  }
};

export const toggleBackgroundMusic = () => {
  if (isMusicPlaying) {
    stopBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
  return isMusicPlaying;
};

export const vibrate = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  try {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        break;
    }
  } catch {
    // Silently ignore haptics errors
  }
};

export const buttonFeedback = () => {
  vibrate('light');
  playButtonSound();
};

export const successFeedback = () => {
  vibrate('success');
};

export const cleanupSounds = () => {
  try {
    for (const player of buttonPlayers) {
      player.remove();
    }
    buttonPlayers = [];
    currentPlayerIndex = 0;
    if (musicPlayer) {
      musicPlayer.remove();
      musicPlayer = null;
    }
    isMusicPlaying = false;
    isAudioReady = false;
  } catch {
    // Silently ignore cleanup errors
  }
};

export const getIsMusicPlaying = () => isMusicPlaying;
export const getIsAudioAvailable = () => isAudioReady;
