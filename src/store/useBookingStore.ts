import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getTimeSlotById } from '../data/timeSlots';
import {
  Booking,
  Building,
  Equipment,
  RoomFilters,
  TimeSlotId,
  UserSession,
} from '../types';
import { generateBookingCode, generateId } from '../utils/bookingCode';
import {
  cancelBookingReminder,
  scheduleBookingReminder,
} from '../utils/notifications';

const DEFAULT_FILTERS: RoomFilters = {
  search: '',
  buildings: [],
  minCapacity: 2,
  maxCapacity: 20,
  equipment: [],
  availableOnly: false,
};

const DEFAULT_USER: UserSession = {
  id: 'u-demo',
  name: 'VKU Student',
  studentId: '22IT001',
  email: 'student@vku.udn.vn',
};

function seedBookings(): Booking[] {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().slice(0, 10);

  return [
    {
      id: 'seed-1',
      bookingCode: 'VKU-DEMO01',
      roomId: 'a205',
      roomName: 'A205 – Seminar',
      building: 'A',
      floor: 2,
      date: today,
      timeSlotId: '09:30-11:30',
      timeSlotLabel: '09:30 – 11:30',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      bookingCode: 'VKU-DEMO02',
      roomId: 'b112',
      roomName: 'B112 – Lab Lite',
      building: 'B',
      floor: 1,
      date: tomorrow,
      timeSlotId: '13:00-15:00',
      timeSlotLabel: '13:00 – 15:00',
      createdAt: new Date().toISOString(),
    },
  ];
}

interface BookingState {
  user: UserSession;
  bookings: Booking[];
  filters: RoomFilters;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setUser: (user: Partial<UserSession>) => void;
  setFilters: (patch: Partial<RoomFilters>) => void;
  resetFilters: () => void;
  toggleBuilding: (building: Building) => void;
  toggleEquipment: (equipment: Equipment) => void;
  isSlotBooked: (roomId: string, date: string, timeSlotId: TimeSlotId) => boolean;
  createBooking: (input: {
    roomId: string;
    roomName: string;
    building: Building;
    floor: number;
    date: string;
    timeSlotId: TimeSlotId;
  }) => Promise<{ ok: true; booking: Booking } | { ok: false; error: string }>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getActiveBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      bookings: seedBookings(),
      filters: DEFAULT_FILTERS,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      setUser: (patch) =>
        set((state) => ({
          user: { ...state.user, ...patch },
        })),

      setFilters: (patch) =>
        set((state) => ({
          filters: { ...state.filters, ...patch },
        })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS }),

      toggleBuilding: (building) =>
        set((state) => {
          const exists = state.filters.buildings.includes(building);
          return {
            filters: {
              ...state.filters,
              buildings: exists
                ? state.filters.buildings.filter((item) => item !== building)
                : [...state.filters.buildings, building],
            },
          };
        }),

      toggleEquipment: (equipment) =>
        set((state) => {
          const exists = state.filters.equipment.includes(equipment);
          return {
            filters: {
              ...state.filters,
              equipment: exists
                ? state.filters.equipment.filter((item) => item !== equipment)
                : [...state.filters.equipment, equipment],
            },
          };
        }),

      isSlotBooked: (roomId, date, timeSlotId) =>
        get().bookings.some(
          (booking) =>
            booking.roomId === roomId &&
            booking.date === date &&
            booking.timeSlotId === timeSlotId,
        ),

      createBooking: async ({
        roomId,
        roomName,
        building,
        floor,
        date,
        timeSlotId,
      }) => {
        if (get().isSlotBooked(roomId, date, timeSlotId)) {
          return {
            ok: false,
            error: 'This time slot is already booked. Please choose another.',
          };
        }

        const slot = getTimeSlotById(timeSlotId);
        const booking: Booking = {
          id: generateId(),
          bookingCode: generateBookingCode(),
          roomId,
          roomName,
          building,
          floor,
          date,
          timeSlotId,
          timeSlotLabel: slot.label,
          createdAt: new Date().toISOString(),
        };

        const notificationId = await scheduleBookingReminder(booking);
        const withNotification = { ...booking, notificationId };

        set((state) => ({
          bookings: [withNotification, ...state.bookings],
        }));

        return { ok: true, booking: withNotification };
      },

      cancelBooking: async (bookingId) => {
        const booking = get().bookings.find((item) => item.id === bookingId);
        if (booking?.notificationId) {
          await cancelBookingReminder(booking.notificationId);
        }
        set((state) => ({
          bookings: state.bookings.filter((item) => item.id !== bookingId),
        }));
      },

      getActiveBookings: () => {
        const todayKey = new Date().toISOString().slice(0, 10);
        return get()
          .bookings.filter((booking) => booking.date >= todayKey)
          .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.timeSlotId.localeCompare(b.timeSlotId);
          });
      },
    }),
    {
      name: 'vku-booking-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings,
        filters: state.filters,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
