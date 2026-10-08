import { TimeSlot, TimeSlotId } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: '07:30-09:30',
    label: '07:30 – 09:30',
    startHour: 7,
    startMinute: 30,
    endHour: 9,
    endMinute: 30,
  },
  {
    id: '09:30-11:30',
    label: '09:30 – 11:30',
    startHour: 9,
    startMinute: 30,
    endHour: 11,
    endMinute: 30,
  },
  {
    id: '13:00-15:00',
    label: '13:00 – 15:00',
    startHour: 13,
    startMinute: 0,
    endHour: 15,
    endMinute: 0,
  },
  {
    id: '15:00-17:00',
    label: '15:00 – 17:00',
    startHour: 15,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
  },
];

export function getTimeSlotById(id: TimeSlotId): TimeSlot {
  const slot = TIME_SLOTS.find((item) => item.id === id);
  if (!slot) {
    throw new Error(`Unknown time slot: ${id}`);
  }
  return slot;
}
