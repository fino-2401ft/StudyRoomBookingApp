# VKU Study Room Booking App

React Native + Expo app for booking campus study rooms and computer labs at VKU.

## Learning goals covered

- High-performance room discovery with `FlatList` + memoized `RoomCard`
- Multi-parameter filters (building, capacity, equipment, availability)
- Interactive 7-day date picker and 2-hour time slots
- Immediate conflict prevention for booked slots
- Unique booking codes with QR check-in modal
- Global state via Zustand (`useBookingStore`) persisted with AsyncStorage
- Local reminders with `expo-notifications` (15 minutes before start)

## Run

```bash
npm install
npx expo start
```

Then open in Expo Go (Android/iOS) or press `a` / `i` / `w`.

> Local notifications require a physical device or a capable simulator/emulator. Grant notification permission from the Profile tab if prompted.

## App structure

```
src/
  components/   RoomCard, FilterBar, DatePicker, TimeSlotPicker, BookingSuccessModal
  data/         Mock rooms + time slots
  navigation/   Tabs + stack navigator
  screens/      Rooms, RoomDetail, Booking, MyBookings, Profile
  store/        useBookingStore (Zustand + AsyncStorage)
  theme/        Colors
  types/        Shared TypeScript types
  utils/        Dates, booking codes, notifications
```

## Core flows

1. **Discover** rooms on the Rooms tab; filter by building A/B/C/V, capacity, and equipment.
2. Open a room → **Book a time slot** → pick a day (next 7 days) and a free 2-hour slot.
3. Confirm → receive a unique `VKU-XXXXXX` code and QR modal for check-in.
4. Manage bookings on **My Bookings** (show QR / cancel). Cancel also clears the scheduled reminder.
5. Edit the demo student session on **Profile**; data survives app restarts via AsyncStorage.
