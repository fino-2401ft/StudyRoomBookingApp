import React, { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import {
  formatDateKey,
  formatDayNumber,
  formatShortDay,
  getNextSevenDays,
} from '../utils/dateHelpers';

interface DatePickerProps {
  selectedDate: string;
  onSelect: (dateKey: string) => void;
}

function DatePickerComponent({ selectedDate, onSelect }: DatePickerProps) {
  const days = getNextSevenDays();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Select date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {days.map((day) => {
          const key = formatDateKey(day);
          const active = key === selectedDate;
          return (
            <Pressable
              key={key}
              onPress={() => onSelect(key)}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text style={[styles.weekday, active && styles.textActive]}>
                {formatShortDay(day)}
              </Text>
              <Text style={[styles.dateNum, active && styles.textActive]}>
                {formatDayNumber(day)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export const DatePicker = memo(DatePickerComponent);

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    gap: 8,
  },
  day: {
    width: 58,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSolid,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dayActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekday: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateNum: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  textActive: {
    color: colors.white,
  },
});
