import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingScreen } from '../screens/BookingScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoomDetailScreen } from '../screens/RoomDetailScreen';
import { RoomsScreen } from '../screens/RoomsScreen';
import { colors } from '../theme/colors';
import { MainTabParamList, RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: colors.surfaceSolid,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: focused ? '800' : '600',
          color: focused ? colors.white : colors.textMuted,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  // Sit near the bottom edge; only a small gap so the iPhone home indicator
  // does not cover tab icons.
  const edgeGap = 6;
  const homePad = Math.max(insets.bottom - edgeGap, 0);
  const tabHeight = 54 + homePad + 6;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: edgeGap,
          height: tabHeight,
          borderRadius: 22,
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          paddingTop: 6,
          paddingBottom: homePad > 0 ? homePad : 8,
          elevation: 8,
          shadowColor: colors.shadow,
          shadowOpacity: 0.14,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
      }}
    >
      <Tab.Screen
        name="Rooms"
        component={RoomsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="⌂" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => <TabIcon label="▣" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="◎" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgba(255,255,255,0.92)',
          },
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontWeight: '700', color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomDetail"
          component={RoomDetailScreen}
          options={{ title: 'Room details' }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: 'Select time slot' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
});
