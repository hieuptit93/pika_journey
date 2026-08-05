import { TextStyle } from 'react-native';
import { Colors } from './colors';
import { fs } from './responsive';

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
