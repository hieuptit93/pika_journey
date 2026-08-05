// Modern, kid-friendly design system inspired by AI Coach / Pet apps
// Soft gradients, glassmorphism, floating elements

export const Colors = {
  // Primary palette - soft sky blues
  primary: '#4A9EF7',
  primaryLight: '#7FBDFF',
  primaryDark: '#2B7CD3',
  primarySoft: '#E8F4FD',

  // Accent - purple/violet tones
  accent: '#8B7CF6',
  accentLight: '#C4B5FD',
  accentSoft: '#EDE9FE',

  // Secondary accents
  pink: '#F472B6',
  pinkLight: '#FBCFE8',
  pinkSoft: '#FDF2F8',

  orange: '#FB923C',
  orangeLight: '#FED7AA',
  orangeSoft: '#FFF7ED',

  mint: '#34D399',
  mintLight: '#A7F3D0',
  mintSoft: '#ECFDF5',

  yellow: '#FBBF24',
  yellowLight: '#FDE68A',
  yellowSoft: '#FFFBEB',

  purple: '#A78BFA',
  purpleLight: '#DDD6FE',
  purpleSoft: '#F5F3FF',

  // Text colors
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#CBD5E1',

  // Backgrounds
  background: '#F0F7FF',
  backgroundGradientStart: '#E8F4FD',
  backgroundGradientEnd: '#C5E4F9',
  card: '#FFFFFF',
  cardElevated: 'rgba(255,255,255,0.95)',

  // Glassmorphism
  glass: 'rgba(255,255,255,0.8)',
  glassBorder: 'rgba(255,255,255,0.5)',
  glassLight: 'rgba(255,255,255,0.6)',
  glassDark: 'rgba(30,41,59,0.1)',

  // Neutrals
  white: '#FFFFFF',
  gray: '#9CA3AF',
  grayLight: '#E5E7EB',
  grayLighter: '#F3F4F6',
  grayDark: '#6B7280',
  transparent: 'transparent',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#4A9EF7', '#7FBDFF'] as const,
  gradientSky: ['#E8F4FD', '#C5E4F9'] as const,
  gradientPurple: ['#8B7CF6', '#A78BFA'] as const,
  gradientSunset: ['#F472B6', '#FB923C'] as const,
  gradientOcean: ['#38BDF8', '#6366F1'] as const,
  gradientForest: ['#34D399', '#38BDF8'] as const,
  gradientWarm: ['#FBBF24', '#FB923C'] as const,
  gradientNight: ['#4338CA', '#6366F1', '#8B7CF6'] as const,

  // Scene backgrounds - soft dreamy gradients
  sceneSkyDay: ['#E8F4FD', '#C5E4F9', '#A5D8FF'] as const,
  sceneNight: ['#312E81', '#4338CA', '#6366F1'] as const,
  sceneCozy: ['#FEF3C7', '#FDE68A', '#FCD34D'] as const,
  sceneGarden: ['#D1FAE5', '#A7F3D0', '#6EE7B7'] as const,
  scenePurple: ['#EDE9FE', '#DDD6FE', '#C4B5FD'] as const,

  // Decorative
  coin: '#FBBF24',
  coinBorder: '#F59E0B',
  star: '#FBBF24',
  heart: '#F472B6',
  sparkle: '#8B7CF6',
};

import { ResponsiveSpacing, ResponsiveRadius } from './responsive';

// Spacing scale - responsive for tablet support
export const Spacing = ResponsiveSpacing;

// Border radius - responsive for tablet support
export const Radius = ResponsiveRadius;

// Modern soft shadows
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  }),
  button: {
    shadowColor: '#4A9EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Blur intensities for glassmorphism (used with expo-blur)
export const Blur = {
  light: 10,
  medium: 20,
  heavy: 40,
};
