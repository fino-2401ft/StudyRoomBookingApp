import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TIME_SLOTS } from '../data/timeSlots';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { TimeSlotId } from '../types';
import { isSlotInPast } from '../utils/dateHelpers';

interface TimeSlotPickerProps {
  roomId: string;
  date: string;
  selectedSlot: TimeSlotId | null;
  onSelect: (slotId: TimeSlotId) => void;
}

function TimeSlotPickerComponent({
  roomId,
  date,
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) {
  const isSlotBooked = useBookingStore((s) => s.isSlotBooked);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Time slots (2 hours)</Text>
      <Text style={styles.hint}>Booked slots are disabled to prevent conflicts.</Text>
      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const booked = isSlotBooked(roomId, date, slot.id);
          const past = isSlotInPast(date, slot);
          const disabled = booked || past;
          const active = selectedSlot === slot.id;

          return (
            <Pressable
              key={slot.id}
              disabled={disabled}
              onPress={() => onSelect(slot.id)}
              style={[
                styles.slot,
                active && styles.slotActive,
                disabled && styles.slotDisabled,
              ]}
            >
              <Text
                style={[
                  styles.slotText,
                  active && styles.slotTextActive,
                  disabled && styles.slotTextDisabled,
                ]}
              >
                {slot.label}
              </Text>
              {booked ? (
                <Text style={styles.statusBooked}>Booked</Text>
              ) : past ? (
                <Text style={styles.statusPast}>Past</Text>
              ) : (
                <Text style={[styles.statusFree, active && styles.statusFreeActive]}>
                  Free
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const TimeSlotPicker = memo(TimeSlotPickerComponent);

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  grid: {
    gap: 10,
  },
  slot: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSolid,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotDisabled: {
    backgroundColor: '#F8E8EE',
    borderColor: colors.border,
  },
  slotText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  slotTextActive: {
    color: colors.white,
  },
  slotTextDisabled: {
    color: colors.disabled,
  },
  statusFree: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.available,
  },
  statusFreeActive: {
    color: colors.primaryLight,
  },
  statusBooked: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.occupied,
  },
  statusPast: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
