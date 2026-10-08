import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CrystalBackground } from './src/components/CrystalBackground';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useBookingStore } from './src/store/useBookingStore';
import { colors } from './src/theme/colors';
import { ensureNotificationPermissions } from './src/utils/notifications';

export default function App() {
  const hydrated = useBookingStore((s) => s.hydrated);

  useEffect(() => {
    void ensureNotificationPermissions();

    const finish = () => useBookingStore.getState().setHydrated(true);
    const unsub = useBookingStore.persist.onFinishHydration(finish);
    if (useBookingStore.persist.hasHydrated()) {
      finish();
    }
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <CrystalBackground>
        <View style={styles.boot}>
          <ActivityIndicator size="large" color={colors.primary} />
          <StatusBar style="dark" />
        </View>
      </CrystalBackground>
    );
  }

  return (
    <SafeAreaProvider>
      <CrystalBackground>
        <StatusBar style="dark" />
        <AppNavigator />
      </CrystalBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
