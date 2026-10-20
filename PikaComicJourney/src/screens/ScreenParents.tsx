import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { FaunaColors, FaunaFontSize } from '../constants/theme';
import { buttonFeedback } from '../utils/sounds';
import { logEvent } from '../services/tracking';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STAGE_RATIO = 952 / 1269;
const screenRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
const scale = screenRatio > STAGE_RATIO
  ? SCREEN_HEIGHT / 1269
  : SCREEN_WIDTH / 952;
const s = (v: number) => v * scale;

const BENEFITS = [
  { id: 'send', icon: 'send' },
  { id: 'report', icon: 'report' },
  { id: 'safety', icon: 'safety' },
];

const IconSvg = ({ type, active }: { type: string; active: boolean }) => {
  const color = active ? '#2B2208' : FaunaColors.t2;
  const sw = active ? 2.2 : 2;
  if (type === 'send') {
    return (
      <Svg width={s(28)} height={s(28)} viewBox="0 0 24 24" fill="none">
        <Path d="M4 12l16-7-7 16-2.2-6.8z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (type === 'report') {
    return (
      <Svg width={s(28)} height={s(28)} viewBox="0 0 24 24" fill="none">
        <Path d="M4 20V9M10 20V4M16 20v-7M22 20H2" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={s(28)} height={s(28)} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.2l7 2.6v5.6c0 4.3-2.9 7.6-7 9.4-4.1-1.8-7-5.1-7-9.4V5.8z" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12.2l2.2 2.2L15.4 10" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

export const ScreenParents: React.FC = () => {
  const { t } = useTranslation();
  const { setCurrentScreen } = useApp();
  const [activeBenefit, setActiveBenefit] = useState('send');

  const phoneKey = `parents.phone.${activeBenefit}`;
  const rows = t(`${phoneKey}.rows`, { returnObjects: true }) as string[];

  const handleBenefitPress = (id: string) => {
    buttonFeedback();
    setActiveBenefit(id);
    logEvent('select_benefit', 'parents', { benefitId: id });
  };

  const handlePillPress = () => {
    buttonFeedback();
    if (activeBenefit === 'send') {
      setCurrentScreen('topics');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fauna/bg-land.webp')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <Text style={styles.eyebrow}>{t('parents.eyebrow')}</Text>
      <Text style={styles.title}>{t('parents.title')}</Text>
      <Text style={styles.subtitle}>{t('parents.subtitle')}</Text>

      {/* Benefits Row */}
      <View style={styles.benRow}>
        {BENEFITS.map(ben => {
          const isActive = activeBenefit === ben.id;
          return (
            <Pressable
              key={ben.id}
              style={[styles.ben, isActive && styles.benActive]}
              onPress={() => handleBenefitPress(ben.id)}
            >
              <View style={[styles.benIcon, isActive && styles.benIconActive]}>
                <IconSvg type={ben.icon} active={isActive} />
              </View>
              <Text style={styles.benTitle}>{t(`parents.benefits.${ben.id}.title`)}</Text>
              <Text style={styles.benDesc}>{t(`parents.benefits.${ben.id}.desc`)}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Panel */}
      <View style={styles.panel}>
        <Text style={styles.panelKicker}>{t(`${phoneKey}.kicker`)}</Text>
        <Pressable style={styles.panelPill} onPress={handlePillPress}>
          <Text style={styles.panelPillText}>{t(`${phoneKey}.pill`)}</Text>
        </Pressable>
        <Text style={styles.panelTitle}>{t(`${phoneKey}.title`)}</Text>

        {/* Phone Mock */}
        <View style={styles.phone}>
          <View style={styles.phoneScreen}>
            <View style={styles.phoneNotch} />
            {rows.map((row, i) => {
              if (row.startsWith('%')) {
                const percent = parseInt(row.slice(1));
                return (
                  <View key={i} style={styles.miniBar}>
                    <View style={[styles.miniBarFill, { width: `${percent}%` }]} />
                  </View>
                );
              }
              return (
                <View key={i} style={styles.miniRow}>
                  <Text style={styles.miniRowEmoji}>{row.slice(0, 2)}</Text>
                  <Text style={styles.miniRowText}>{row.slice(2)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Caption */}
        <View style={styles.caption}>
          <Text style={styles.capTitle}>{t(`${phoneKey}.capTitle`)}</Text>
          <Text style={styles.capText}>{t(`${phoneKey}.capText`)}</Text>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {BENEFITS.map((ben, i) => (
            <View
              key={ben.id}
              style={[styles.dot, activeBenefit === ben.id && styles.dotActive]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.foot}>{t('parents.foot')}</Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FaunaColors.night0,
  },
  eyebrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(52),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: s(2),
    color: FaunaColors.amberHi,
    textTransform: 'uppercase',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: s(80),
    textAlign: 'center',
    fontSize: s(FaunaFontSize['4xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['4xl'] * 1.16),
    color: FaunaColors.t1,
  },
  subtitle: {
    position: 'absolute',
    left: s(100),
    right: s(100),
    top: s(140),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.35),
    color: FaunaColors.t3,
  },
  benRow: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(186),
    flexDirection: 'row',
    gap: s(16),
  },
  ben: {
    flex: 1,
    padding: s(18),
    paddingBottom: s(20),
    borderRadius: s(24),
    backgroundColor: 'rgba(20,30,60,0.45)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.22)',
  },
  benActive: {
    borderWidth: 3,
    borderColor: FaunaColors.amber,
    backgroundColor: 'rgba(32,46,96,0.6)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.4,
    shadowRadius: s(20),
    elevation: 10,
  },
  benIcon: {
    width: s(52),
    height: s(52),
    borderRadius: s(18),
    backgroundColor: 'rgba(167,196,234,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(167,196,234,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(14),
  },
  benIconActive: {
    backgroundColor: FaunaColors.amber,
    borderColor: 'rgba(255,245,220,0.9)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(3) },
    shadowOpacity: 0.6,
    shadowRadius: s(14),
    elevation: 8,
  },
  benTitle: {
    fontSize: s(FaunaFontSize.base),
    fontWeight: '800',
    color: FaunaColors.t1,
    marginBottom: s(6),
  },
  benDesc: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.xs * 1.35),
    color: FaunaColors.t3,
  },
  panel: {
    position: 'absolute',
    left: s(60),
    right: s(60),
    top: s(380),
    height: s(700),
    borderRadius: s(32),
    backgroundColor: 'rgba(20,32,72,0.45)',
    borderWidth: 2,
    borderTopColor: 'rgba(245,185,78,0.45)',
    borderLeftColor: 'rgba(245,185,78,0.25)',
    borderRightColor: 'rgba(180,130,30,0.35)',
    borderBottomColor: 'rgba(160,100,20,0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(12) },
    shadowOpacity: 0.4,
    shadowRadius: s(24),
    elevation: 12,
    overflow: 'hidden',
  },
  panelKicker: {
    position: 'absolute',
    left: s(30),
    top: s(32),
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '800',
    letterSpacing: s(2),
    color: '#F0C273',
    textTransform: 'uppercase',
  },
  panelPill: {
    position: 'absolute',
    right: s(26),
    top: s(22),
    height: s(54),
    paddingHorizontal: s(26),
    borderRadius: s(27),
    backgroundColor: FaunaColors.amber,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderRightColor: 'rgba(180,130,30,0.5)',
    borderBottomColor: 'rgba(160,100,20,0.6)',
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: s(6) },
    shadowOpacity: 0.55,
    shadowRadius: s(18),
    elevation: 10,
  },
  panelPillText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '800',
    color: '#26200A',
  },
  panelTitle: {
    position: 'absolute',
    left: s(30),
    right: s(30),
    top: s(70),
    fontSize: s(FaunaFontSize['2xl']),
    fontWeight: '800',
    lineHeight: s(FaunaFontSize['2xl'] * 1.2),
    letterSpacing: -0.5,
    color: FaunaColors.t1,
  },
  phone: {
    position: 'absolute',
    left: '50%',
    marginLeft: -s(160),
    top: s(160),
    width: s(320),
    height: s(340),
    borderRadius: s(34),
    backgroundColor: '#1A2540',
    borderWidth: 4,
    borderTopColor: 'rgba(167,196,234,0.35)',
    borderLeftColor: 'rgba(167,196,234,0.22)',
    borderRightColor: 'rgba(10,20,50,0.6)',
    borderBottomColor: 'rgba(5,10,30,0.8)',
    padding: s(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(20) },
    shadowOpacity: 0.55,
    shadowRadius: s(34),
  },
  phoneScreen: {
    flex: 1,
    borderRadius: s(26),
    backgroundColor: '#FEFBF1',
    padding: s(14),
    paddingTop: s(12),
  },
  phoneNotch: {
    width: s(48),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: '#D6DCE6',
    alignSelf: 'center',
    marginBottom: s(14),
  },
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    padding: s(11),
    borderRadius: s(16),
    backgroundColor: '#FFFDF6',
    borderWidth: 1,
    borderColor: '#E9E1CB',
    marginBottom: s(10),
    shadowColor: '#1B2A57',
    shadowOffset: { width: 0, height: s(1) },
    shadowOpacity: 0.05,
    shadowRadius: s(3),
  },
  miniRowEmoji: {
    fontSize: s(20),
  },
  miniRowText: {
    fontSize: s(FaunaFontSize.xs),
    fontWeight: '700',
    color: '#1B2A57',
  },
  miniBar: {
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#E7E1CE',
    marginBottom: s(10),
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: s(4),
    backgroundColor: FaunaColors.amber,
  },
  caption: {
    position: 'absolute',
    left: s(40),
    right: s(40),
    top: s(516),
    alignItems: 'center',
  },
  capTitle: {
    fontSize: s(FaunaFontSize.xl),
    fontWeight: '800',
    color: FaunaColors.t1,
    marginBottom: s(12),
    textAlign: 'center',
  },
  capText: {
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '600',
    lineHeight: s(FaunaFontSize.sm * 1.45),
    color: FaunaColors.t3,
    textAlign: 'center',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: s(24),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(12),
  },
  dot: {
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    backgroundColor: 'rgba(167,196,234,0.35)',
  },
  dotActive: {
    width: s(34),
    backgroundColor: FaunaColors.amber,
    shadowColor: FaunaColors.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: s(12),
    elevation: 6,
  },
  foot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: s(28),
    textAlign: 'center',
    fontSize: s(FaunaFontSize.sm),
    fontWeight: '700',
    color: FaunaColors.t3,
  },
});
