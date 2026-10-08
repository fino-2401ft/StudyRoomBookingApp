import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { ROOMS } from '../data/rooms';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { Room, RootStackParamList } from '../types';
import { isRoomOccupiedNow } from '../utils/dateHelpers';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function RoomsScreen() {
  const navigation = useNavigation<Nav>();
  const filters = useBookingStore((s) => s.filters);

  const rooms = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return ROOMS.filter((room) => {
      if (filters.buildings.length > 0 && !filters.buildings.includes(room.building)) {
        return false;
      }

      if (room.capacity < filters.minCapacity || room.capacity > filters.maxCapacity) {
        return false;
      }

      if (
        filters.equipment.length > 0 &&
        !filters.equipment.every((item) => room.equipment.includes(item))
      ) {
        return false;
      }

      if (filters.availableOnly && isRoomOccupiedNow(room.id)) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        room.name,
        room.building,
        room.description,
        ...room.equipment,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [filters]);

  const onPressRoom = useCallback(
    (roomId: string) => {
      navigation.navigate('RoomDetail', { roomId });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Room> = useCallback(
    ({ item }) => (
      <RoomCard
        room={item}
        occupied={isRoomOccupiedNow(item.id)}
        onPress={onPressRoom}
      />
    ),
    [onPressRoom],
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.kicker}>VKU Crystal Rooms</Text>
        <Text style={styles.title}>Study Room Booking</Text>
        <Text style={styles.subtitle}>
          Soft pink campus booking — find a free room in seconds.
        </Text>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={<FilterBar />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No rooms match</Text>
            <Text style={styles.emptyText}>
              Try clearing filters or widening the capacity range.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
