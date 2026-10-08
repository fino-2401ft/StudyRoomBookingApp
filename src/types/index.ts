export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment =
  | 'Projector'
  | 'Whiteboard'
  | 'High-end PCs'
  | 'Air Conditioning';

export type TimeSlotId =
  | '07:30-09:30'
  | '09:30-11:30'
  | '13:00-15:00'
  | '15:00-17:00';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  imageUrl: string;
  description: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  date: string; // yyyy-MM-dd
  timeSlotId: TimeSlotId;
  timeSlotLabel: string;
  createdAt: string;
  notificationId?: string;
}

export interface UserSession {
  id: string;
  name: string;
  studentId: string;
  email: string;
}

export interface RoomFilters {
  search: string;
  buildings: Building[];
  minCapacity: number;
  maxCapacity: number;
  equipment: Equipment[];
  availableOnly: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetail: { roomId: string };
  Booking: { roomId: string };
};

export type MainTabParamList = {
  Rooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};
