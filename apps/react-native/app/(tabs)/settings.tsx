import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getSettings, initDatabase, updateSettings } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const data = await getSettings();
      setSettings(data);
      setNotifications(data?.notificationsEnabled || false);
    }
    loadData();
  }, []);

  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    if (settings) {
      await updateSettings({ notificationsEnabled: newValue });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
            {isDark ? 'On' : 'Off'}
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Enable Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
        {settings?.notificationTime && (
          <View style={[styles.row, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Notification Time</Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              {settings.notificationTime}
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Goals</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Daily Rep Goal</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
            {settings?.dailyGoalReps || 100}
          </Text>
        </View>
        <View style={[styles.row, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Daily Time Goal</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
            {settings?.dailyGoalTime ? Math.floor(settings.dailyGoalTime / 60) : 10} min
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Version</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>1.0.0</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowLabel: {
    fontSize: 16,
  },
  rowValue: {
    fontSize: 16,
  },
});
