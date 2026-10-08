import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../store/useBookingStore';
import { colors } from '../theme/colors';
import { ensureNotificationPermissions } from '../utils/notifications';

export function ProfileScreen() {
  const user = useBookingStore((s) => s.user);
  const setUser = useBookingStore((s) => s.setUser);
  const bookings = useBookingStore((s) => s.bookings);
  const [name, setName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [email, setEmail] = useState(user.email);
  const [permissionNote, setPermissionNote] = useState('');

  const save = () => {
    setUser({ name: name.trim(), studentId: studentId.trim(), email: email.trim() });
  };

  const enableNotifications = async () => {
    const granted = await ensureNotificationPermissions();
    setPermissionNote(
      granted
        ? 'Notifications enabled. You will get a reminder 15 minutes before each booking.'
        : 'Permission denied. Enable notifications in system settings.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Session managed by Zustand + AsyncStorage.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={studentId}
          onChangeText={setStudentId}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable style={styles.button} onPress={save}>
          <Text style={styles.buttonText}>Save session</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.statLabel}>Total bookings stored</Text>
        <Text style={styles.statValue}>{bookings.length}</Text>

        <Pressable style={styles.secondary} onPress={enableNotifications}>
          <Text style={styles.secondaryText}>Enable local reminders</Text>
        </Pressable>
        {permissionNote ? <Text style={styles.note}>{permissionNote}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
    gap: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.primaryLight,
  },
  button: {
    marginTop: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  secondary: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '700',
  },
  note: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
