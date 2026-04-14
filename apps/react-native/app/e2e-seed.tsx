import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { seedE2EMockData } from '../src/db';
import { useTheme } from '../src/hooks/useTheme';

export default function E2ESeedScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    async function seedAndNavigate() {
      await seedE2EMockData();
      router.replace('/(tabs)');
    }

    seedAndNavigate();
  }, [router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="e2e-seed-screen">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.text }]}>Seeding test data...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
