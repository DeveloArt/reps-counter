import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/hooks/useTheme';
import '../src/i18n';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
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
      </Stack>
    </ThemeProvider>
  );
}
