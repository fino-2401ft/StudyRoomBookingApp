import React, { memo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  occupied: boolean;
  onPress: (roomId: string) => void;
}

function RoomCardComponent({ room, occupied, onPress }: RoomCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(room.id)}
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, ${occupied ? 'Occupied' : 'Available Now'}`}
    >
      <Image source={{ uri: room.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {room.name}
          </Text>
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
          Building {room.building} · Floor {room.floor}
        </Text>

        <View style={styles.footer}>
          <View style={styles.capacityChip}>
            <Text style={styles.capacityText}>{room.capacity} seats</Text>
          </View>
          <Text style={styles.equipment} numberOfLines={1}>
            {room.equipment.slice(0, 2).join(' · ')}
            {room.equipment.length > 2 ? ' +' : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function areEqual(prev: RoomCardProps, next: RoomCardProps) {
  return (
    prev.room.id === next.room.id &&
    prev.occupied === next.occupied &&
    prev.onPress === next.onPress
  );
}

export const RoomCard = memo(RoomCardComponent, areEqual);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.primaryLight,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capacityChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  capacityText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  equipment: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
});
