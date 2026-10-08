import {
  addDays,
  format,
  isBefore,
  parse,
  setHours,
  setMinutes,
  startOfDay,
} from 'date-fns';
import { TimeSlot } from '../types';

export function getNextSevenDays(from: Date = new Date()): Date[] {
  const start = startOfDay(from);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'EEE, dd MMM');
}

export function formatShortDay(date: Date): string {
  return format(date, 'EEE');
}

export function formatDayNumber(date: Date): string {
  return format(date, 'dd');
}

export function getSlotStartDate(dateKey: string, slot: TimeSlot): Date {
  const base = parse(dateKey, 'yyyy-MM-dd', new Date());
  return setMinutes(setHours(base, slot.startHour), slot.startMinute);
}

export function isSlotInPast(dateKey: string, slot: TimeSlot, now = new Date()): boolean {
  return isBefore(getSlotStartDate(dateKey, slot), now);
}

/** Simulate real-time occupancy for the current slot of the day. */
export function isRoomOccupiedNow(roomId: string, now = new Date()): boolean {
  const hour = now.getHours();
  const inActiveHours = hour >= 7 && hour < 17;
  if (!inActiveHours) return false;

  // Deterministic pseudo-random occupancy from room id + day + slot block
  const day = format(now, 'yyyy-MM-dd');
  const block = Math.floor(hour / 2);
  let hash = 0;
  const seed = `${roomId}-${day}-${block}`;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return hash % 5 === 0;
}
