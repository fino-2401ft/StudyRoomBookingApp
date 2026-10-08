import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingSuccessModal } from '../components/BookingSuccessModal';
import { DatePicker } from '../components/DatePicker';
import { TimeSlotPicker } from '../components/TimeSlotPicker';
import { ROOMS } from '../data/rooms';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { Booking, RootStackParamList, TimeSlotId } from '../types';
import { formatDateKey } from '../utils/dateHelpers';

type Route = RouteProp<RootStackParamList, 'Booking'>;

export function BookingScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const createBooking = useBookingStore((s) => s.createBooking);

  const room = useMemo(
    () => ROOMS.find((item) => item.id === route.params.roomId),
    [route.params.roomId],
  );

  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  if (!room) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Room not found.</Text>
      </SafeAreaView>
    );
  }

  const onConfirm = async () => {
    if (!selectedSlot) {
      Alert.alert('Select a time slot', 'Please choose an available 2-hour slot.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBooking({
        roomId: room.id,
        roomName: room.name,
        building: room.building,
        floor: room.floor,
        date: selectedDate,
        timeSlotId: selectedSlot,
      });

      if (!result.ok) {
        Alert.alert('Conflict detected', result.error);
        return;
      }

      setSuccessBooking(result.booking);
      setSelectedSlot(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.meta}>
          Building {room.building} · Floor {room.floor} · {room.capacity} seats
        </Text>

        <View style={styles.section}>
          <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
        </View>

        <View style={styles.section}>
          <TimeSlotPicker
            roomId={room.id}
            date={selectedDate}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.cta, (!selectedSlot || submitting) && styles.ctaDisabled]}
          disabled={!selectedSlot || submitting}
          onPress={onConfirm}
        >
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.ctaText}>Confirm booking</Text>
          )}
        </Pressable>
      </View>

      <BookingSuccessModal
        visible={!!successBooking}
        booking={successBooking}
        onClose={() => {
          setSuccessBooking(null);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 110,
    gap: 8,
  },
  roomName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
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
  ctaDisabled: {
    opacity: 0.5,
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
