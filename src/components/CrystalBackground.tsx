import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { FallingPetals } from './FallingPetals';

interface CrystalBackgroundProps {
  children: ReactNode;
}

export function CrystalBackground({ children }: CrystalBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft crystal glows — muted dusty rose like WR Shop */}
      <View style={styles.glowTop} />
      <View style={styles.glowMid} />
      <View style={styles.glowBottom} />
      <FallingPetals />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(231, 201, 208, 0.55)',
  },
  glowMid: {
    position: 'absolute',
    top: '38%',
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(213, 166, 185, 0.28)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 40,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(183, 124, 158, 0.18)',
  },
});
