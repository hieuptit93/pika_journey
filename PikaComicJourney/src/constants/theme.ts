import { TextStyle } from 'react-native';
import { Colors } from './colors';
import { fs } from './responsive';

/**
 * Fauna Theme - Dark night mode with amber accents
 * Stage size: 952 x 1269 (portrait tablet)
 * Matching pika-tablet-fauna-v134
 */
export const FaunaColors = {
  // Night backgrounds
  night0: '#080D22',
  night1: '#0C1330',
  night2: '#101A3B',
  night3: '#16204A',
  night4: '#1C2A56',

  // Amber (primary accent)
  amber: '#F5B94E',
  amberHi: '#FFD98A',
  amberDp: '#E09B21',
  amberDk: '#B87B12',

  // Cyan (app connection signal)
  cyan: '#66C6E6',

  // Text
  paper: '#F8EFD9',
  ink: '#141C3A',
  t1: '#FFFFFF',
  t2: '#D7E1F5',
  t3: '#A9BBDD',
  t4: '#7E8FB4',

  // Lines
  line: 'rgba(167,196,234,0.20)',
  line2: 'rgba(167,196,234,0.34)',

  // Card gradients — kept a few steps above the night background so an
  // unselected card still reads as a raised surface, not a hole.
  playStory: ['#254080', '#101F55'],
  playSong: ['#473A76', '#1F2563'],
  playEnglish: ['#3E3487', '#1B2359'],
  playGuess: ['#22357A', '#16265A'],

  // Zone/Learn
  zone: ['#243466', '#131F45'],

  // Panel
  panelGrad: ['#131E42', '#0E1633'],
  panelBg: ['#101A3B', '#0A1029'],
};

export const FaunaSpacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s7: 28,
  s8: 32,
  s10: 40,
};

export const FaunaRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

export const FaunaFontSize = {
  xs: 16,
  sm: 19,
  base: 22,
  lg: 25,
  xl: 29,
  '2xl': 34,
  '3xl': 40,
  '4xl': 46,
  '5xl': 58,
};

export const FaunaTouchTarget = {
  min: 56,
  chip: 56,
  cta: 68,
};

/**
 * Interactive element styling — makes tappable things obviously tappable.
 * Applied to buttons, cards, chips so users spot them from across a room.
 */
export const FaunaInteractive = {
  // Glow ring around primary actions
  glowAmber: {
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 12,
  },
  glowSoft: {
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // 3D raised edges for pressable surfaces
  raised: {
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderLeftColor: 'rgba(255,255,255,0.22)',
    borderRightColor: 'rgba(0,0,0,0.28)',
    borderBottomColor: 'rgba(0,0,0,0.38)',
  },
  raisedAmber: {
    borderTopColor: 'rgba(255,240,205,0.85)',
    borderLeftColor: 'rgba(255,225,170,0.6)',
    borderRightColor: 'rgba(180,130,30,0.55)',
    borderBottomColor: 'rgba(150,95,15,0.7)',
  },
};

// Stage dimensions for portrait tablet
export const STAGE_WIDTH = 952;
export const STAGE_HEIGHT = 1269;

/**
 * AppTopBar sits ABOVE the screen container in a flex column, so any screen
 * rendered under it gets STAGE_HEIGHT minus this — NOT the full stage.
 * Absolute layouts inside those screens must budget against CONTENT_HEIGHT,
 * otherwise the bottom of the screen is clipped.
 * Keep in sync with AppTopBar's container height.
 */
export const TOP_BAR_HEIGHT = 124;
export const CONTENT_HEIGHT = STAGE_HEIGHT - TOP_BAR_HEIGHT; // 1145

// Modern typography system - clean, readable, friendly
// Uses responsive font scaling for tablet support
export const Typography: Record<string, TextStyle> = {
  // Display - for hero sections
  display: {
    fontSize: fs(36),
    fontWeight: '800',
    lineHeight: fs(42),
    letterSpacing: -0.5,
    color: Colors.text,
  },

  // Headings
  h1: {
    fontSize: fs(28),
    fontWeight: '700',
    lineHeight: fs(34),
    letterSpacing: -0.3,
    color: Colors.text,
  },
  h2: {
    fontSize: fs(24),
    fontWeight: '700',
    lineHeight: fs(30),
    letterSpacing: -0.2,
    color: Colors.text,
  },
  h3: {
    fontSize: fs(20),
    fontWeight: '600',
    lineHeight: fs(26),
    color: Colors.text,
  },
  h4: {
    fontSize: fs(17),
    fontWeight: '600',
    lineHeight: fs(22),
    color: Colors.text,
  },

  // Body text
  body: {
    fontSize: fs(15),
    fontWeight: '400',
    lineHeight: fs(22),
    color: Colors.text,
  },
  bodyMedium: {
    fontSize: fs(15),
    fontWeight: '500',
    lineHeight: fs(22),
    color: Colors.text,
  },
  bodySemibold: {
    fontSize: fs(15),
    fontWeight: '600',
    lineHeight: fs(22),
    color: Colors.text,
  },
  bodyBold: {
    fontSize: fs(15),
    fontWeight: '700',
    lineHeight: fs(22),
    color: Colors.text,
  },

  // Captions & small text
  caption: {
    fontSize: fs(13),
    fontWeight: '500',
    lineHeight: fs(18),
    color: Colors.textSecondary,
  },
  captionSmall: {
    fontSize: fs(11),
    fontWeight: '500',
    lineHeight: fs(14),
    color: Colors.textSecondary,
  },

  // Labels
  label: {
    fontSize: fs(13),
    fontWeight: '600',
    lineHeight: fs(16),
    letterSpacing: 0.3,
    color: Colors.text,
  },
  labelSmall: {
    fontSize: fs(11),
    fontWeight: '600',
    lineHeight: fs(14),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },

  // Buttons
  buttonLarge: {
    fontSize: fs(17),
    fontWeight: '600',
    lineHeight: fs(22),
    letterSpacing: 0.2,
  },
  button: {
    fontSize: fs(15),
    fontWeight: '600',
    lineHeight: fs(20),
    letterSpacing: 0.2,
  },
  buttonSmall: {
    fontSize: fs(13),
    fontWeight: '600',
    lineHeight: fs(16),
    letterSpacing: 0.2,
  },

  // Numbers - for stats, counts
  numberLarge: {
    fontSize: fs(48),
    fontWeight: '700',
    lineHeight: fs(52),
    letterSpacing: -1,
    color: Colors.primary,
  },
  number: {
    fontSize: fs(32),
    fontWeight: '700',
    lineHeight: fs(36),
    letterSpacing: -0.5,
    color: Colors.primary,
  },
  numberSmall: {
    fontSize: fs(24),
    fontWeight: '700',
    lineHeight: fs(28),
    color: Colors.primary,
  },

  // Special
  tag: {
    fontSize: fs(11),
    fontWeight: '600',
    lineHeight: fs(14),
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  hint: {
    fontSize: fs(13),
    fontWeight: '400',
    lineHeight: fs(18),
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
};
