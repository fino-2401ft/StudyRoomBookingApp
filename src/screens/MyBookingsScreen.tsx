import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { Booking } from '../types';

export function MyBookingsScreen() {
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const [selected, setSelected] = useState<Booking | null>(null);

  const activeBookings = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return bookings
      .filter((booking) => booking.date >= todayKey)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.timeSlotId.localeCompare(b.timeSlotId);
      });
  }, [bookings]);

  const onCancel = useCallback(
    (booking: Booking) => {
      Alert.alert(
        'Cancel booking?',
        `${booking.roomName} · ${booking.date} · ${booking.timeSlotLabel}`,
        [
          { text: 'Keep', style: 'cancel' },
          {
            text: 'Cancel booking',
            style: 'destructive',
            onPress: () => {
              void cancelBooking(booking.id);
            },
          },
        ],
      );
    },
    [cancelBooking],
  );

  const renderItem: ListRenderItem<Booking> = useCallback(
    ({ item }) => (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardInfo}>
            <Text style={styles.room}>{item.roomName}</Text>
            <Text style={styles.meta}>
              Building {item.building} · Floor {item.floor}
            </Text>
            <Text style={styles.slot}>
              {item.date} · {item.timeSlotLabel}
            </Text>
            <Text style={styles.code}>{item.bookingCode}</Text>
          </View>
          <Pressable onPress={() => setSelected(item)} style={styles.qrMini}>
            <QRCode
              value={item.bookingCode}
              size={64}
              backgroundColor="#FFFBFC"
              color="#7D4051"
            />
          </Pressable>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.secondaryBtn} onPress={() => setSelected(item)}>
            <Text style={styles.secondaryText}>Show QR</Text>
          </Pressable>
          <Pressable style={styles.dangerBtn} onPress={() => onCancel(item)}>
            <Text style={styles.dangerText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    ),
    [onCancel],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          Active reservations with check-in QR codes.
        </Text>
      </View>

      <FlatList
        data={activeBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No upcoming bookings</Text>
            <Text style={styles.emptyText}>
              Browse rooms and reserve a free 2-hour slot.
            </Text>
          </View>
        }
      />

      <BookingSuccessModal
        visible={!!selected}
        booking={selected}
        onClose={() => setSelected(null)}
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  room: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  slot: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  code: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  qrMini: {
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '700',
  },
  dangerBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.dangerBg,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
  },
  empty: {
    marginTop: 48,
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
