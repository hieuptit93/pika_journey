import * as Haptics from 'expo-haptics';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

const BUTTON_PLAYER_POOL_SIZE = 3;
let buttonPlayers: AudioPlayer[] = [];
let currentPlayerIndex = 0;
let musicPlayer: AudioPlayer | null = null;
let isMusicPlaying = false;
let isAudioReady = false;

export const initSounds = async () => {
  try {
    // Create a pool of button players to handle rapid presses
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
  }
};

export const playButtonSound = async () => {
  if (!isAudioReady || buttonPlayers.length === 0) return;
  try {
    // Use round-robin to cycle through players
    const player = buttonPlayers[currentPlayerIndex];
    currentPlayerIndex = (currentPlayerIndex + 1) % BUTTON_PLAYER_POOL_SIZE;

    player.seekTo(0);
    player.play();
  } catch (error) {
    console.log('Button sound error:', error);
  }
};

export const playBackgroundMusic = async () => {
  if (!isAudioReady || !musicPlayer) return;
  try {
    musicPlayer.play();
    isMusicPlaying = true;
  } catch (error) {
    console.log('Music play error:', error);
  }
};

export const stopBackgroundMusic = async () => {
  if (!musicPlayer) return;
  try {
    musicPlayer.pause();
    isMusicPlaying = false;
  } catch (error) {
    console.log('Music stop error:', error);
  }
};

export const toggleBackgroundMusic = async () => {
  if (isMusicPlaying) {
    await stopBackgroundMusic();
  } else {
    await playBackgroundMusic();
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
  } catch (error) {
    console.log('Haptics error:', error);
  }
};

export const buttonFeedback = async () => {
  vibrate('light');
  playButtonSound();
};

export const successFeedback = async () => {
  vibrate('success');
};

export const cleanupSounds = async () => {
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
  } catch (error) {
    console.log('Cleanup error:', error);
  }
};

export const getIsMusicPlaying = () => isMusicPlaying;
export const getIsAudioAvailable = () => isAudioReady;
