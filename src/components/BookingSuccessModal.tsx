import React, { memo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../theme/colors';
import { Booking } from '../types';

interface BookingSuccessModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

function BookingSuccessModalComponent({
  visible,
  booking,
  onClose,
}: BookingSuccessModalProps) {
  if (!booking) return null;

  const qrPayload = JSON.stringify({
    code: booking.bookingCode,
    roomId: booking.roomId,
    date: booking.date,
    slot: booking.timeSlotId,
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Booking confirmed</Text>
          <Text style={styles.title}>{booking.roomName}</Text>
          <Text style={styles.meta}>
            {booking.date} · {booking.timeSlotLabel}
          </Text>

          <View style={styles.qrBox}>
            <QRCode value={qrPayload} size={180} backgroundColor="#FFFBFC" color="#7D4051" />
          </View>

          <Text style={styles.codeLabel}>Check-in code</Text>
          <Text style={styles.code}>{booking.bookingCode}</Text>
          <Text style={styles.note}>
            Show this QR at the room entrance. A reminder will arrive 15 minutes before
            your slot starts.
          </Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const BookingSuccessModal = memo(BookingSuccessModalComponent);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 31, 24, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surfaceSolid,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.available,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  qrBox: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeLabel: {
    marginTop: 16,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  code: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primaryDark,
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
