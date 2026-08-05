import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { PikaMood } from '../types';
import { Colors, Shadows } from '../constants/colors';

interface PikaProps {
  mood: PikaMood;
  size?: number;
  position?: 'center' | 'left' | 'right';
}

const EyeHappy = () => (
  <G>
    <Circle cx={42} cy={50} r={8} fill="url(#eyeGradient)" />
    <Circle cx={68} cy={50} r={8} fill="url(#eyeGradient)" />
    <Circle cx={44} cy={48} r={3} fill="#FFFFFF" />
    <Circle cx={70} cy={48} r={3} fill="#FFFFFF" />
  </G>
);

const EyeWave = () => (
  <G>
    <Path d="M 34 50 Q 42 42 50 50" stroke={Colors.primary} strokeWidth={4} fill="none" strokeLinecap="round" />
    <Circle cx={68} cy={50} r={8} fill="url(#eyeGradient)" />
    <Circle cx={70} cy={48} r={3} fill="#FFFFFF" />
  </G>
);

const EyeThinking = () => (
  <G>
    <Ellipse cx={42} cy={52} rx={7} ry={5} fill="url(#eyeGradient)" />
    <Ellipse cx={68} cy={52} rx={7} ry={5} fill="url(#eyeGradient)" />
    <Circle cx={78} cy={38} r={4} fill={Colors.purple} opacity={0.6} />
    <Circle cx={84} cy={32} r={2.5} fill={Colors.purple} opacity={0.4} />
  </G>
);

const EyeSurprised = () => (
  <G>
    <Circle cx={42} cy={50} r={10} fill="url(#eyeGradient)" />
    <Circle cx={68} cy={50} r={10} fill="url(#eyeGradient)" />
    <Circle cx={42} cy={50} r={4} fill={Colors.text} />
    <Circle cx={68} cy={50} r={4} fill={Colors.text} />
    <Circle cx={44} cy={47} r={2.5} fill="#FFFFFF" />
    <Circle cx={70} cy={47} r={2.5} fill="#FFFFFF" />
  </G>
);

const EyeExcited = () => (
  <G>
    <Path d="M 42 42 L 44 48 L 50 49 L 45 53 L 47 59 L 42 55 L 37 59 L 39 53 L 34 49 L 40 48 Z" fill={Colors.yellow} />
    <Path d="M 68 42 L 70 48 L 76 49 L 71 53 L 73 59 L 68 55 L 63 59 L 65 53 L 60 49 L 66 48 Z" fill={Colors.yellow} />
  </G>
);

const EyeTeaching = () => (
  <G>
    <Circle cx={42} cy={50} r={7} fill="url(#eyeGradient)" />
    <Circle cx={68} cy={50} r={7} fill="url(#eyeGradient)" />
    <Circle cx={44} cy={48} r={2.5} fill="#FFFFFF" />
    <Circle cx={70} cy={48} r={2.5} fill="#FFFFFF" />
    <Path d="M 36 52 L 48 52" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
    <Path d="M 62 52 L 74 52" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
  </G>
);

const Eyes: Record<PikaMood, React.FC> = {
  happy: EyeHappy,
  wave: EyeWave,
  thinking: EyeThinking,
  surprised: EyeSurprised,
  excited: EyeExcited,
  teaching: EyeTeaching,
};

export const Pika: React.FC<PikaProps> = ({ mood, size = 120, position = 'center' }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Gentle floating animation
    translateY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle breathing/scaling
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Tiny wobble
    rotation.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const EyeComponent = Eyes[mood];

  return (
    <View style={[styles.container, styles[position]]}>
      <Animated.View style={[styles.pikaWrapper, animatedStyle, { width: size, height: size }]}>
        <Svg viewBox="0 0 110 110" width={size} height={size}>
          <Defs>
            {/* Body gradient */}
            <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#F1F5F9" />
            </LinearGradient>

            {/* Face screen gradient */}
            <RadialGradient id="faceGradient" cx="50%" cy="40%" r="60%">
              <Stop offset="0%" stopColor={Colors.primaryLight} />
              <Stop offset="100%" stopColor={Colors.primary} />
            </RadialGradient>

            {/* Eye gradient */}
            <RadialGradient id="eyeGradient" cx="40%" cy="30%" r="60%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor={Colors.primaryLight} />
            </RadialGradient>

            {/* Ear gradient */}
            <LinearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primaryLight} />
              <Stop offset="100%" stopColor={Colors.primary} />
            </LinearGradient>

            {/* Glow */}
            <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={Colors.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={Colors.primary} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Glow behind */}
          <Circle cx={55} cy={60} r={50} fill="url(#glowGradient)" />

          {/* Antenna */}
          <Path d="M 55 20 Q 55 8 55 5" stroke={Colors.textSecondary} strokeWidth={3} strokeLinecap="round" fill="none" />
          <Circle cx={55} cy={5} r={5} fill={Colors.yellow} />
          <Circle cx={53} cy={3} r={2} fill="#FFFFFF" opacity={0.7} />

          {/* Ear fins */}
          <Ellipse cx={18} cy={52} rx={8} ry={16} fill="url(#earGradient)" />
          <Ellipse cx={92} cy={52} rx={8} ry={16} fill="url(#earGradient)" />

          {/* Main body */}
          <Ellipse cx={55} cy={62} rx={40} ry={42} fill="url(#bodyGradient)" />

          {/* Face screen area */}
          <Ellipse cx={55} cy={52} rx={30} ry={24} fill="url(#faceGradient)" />

          {/* Eyes based on mood */}
          <EyeComponent />

          {/* Smile */}
          <Path
            d="M 45 62 Q 55 70 65 62"
            stroke="#FFFFFF"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />

          {/* Cheeks */}
          <Ellipse cx={28} cy={70} rx={8} ry={5} fill={Colors.accent} opacity={0.4} />
          <Ellipse cx={82} cy={70} rx={8} ry={5} fill={Colors.accent} opacity={0.4} />

          {/* Chest button */}
          <Circle cx={55} cy={88} r={6} fill={Colors.yellow} />
          <Circle cx={53} cy={86} r={2} fill="#FFFFFF" opacity={0.7} />

          {/* Arms */}
          <Circle cx={18} cy={75} r={8} fill="#FFFFFF" />
          <Circle cx={18} cy={75} r={4} fill={Colors.primaryLight} />

          {mood === 'wave' ? (
            <G>
              <Circle cx={95} cy={40} r={8} fill="#FFFFFF" />
              <Circle cx={95} cy={40} r={4} fill={Colors.primaryLight} />
            </G>
          ) : (
            <G>
              <Circle cx={92} cy={75} r={8} fill="#FFFFFF" />
              <Circle cx={92} cy={75} r={4} fill={Colors.primaryLight} />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Soft shadow */}
      <View style={styles.shadow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  center: {
    alignSelf: 'center',
  },
  left: {
    alignSelf: 'flex-start',
    marginLeft: '8%',
  },
  right: {
    alignSelf: 'flex-end',
    marginRight: '8%',
  },
  pikaWrapper: {
    zIndex: 5,
  },
  shadow: {
    width: 60,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 30,
    marginTop: -8,
    zIndex: -1,
  },
});
