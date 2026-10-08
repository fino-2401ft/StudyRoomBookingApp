import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types';
import { getTimeSlotById } from '../data/timeSlots';
import { getSlotStartDate } from './dateHelpers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice && Platform.OS !== 'web') {
    // Simulators can still schedule local notifications on many setups
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function scheduleBookingReminder(
  booking: Booking,
): Promise<string | undefined> {
  const granted = await ensureNotificationPermissions();
  if (!granted) return undefined;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('booking-reminders', {
      name: 'Booking reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const slot = getTimeSlotById(booking.timeSlotId);
  const start = getSlotStartDate(booking.date, slot);
  const triggerDate = new Date(start.getTime() - 15 * 60 * 1000);

  if (triggerDate.getTime() <= Date.now()) {
    return undefined;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Study room check-in soon',
      body: `${booking.roomName} starts in 15 minutes. Code: ${booking.bookingCode}`,
      data: { bookingId: booking.id, bookingCode: booking.bookingCode },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === 'android' ? 'booking-reminders' : undefined,
    },
  });

  return notificationId;
}

export async function cancelBookingReminder(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Notification may already have fired
  }
}
