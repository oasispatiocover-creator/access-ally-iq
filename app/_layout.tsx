import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/store';
import { useColors } from '../src/theme';

// Deep links into a detail screen still get the tabs underneath, so Back works.
export const unstable_settings = { anchor: '(tabs)' };

function Nav() {
  const c = useColors();
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.surface },
          headerTintColor: c.ink,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: c.bg },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
        <Stack.Screen name="staff" options={{ headerShown: false, presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="role" options={{ title: 'Who is this for?', presentation: 'modal' }} />
        <Stack.Screen name="state" options={{ title: 'Choose your state', presentation: 'modal' }} />
        <Stack.Screen name="search" options={{ title: 'Search everything' }} />
        <Stack.Screen name="place/[id]" options={{ title: '' }} />
        <Stack.Screen name="guide/[id]" options={{ title: '' }} />
        <Stack.Screen name="profile" options={{ title: 'Dog profile' }} />
        <Stack.Screen name="log" options={{ title: 'Incident log' }} />
        <Stack.Screen name="letter" options={{ title: 'Write a complaint' }} />
        <Stack.Screen name="request/[kind]" options={{ title: '' }} />
        <Stack.Screen name="quiz" options={{ title: 'Staff quiz' }} />
        <Stack.Screen name="policy" options={{ title: 'Sample policy' }} />
        <Stack.Screen name="signs" options={{ title: 'Sign wording' }} />
        <Stack.Screen name="foodcode" options={{ title: 'Restaurants' }} />
        <Stack.Screen name="poster" options={{ title: 'QR door poster' }} />
        <Stack.Screen name="directory" options={{ title: 'Business directory' }} />
        <Stack.Screen name="help" options={{ title: 'Free help' }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
        <Stack.Screen name="about" options={{ title: 'About this information' }} />
        <Stack.Screen name="report" options={{ title: 'Report a problem', presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Nav />
      </AppProvider>
    </SafeAreaProvider>
  );
}
