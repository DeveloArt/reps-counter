import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/hooks/useTheme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Exercise',
          }}
        />
        <Stack.Screen
          name="log/[exerciseId]"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Log Entry',
          }}
        />
        <Stack.Screen
          name="goal/new"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'New Goal',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Settings',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
