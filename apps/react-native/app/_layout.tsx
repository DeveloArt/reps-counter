import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/hooks/useTheme';
import '../src/i18n';
import { useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
export default function RootLayout() {
  useEffect(() => {
    if(Platform.OS !== 'android') return;
    NavigationBar.setVisibilityAsync('hidden');
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if(nextAppState === 'active') {
        NavigationBar.setVisibilityAsync('hidden');
      }
    });
    return () => subscription.remove();
  }, []);
  return (
    <ThemeProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="exercise/new"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="log/[exerciseId]"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="goal/new"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="e2e-seed"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
