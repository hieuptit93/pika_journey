import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Device type detection using aspect ratio
// Tablet: ratio >= 0.55 (more square), Phone: ratio < 0.55 (elongated)
// User's tablet 800x1340 = 0.597, iPhone 16 393x852 = 0.46
const aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
export const isTablet = aspectRatio >= 0.55 && SCREEN_WIDTH >= 380;
export const isLargeTablet = SCREEN_WIDTH >= 900;

// Debug: check actual dimensions in console
console.log('Screen:', SCREEN_WIDTH, 'x', SCREEN_HEIGHT, 'ratio:', aspectRatio.toFixed(2), 'isTablet:', isTablet);

// Scale factor based on screen width
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Moderate scaling for tablets (don't scale too much)
const getScale = () => {
  if (isLargeTablet) return Math.min(widthScale, 1.4);
  if (isTablet) return Math.min(widthScale, 1.25);
  return Math.min(widthScale, 1);
};

const scale = getScale();

// Scale a value proportionally
export const s = (size: number): number => {
  return Math.round(size * scale);
};

// Scale font size with more conservative scaling
export const fs = (size: number): number => {
  const scaledSize = size * Math.min(scale, isTablet ? 1.15 : 1);
  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

// Vertical scale (for height-dependent values)
export const vs = (size: number): number => {
  return Math.round(size * Math.min(heightScale, 1.2));
};

// Max content width for tablets (prevents overly wide layouts)
export const MAX_CONTENT_WIDTH = isLargeTablet ? 600 : isTablet ? 500 : SCREEN_WIDTH;

// Image height ratio for scene panels
export const SCENE_HEIGHT_RATIO = isTablet ? 0.35 : 0.42;

// Hero screen uses a larger ratio
export const HERO_HEIGHT_RATIO = isTablet ? 0.42 : 0.55;

// Screen dimensions
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

// Responsive spacing
export const ResponsiveSpacing = {
  xs: s(4),
  sm: s(8),
  md: s(12),
  lg: s(16),
  xl: s(24),
  xxl: s(32),
  xxxl: s(48),
  huge: s(64),
};

// Responsive radius
export const ResponsiveRadius = {
  xs: s(4),
  sm: s(8),
  md: s(12),
  lg: s(16),
  xl: s(24),
  xxl: s(32),
  xxxl: s(40),
  full: 9999,
};
