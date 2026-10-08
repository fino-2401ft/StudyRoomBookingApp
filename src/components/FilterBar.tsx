import React, { memo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ALL_EQUIPMENT, BUILDINGS } from '../data/rooms';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { Building, Equipment } from '../types';

function FilterBarComponent() {
  const filters = useBookingStore((s) => s.filters);
  const setFilters = useBookingStore((s) => s.setFilters);
  const toggleBuilding = useBookingStore((s) => s.toggleBuilding);
  const toggleEquipment = useBookingStore((s) => s.toggleEquipment);
  const resetFilters = useBookingStore((s) => s.resetFilters);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search rooms, building, equipment..."
        placeholderTextColor={colors.textMuted}
        value={filters.search}
        onChangeText={(search) => setFilters({ search })}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {BUILDINGS.map((building) => {
          const active = filters.buildings.includes(building as Building);
          return (
            <Chip
              key={building}
              label={`Building ${building}`}
              active={active}
              onPress={() => toggleBuilding(building as Building)}
            />
          );
        })}
      </ScrollView>

      <View style={styles.capacityRow}>
        <Text style={styles.label}>Capacity</Text>
        <View style={styles.capacityControls}>
          <Chip
            label="2–8"
            active={filters.maxCapacity <= 8}
            onPress={() => setFilters({ minCapacity: 2, maxCapacity: 8 })}
          />
          <Chip
            label="9–14"
            active={filters.minCapacity >= 9 && filters.maxCapacity <= 14}
            onPress={() => setFilters({ minCapacity: 9, maxCapacity: 14 })}
          />
          <Chip
            label="15–20"
            active={filters.minCapacity >= 15}
            onPress={() => setFilters({ minCapacity: 15, maxCapacity: 20 })}
          />
          <Chip
            label="Any"
            active={filters.minCapacity === 2 && filters.maxCapacity === 20}
            onPress={() => setFilters({ minCapacity: 2, maxCapacity: 20 })}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {ALL_EQUIPMENT.map((item) => {
          const active = filters.equipment.includes(item as Equipment);
          return (
            <Chip
              key={item}
              label={item}
              active={active}
              onPress={() => toggleEquipment(item as Equipment)}
            />
          );
        })}
        <Chip
          label="Available only"
          active={filters.availableOnly}
          onPress={() => setFilters({ availableOnly: !filters.availableOnly })}
        />
        <Chip label="Reset" active={false} onPress={resetFilters} muted />
      </ScrollView>
    </View>
  );
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  muted?: boolean;
}

function Chip({ label, active, onPress, muted }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.chipActive,
        muted && styles.chipMuted,
      ]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export const FilterBar = memo(FilterBarComponent);

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 12,
  },
  search: {
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
  },
  row: {
    gap: 8,
    paddingRight: 8,
  },
  capacityRow: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  capacityControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipMuted: {
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
  },
});
