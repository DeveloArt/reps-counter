import { Tabs } from 'expo-router';
import { ChartBar, House, Plus, Settings, Target } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { QuickLogModal } from '../../src/components/QuickLogModal';
import { useTheme } from '../../src/hooks/useTheme';

function FabButton({ color, onPress }: { color: string; onPress: () => void }) {
  return (
    <View style={styles.fabContainer}>
      <View style={[styles.fab, { backgroundColor: color }]} onTouchEnd={onPress}>
        <Plus size={32} color="white" strokeWidth={2.5} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            height: 85,
            paddingBottom: 25,
            paddingTop: 10,
          },
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerTitle: 'FitCounter',
            tabBarIcon: ({ color, size }) => <House size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size }) => <ChartBar size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: () => (
              <FabButton color={colors.primary} onPress={() => setIsQuickLogOpen(true)} />
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, size }) => <Target size={size} color={color} strokeWidth={2} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} strokeWidth={2} />,
          }}
        />
      </Tabs>

      <QuickLogModal isOpen={isQuickLogOpen} onClose={() => setIsQuickLogOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    top: -25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'white',
  },
});
