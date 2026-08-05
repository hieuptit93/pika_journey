import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, Easing } from 'react-native';

type AnimatedChildProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
};

export const BounceIn: React.FC<AnimatedChildProps> = ({ children, style, delay = 0 }) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        delay,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        delay,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }], opacity }]}>
      {children}
    </Animated.View>
  );
};

export const SlideInUp: React.FC<AnimatedChildProps> = ({ children, style, delay = 0 }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        delay,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }], opacity }]}>
      {children}
    </Animated.View>
  );
};

export const Wobble: React.FC<AnimatedChildProps> = ({ children, style }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 1,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 150,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });

  return (
    <Animated.View style={[style, { transform: [{ rotate }] }]}>
      {children}
    </Animated.View>
  );
};

export const Pulse: React.FC<AnimatedChildProps> = ({ children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
};

export const Float: React.FC<AnimatedChildProps> = ({ children, style }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

export const Shake: React.FC<AnimatedChildProps & { trigger?: boolean }> = ({ children, style, trigger }) => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={[style, { transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
};

export const Sparkle: React.FC<AnimatedChildProps> = ({ children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }], opacity }]}>
      {children}
    </Animated.View>
  );
};

export const RotateContinuous: React.FC<AnimatedChildProps> = ({ children, style }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[style, { transform: [{ rotate }] }]}>
      {children}
    </Animated.View>
  );
};

export const StaggerChildren: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  style?: ViewStyle;
}> = ({ children, staggerDelay = 100, style }) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <BounceIn delay={index * staggerDelay} style={style}>
          {child}
        </BounceIn>
      ))}
    </>
  );
};
