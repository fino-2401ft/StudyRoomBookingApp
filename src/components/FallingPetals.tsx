import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PETAL_COUNT = 18;

type PetalConfig = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  opacity: number;
  color: string;
};

function createPetals(): PetalConfig[] {
  const palette = [
    colors.crystal,
    colors.accent,
    colors.primaryLight,
    colors.crystalDeep,
    '#F4F0F3',
    '#D5A6B9',
  ];

  return Array.from({ length: PETAL_COUNT }, (_, i) => ({
    left: (i * 47) % SCREEN_W,
    size: 10 + (i % 5) * 3,
    delay: (i * 420) % 5000,
    duration: 9000 + (i % 6) * 1200,
    drift: ((i % 7) - 3) * 28,
    rotate: 180 + (i % 5) * 90,
    opacity: 0.35 + (i % 4) * 0.12,
    color: palette[i % palette.length],
  }));
}

function Petal({ config }: { config: PetalConfig }) {
  const progress = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fall = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    const wiggle = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, {
          toValue: 1,
          duration: 2200 + config.delay * 0.1,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sway, {
          toValue: 0,
          duration: 2200 + config.delay * 0.1,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    fall.start();
    wiggle.start();
    return () => {
      fall.stop();
      wiggle.stop();
    };
  }, [config, progress, sway]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, SCREEN_H + 40],
  });

  const translateX = Animated.add(
    progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, config.drift],
    }),
    sway.interpolate({
      inputRange: [0, 1],
      outputRange: [-10, 10],
    }),
  );

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.rotate}deg`],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.petal,
        {
          left: config.left,
          width: config.size,
          height: config.size * 1.35,
          borderRadius: config.size,
          backgroundColor: config.color,
          opacity: config.opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

export function FallingPetals() {
  const petals = useMemo(() => createPetals(), []);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {petals.map((petal, index) => (
        <Petal key={index} config={petal} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    top: 0,
  },
});
