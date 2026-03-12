import Slider from '@react-native-community/slider';
import * as SQLite from 'expo-sqlite';
import { ChevronRight, Info, Monitor, Moon, Sun, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSettings, initDatabase, updateSettings } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await initDatabase();
        const data = await getSettings();
        setSettings(data);
        setNotificationsEnabled(data?.notificationsEnabled || false);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleFrequencyChange = async (value: number) => {
    const val = Math.round(value);
    if (settings) {
      await updateSettings({ notificationFrequency: val });
      setSettings({ ...settings, notificationFrequency: val });
    }
  };

  const handleTimeChange = async (text: string) => {
    if (settings) {
      await updateSettings({ notificationTime: text });
      setSettings({ ...settings, notificationTime: text });
    }
  };

  const handleNotificationToggle = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    if (settings) {
      await updateSettings({ notificationsEnabled: newValue });
    }
  };

  const handleResetData = async () => {
    Alert.alert(t('settings.resetData'), t('settings.resetDataDesc'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await SQLite.openDatabaseAsync('fitcounter.db');
            await db.execAsync(`
                DROP TABLE IF EXISTS exercises;
                DROP TABLE IF EXISTS logs;
                DROP TABLE IF EXISTS goals;
                DROP TABLE IF EXISTS settings;
              `);
            await initDatabase();
            const data = await getSettings();
            setSettings(data);
            setNotificationsEnabled(false);
            Alert.alert(t('common.success'), 'Data has been reset');
          } catch (error) {
            console.error('Failed to reset data:', error);
            Alert.alert(t('common.error'), 'Failed to reset data');
          }
        },
      },
    ]);
  };

  if (loading || !settings) {
    return (
      <View
        style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.reminders')}
      </Text>
      <View style={styles.section}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: `${colors.primary}1A` },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('settings.dailyNotifications')}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {t('settings.dailyNotificationsDesc')}
              </Text>
            </View>
            <View
              style={[styles.toggle, notificationsEnabled && { backgroundColor: colors.primary }]}
            >
              <View
                style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]}
              />
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="#FFFFFF"
                style={styles.switchOverlay}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: `${colors.primary}1A` },
            !notificationsEnabled && styles.disabled,
          ]}
        >
          <View style={styles.sliderCard}>
            <View style={styles.sliderHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('settings.reminderFrequency')}
              </Text>
              <View style={[styles.badge, { backgroundColor: `${colors.primary}1A` }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  {settings?.notificationFrequency || 1}/day
                </Text>
              </View>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={settings?.notificationFrequency || 1}
              onValueChange={handleFrequencyChange}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.muted}
              thumbTintColor={colors.primary}
              disabled={!notificationsEnabled}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>1 time</Text>
              <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>10 times</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: `${colors.primary}1A` },
            !notificationsEnabled && styles.disabled,
          ]}
        >
          <View style={styles.cardContent}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('settings.reminderTime')}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                {t('settings.reminderTimeDesc')}
              </Text>
            </View>
            <TextInput
              style={[styles.timeInput, { backgroundColor: colors.muted, color: colors.text }]}
              value={settings?.notificationTime || '09:00'}
              onChangeText={handleTimeChange}
              editable={notificationsEnabled}
              placeholder="09:00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.appearance')}
      </Text>
      <View style={styles.themeGrid}>
        <TouchableOpacity
          onPress={() => setTheme('light')}
          style={[
            styles.themeButton,
            {
              borderColor: theme === 'light' ? colors.primary : 'transparent',
              backgroundColor: colors.card,
            },
          ]}
        >
          <View
            style={[
              styles.themePreview,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <Sun size={24} color={colors.textSecondary} />
          </View>
          <Text
            style={[
              styles.themeLabel,
              { color: theme === 'light' ? colors.text : colors.textSecondary },
              theme === 'light' && { fontWeight: 'bold' },
            ]}
          >
            {t('settings.light')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTheme('dark')}
          style={[
            styles.themeButton,
            {
              borderColor: theme === 'dark' ? colors.primary : 'transparent',
              backgroundColor: colors.card,
            },
          ]}
        >
          <View
            style={[
              styles.themePreview,
              { backgroundColor: colors.text, borderColor: colors.border },
            ]}
          >
            <Moon size={24} color={colors.background} />
          </View>
          <Text
            style={[
              styles.themeLabel,
              { color: theme === 'dark' ? colors.text : colors.textSecondary },
              theme === 'dark' && { fontWeight: 'bold' },
            ]}
          >
            {t('settings.dark')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTheme('system')}
          style={[
            styles.themeButton,
            {
              borderColor: theme === 'system' ? colors.primary : 'transparent',
              backgroundColor: colors.card,
            },
          ]}
        >
          <View
            style={[
              styles.themePreview,
              styles.themePreviewGradient,
              { borderColor: colors.border },
            ]}
          >
            <Monitor size={24} color={colors.textSecondary} />
          </View>
          <Text
            style={[
              styles.themeLabel,
              { color: theme === 'system' ? colors.text : colors.textSecondary },
              theme === 'system' && { fontWeight: 'bold' },
            ]}
          >
            {t('settings.system')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.language')}
      </Text>
      <View style={styles.languageGrid}>
        <TouchableOpacity
          onPress={() => changeLanguage('en')}
          style={[
            styles.languageButton,
            {
              borderColor: i18n.language === 'en' ? colors.primary : 'transparent',
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={styles.languageIcon}>
            <Text style={styles.languageIconText}>EN</Text>
          </View>
          <Text
            style={[
              styles.languageLabel,
              { color: i18n.language === 'en' ? colors.text : colors.textSecondary },
              i18n.language === 'en' && { fontWeight: 'bold' },
            ]}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeLanguage('pl')}
          style={[
            styles.languageButton,
            {
              borderColor: i18n.language === 'pl' ? colors.primary : 'transparent',
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={[styles.languageIcon, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.languageIconText, { color: '#DC2626' }]}>PL</Text>
          </View>
          <Text
            style={[
              styles.languageLabel,
              { color: i18n.language === 'pl' ? colors.text : colors.textSecondary },
              i18n.language === 'pl' && { fontWeight: 'bold' },
            ]}
          >
            Polski
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.dataManagement')}
      </Text>
      <View style={styles.section}>
        <TouchableOpacity
          onPress={handleResetData}
          style={[styles.dangerCard, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}
        >
          <View style={styles.dangerContent}>
            <View style={styles.dangerIconContainer}>
              <Trash2 size={20} color="#DC2626" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.dangerTitle}>{t('settings.resetData')}</Text>
              <Text style={styles.dangerDescription}>{t('settings.resetDataDesc')}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('settings.about')}
      </Text>
      <View style={[styles.aboutCard, { backgroundColor: colors.primary }]}>
        <View style={styles.aboutContent}>
          <Text style={styles.aboutTitle}>FitCounter Pro</Text>
          <Text style={styles.aboutVersion}>{t('settings.version')} 2.4.1 (Build 402)</Text>
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
          <Info size={128} color="rgba(255, 255, 255, 0.2)" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sliderCard: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
  },
  toggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    padding: 2,
  },
  toggleThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  switchOverlay: {
    position: 'absolute',
    opacity: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 24,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  timeInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
  },
  themeGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  themeButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  themePreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themePreviewGradient: {
    backgroundColor: '#94A3B8',
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  languageGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  languageButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageIconText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dangerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  dangerDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  aboutCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  aboutContent: {
    zIndex: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  aboutVersion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  aboutLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  aboutLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aboutLinkText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  aboutIcon: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    opacity: 0.2,
  },
});
