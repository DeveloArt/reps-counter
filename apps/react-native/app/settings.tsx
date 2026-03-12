import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Info, Monitor, Moon, Sun, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { getSettings, initDatabase, updateSettings } from '../src/db';
import { useTheme } from '../src/hooks/useTheme';
import type { UserSettings } from '../src/types';
import '../src/i18n';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsModalScreen() {
  const { t, i18n } = useTranslation();
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

  const handleFrequencyChange = async (value: number) => {
    const freq = Math.round(value);
    setNotificationFrequency(freq);
    await updateSettings({ notificationFrequency: freq });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
    Alert.alert(t('settings.resetData'), t('settings.resetDataDesc'), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert(t('common.success'), 'Data has been reset. Please restart the app.');
          } catch (_error) {
            Alert.alert(t('common.error'), 'Failed to reset data');
          }
        },
      },
    ]);
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reminders Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.reminders')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {t('settings.dailyNotifications')}
                </Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  {t('settings.dailyNotificationsDesc')}
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
                styles.sliderContainer,
                { borderTopColor: colors.border, opacity: notifications ? 1 : 0.5 },
              ]}
            >
              <View style={styles.sliderHeader}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {t('settings.reminderFrequency')}
                </Text>
                <Text
                  style={[
                    styles.frequencyBadge,
                    { backgroundColor: `${colors.primary}20`, color: colors.primary },
                  ]}
                >
                  {notificationFrequency}/day
                </Text>
              </View>
              {notifications && (
                <>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={notificationFrequency}
                    onValueChange={handleFrequencyChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.border}
                    thumbTintColor={colors.primary}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>1 time</Text>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>10 times</Text>
                  </View>
                </>
              )}
            </View>

            {/* Time Picker */}
            <View
              style={[
                styles.subRow,
                { borderTopColor: colors.border, opacity: notifications ? 1 : 0.5 },
              ]}
            >
              <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  {t('settings.reminderTime')}
                </Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  {t('settings.reminderTimeDesc')}
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
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.appearance')}
          </Text>
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
                {t('settings.light')}
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
                {t('settings.dark')}
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
                <Monitor size={24} color={colors.textSecondary} />
              </View>
              <Text
                style={[
                  styles.themeLabel,
                  { color: selectedTheme === 'system' ? colors.text : colors.textSecondary },
                ]}
              >
                {t('settings.system')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.language')}
          </Text>
          <View style={styles.languageGrid}>
            <TouchableOpacity
              style={[
                styles.languageCard,
                {
                  backgroundColor: colors.card,
                  borderColor: i18n.language === 'en' ? colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => changeLanguage('en')}
            >
              <View style={[styles.languageIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text style={[styles.languageIconText, { color: '#2563EB' }]}>EN</Text>
              </View>
              <Text
                style={[
                  styles.languageLabel,
                  { color: i18n.language === 'en' ? colors.text : colors.textSecondary },
                  i18n.language === 'en' && styles.languageLabelBold,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageCard,
                {
                  backgroundColor: colors.card,
                  borderColor: i18n.language === 'pl' ? colors.primary : 'transparent',
                  borderWidth: 2,
                },
              ]}
              onPress={() => changeLanguage('pl')}
            >
              <View style={[styles.languageIcon, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.languageIconText, { color: '#DC2626' }]}>PL</Text>
              </View>
              <Text
                style={[
                  styles.languageLabel,
                  { color: i18n.language === 'pl' ? colors.text : colors.textSecondary },
                  i18n.language === 'pl' && styles.languageLabelBold,
                ]}
              >
                Polski
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.dataManagement')}
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
              <Text style={[styles.dataLabel, { color: colors.text }]}>
                {t('settings.resetData')}
              </Text>
              <Text style={[styles.dataDescription, { color: colors.textSecondary }]}>
                {t('settings.resetDataDesc')}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.about')}
          </Text>
          <View style={[styles.aboutCard, { backgroundColor: colors.primary }]}>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>FitCounter Pro</Text>
              <Text style={styles.aboutVersion}>
                {t('settings.version')} 2.4.1 (Build 402)
              </Text>
              <View style={styles.aboutLinks}>
                <TouchableOpacity style={styles.aboutLink}>
                  <Text style={styles.aboutLinkText}>{t('settings.terms')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aboutLink}>
                  <Text style={styles.aboutLinkText}>{t('settings.privacy')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.aboutIcon}>
              <Info size={128} color="rgba(255,255,255,0.2)" />
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
    alignSelf: 'flex-start',
  },
  sliderContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 10,
    fontWeight: '600',
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
  languageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  languageCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  languageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageIconText: {
    fontSize: 12,
    fontWeight: '700',
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageLabelBold: {
    fontWeight: '700',
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
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  aboutContent: {
    position: 'relative',
    zIndex: 10,
  },
  aboutIcon: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    opacity: 0.2,
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
