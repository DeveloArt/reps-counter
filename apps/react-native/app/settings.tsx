import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Moon, Sun, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getSettings, initDatabase, updateSettings } from '../src/db';
import { useTheme } from '../src/hooks/useTheme';
import type { UserSettings } from '../src/types';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsModalScreen() {
  const { colors, theme: currentTheme, setTheme } = useTheme();
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [notifications, setNotifications] = useState(false);
  const [notificationFrequency, setNotificationFrequency] = useState(1);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const data = await getSettings();
      setSettings(data);
      setNotifications(data?.notificationsEnabled || false);
      setNotificationFrequency(data?.notificationFrequency || 1);
      setNotificationTime(data?.notificationTime || '09:00');
      setSelectedTheme((data?.theme as ThemeMode) || 'system');
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

  const handleFrequencyChange = async (freq: number) => {
    setNotificationFrequency(freq);
    await updateSettings({ notificationFrequency: freq });
  };

  const _handleTimeChange = async (time: string) => {
    setNotificationTime(time);
    await updateSettings({ notificationTime: time });
  };

  const handleThemeChange = async (theme: ThemeMode) => {
    setSelectedTheme(theme);
    setTheme(theme);
    await updateSettings({ theme });
  };

  const handleResetData = () => {
    Alert.alert('Reset Data', 'Are you sure? This action is permanent.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('Success', 'Data has been reset. Please restart the app.');
          } catch (_error) {
            Alert.alert('Error', 'Failed to reset data');
          }
        },
      },
    ]);
  };

  const frequencyOptions = [1, 2, 3, 5, 7, 10];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Reminders</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Daily Notifications</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  Get reminded to workout daily
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>

            {/* Frequency Slider */}
            <View
              style={[
                styles.subRow,
                { borderTopColor: colors.border, opacity: notifications ? 1 : 0.5 },
              ]}
            >
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Reminder Frequency</Text>
                <Text
                  style={[
                    styles.frequencyBadge,
                    { backgroundColor: `${colors.primary}20`, color: colors.primary },
                  ]}
                >
                  {notificationFrequency}/day
                </Text>
              </View>
            </View>
            {notifications && (
              <View style={styles.frequencyOptions}>
                {frequencyOptions.map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      {
                        backgroundColor:
                          notificationFrequency === freq ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => handleFrequencyChange(freq)}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        { color: notificationFrequency === freq ? 'white' : colors.text },
                      ]}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Time Picker */}
            <View
              style={[
                styles.subRow,
                { borderTopColor: colors.border, opacity: notifications ? 1 : 0.5 },
              ]}
            >
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Reminder Time</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  When to receive reminders
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.timeButton, { backgroundColor: colors.border }]}
                disabled={!notifications}
              >
                <Text style={[styles.timeButtonText, { color: colors.text }]}>
                  {notificationTime}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
          <View style={styles.themeGrid}>
            {/* Light Theme */}
            <TouchableOpacity
              style={[
                styles.themeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selectedTheme === 'light' ? colors.primary : colors.border,
                  borderWidth: selectedTheme === 'light' ? 2 : 1,
                },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: '#f5f5f5', borderColor: colors.border },
                ]}
              >
                <Sun size={24} color="#666" />
              </View>
              <Text
                style={[
                  styles.themeLabel,
                  { color: selectedTheme === 'light' ? colors.text : colors.textSecondary },
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>

            {/* Dark Theme */}
            <TouchableOpacity
              style={[
                styles.themeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selectedTheme === 'dark' ? colors.primary : colors.border,
                  borderWidth: selectedTheme === 'dark' ? 2 : 1,
                },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: '#1a1a1a', borderColor: colors.border },
                ]}
              >
                <Moon size={24} color="#fff" />
              </View>
              <Text
                style={[
                  styles.themeLabel,
                  { color: selectedTheme === 'dark' ? colors.text : colors.textSecondary },
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>

            {/* System Theme */}
            <TouchableOpacity
              style={[
                styles.themeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selectedTheme === 'system' ? colors.primary : colors.border,
                  borderWidth: selectedTheme === 'system' ? 2 : 1,
                },
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <View
                style={[
                  styles.themePreview,
                  {
                    backgroundColor: colors.border,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <Sun size={16} color="#666" />
                  <Moon size={16} color="#fff" />
                </View>
              </View>
              <Text
                style={[
                  styles.themeLabel,
                  { color: selectedTheme === 'system' ? colors.text : colors.textSecondary },
                ]}
              >
                System
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Data Management
          </Text>
          <TouchableOpacity
            style={[
              styles.dataButton,
              { backgroundColor: `${colors.error}10`, borderColor: `${colors.error}30` },
            ]}
            onPress={handleResetData}
          >
            <View style={[styles.dataIcon, { backgroundColor: `${colors.error}20` }]}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.dataContent}>
              <Text style={[styles.dataLabel, { color: colors.text }]}>Reset Data</Text>
              <Text style={[styles.dataDescription, { color: colors.textSecondary }]}>
                Delete all exercises, logs, and goals
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
          <View style={[styles.aboutCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.aboutTitle}>FitCounter Pro</Text>
            <Text style={styles.aboutVersion}>Version 2.4.1 (Build 402)</Text>
            <View style={styles.aboutLinks}>
              <TouchableOpacity style={styles.aboutLink}>
                <Text style={styles.aboutLinkText}>Terms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.aboutLink}>
                <Text style={styles.aboutLinkText}>Privacy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  frequencyBadge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  themeCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  themePreview: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataContent: {
    flex: 1,
    marginLeft: 12,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  dataDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  aboutVersion: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 4,
  },
  aboutLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  aboutLink: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aboutLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacer: {
    height: 32,
  },
});
