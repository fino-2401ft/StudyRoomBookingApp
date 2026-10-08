import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROOMS } from '../data/rooms';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../types';
import { isRoomOccupiedNow } from '../utils/dateHelpers';

type Route = RouteProp<RootStackParamList, 'RoomDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RoomDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const room = useMemo(
    () => ROOMS.find((item) => item.id === route.params.roomId),
    [route.params.roomId],
  );

  if (!room) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Room not found.</Text>
      </SafeAreaView>
    );
  }

  const occupied = isRoomOccupiedNow(room.id);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: room.imageUrl }} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{room.name}</Text>
            <View
              style={[
                styles.badge,
                occupied ? styles.badgeOccupied : styles.badgeAvailable,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  occupied ? styles.badgeTextOccupied : styles.badgeTextAvailable,
                ]}
              >
                {occupied ? 'Occupied' : 'Available Now'}
              </Text>
            </View>
          </View>

          <Text style={styles.meta}>
            Building {room.building} · Floor {room.floor} · {room.capacity} seats
          </Text>
          <Text style={styles.description}>{room.description}</Text>

          <Text style={styles.section}>Equipment</Text>
          <View style={styles.chips}>
            {room.equipment.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.cta}
          onPress={() => navigation.navigate('Booking', { roomId: room.id })}
        >
          <Text style={styles.ctaText}>Book a time slot</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.primaryLight,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeAvailable: {
    backgroundColor: colors.availableBg,
  },
  badgeOccupied: {
    backgroundColor: colors.occupiedBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextAvailable: {
    color: colors.available,
  },
  badgeTextOccupied: {
    color: colors.occupied,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  section: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(244, 240, 243, 0.94)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  missing: {
    margin: 24,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
