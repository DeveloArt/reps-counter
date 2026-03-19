import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Info, Monitor, Moon, Sun, Trash2 } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getSettings, resetDatabase, updateSettings } from '../db';
import { useTheme } from '../hooks/useTheme';
import type { UserSettings } from '../types';

type ThemeMode = 'light' | 'dark' | 'system';
const notificationFrequencyOptions = Array.from({ length: 10 }, (_, index) => index + 1);

function changeLanguage(i18n: { changeLanguage: (lng: string) => void }, lng: string) {
  i18n.changeLanguage(lng);
}

function ThemeOption({
  isSelected,
  label,
  onPress,
  preview,
  colors,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
  preview: ReactNode;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.themeCard,
        {
          backgroundColor: colors.card,
          borderColor: isSelected ? colors.primary : 'transparent',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {preview}
      <Text
        style={[
          styles.themeLabel,
          { color: isSelected ? colors.text : colors.textSecondary },
          isSelected && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function LanguageOption({
  active,
  badgeBackground,
  badgeColor,
  code,
  colors,
  label,
  onPress,
}: {
  active: boolean;
  badgeBackground: string;
  badgeColor: string;
  code: string;
  colors: ReturnType<typeof useTheme>['colors'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.languageCard,
        {
          backgroundColor: colors.card,
          borderColor: active ? colors.primary : 'transparent',
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.languageBadge, { backgroundColor: badgeBackground }]}>
        <Text style={[styles.languageBadgeText, { color: badgeColor }]}>{code}</Text>
      </View>
      <Text
        style={[
          styles.languageLabel,
          { color: active ? colors.text : colors.textSecondary },
          active && styles.selectedLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SettingsScreen({ showBackButton = false }: { showBackButton?: boolean }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language).toLowerCase().startsWith('pl')
    ? 'pl'
    : 'en';
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
        setNotificationsEnabled(Boolean(data?.notificationsEnabled));
        if (data?.theme) {
          setTheme(data.theme);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [setTheme]);

  const syncSettings = async (partial: Partial<UserSettings>) => {
    await updateSettings(partial);
    setSettings((current) => (current ? { ...current, ...partial } : current));
  };

  const handleNotificationToggle = async () => {
    const nextValue = !notificationsEnabled;
    setNotificationsEnabled(nextValue);
    await syncSettings({ notificationsEnabled: nextValue });
  };

  const handleFrequencyChange = async (value: number) => {
    await syncSettings({ notificationFrequency: Math.round(value) });
  };

  const handleTimeChange = async (value: string) => {
    await syncSettings({ notificationTime: value });
  };

  const handleThemeChange = async (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    await syncSettings({ theme: nextTheme });
  };

  const handleResetData = () => {
    Alert.alert(t('settings.resetData'), t('settings.resetDataDesc'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await resetDatabase();
            const data = await getSettings();
            setSettings(data);
            setNotificationsEnabled(Boolean(data?.notificationsEnabled));
            setTheme(data?.theme ?? 'system');
            Alert.alert(t('common.success'), t('settings.alerts.resetSuccess'));
          } catch (error) {
            console.error('Failed to reset data:', error);
            Alert.alert(t('common.error'), t('settings.alerts.resetFailed'));
          }
        },
      },
    ]);
  };

  if (loading || !settings) {
    return (
      <View style={[styles.container, styles.loadingState, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: `${colors.primary}1A`,
          },
        ]}
      >
        {showBackButton ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.headerButton,
              { backgroundColor: pressed ? colors.muted : 'transparent' },
            ]}
          >
            <ArrowLeft color={colors.primary} size={24} />
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.reminders')}
          </Text>

          <View
            style={[
              styles.card,
              styles.settingsRow,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.primary}1A`,
                shadowColor: colors.text,
              },
            ]}
          >
            <View style={styles.copyBlock}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>
                {t('settings.dailyNotifications')}
              </Text>
              <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                {t('settings.dailyNotificationsDesc')}
              </Text>
            </View>
            <Switch
              onValueChange={handleNotificationToggle}
              thumbColor="#FFFFFF"
              trackColor={{ false: colors.muted, true: colors.primary }}
              value={notificationsEnabled}
            />
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.primary}1A`,
                opacity: notificationsEnabled ? 1 : 0.5,
                shadowColor: colors.text,
              },
            ]}
          >
            <View style={styles.sliderCard}>
              <View style={styles.sliderHeader}>
                <Text style={[styles.rowSubtitle, { color: colors.text }]}>
                  {t('settings.reminderFrequency')}
                </Text>
                <Text
                  style={[
                    styles.frequencyBadge,
                    { backgroundColor: `${colors.primary}1A`, color: colors.primary },
                  ]}
                >
                  {settings.notificationFrequency || 1}/day
                </Text>
              </View>
              <View style={styles.frequencySelector}>
                {notificationFrequencyOptions.map((value) => {
                  const isSelected = (settings.notificationFrequency || 1) === value;

                  return (
                    <Pressable
                      disabled={!notificationsEnabled}
                      key={value}
                      onPress={() => handleFrequencyChange(value)}
                      style={({ pressed }) => [
                        styles.frequencyOption,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.muted,
                          borderColor: isSelected ? colors.primary : `${colors.primary}24`,
                          opacity: !notificationsEnabled ? 0.6 : pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.frequencyOptionLabel,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {value}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.sliderLabels}>
                <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
                  {t('settings.frequency.min')}
                </Text>
                <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
                  {t('settings.frequency.max')}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.card,
              styles.settingsRow,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.primary}1A`,
                opacity: notificationsEnabled ? 1 : 0.5,
                shadowColor: colors.text,
              },
            ]}
          >
            <View style={styles.copyBlock}>
              <Text style={[styles.rowSubtitle, { color: colors.text }]}>
                {t('settings.reminderTime')}
              </Text>
              <Text style={[styles.timeDescription, { color: colors.textSecondary }]}>
                {t('settings.reminderTimeDesc')}
              </Text>
            </View>
            <TextInput
              editable={notificationsEnabled}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              onChangeText={handleTimeChange}
              placeholder="09:00"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.timeInput,
                {
                  backgroundColor: colors.muted,
                  color: colors.text,
                },
              ]}
              value={settings.notificationTime || '09:00'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.appearance')}
          </Text>
          <View style={styles.themeGrid}>
            <ThemeOption
              colors={colors}
              isSelected={theme === 'light'}
              label={t('settings.light')}
              onPress={() => handleThemeChange('light')}
              preview={
                <View
                  style={[
                    styles.themePreview,
                    { backgroundColor: colors.muted, borderColor: colors.border },
                  ]}
                >
                  <Sun color={colors.textSecondary} size={24} />
                </View>
              }
            />
            <ThemeOption
              colors={colors}
              isSelected={theme === 'dark'}
              label={t('settings.dark')}
              onPress={() => handleThemeChange('dark')}
              preview={
                <View
                  style={[
                    styles.themePreview,
                    { backgroundColor: colors.text, borderColor: colors.border },
                  ]}
                >
                  <Moon color={colors.background} size={24} />
                </View>
              }
            />
            <ThemeOption
              colors={colors}
              isSelected={theme === 'system'}
              label={t('settings.system')}
              onPress={() => handleThemeChange('system')}
              preview={
                <View
                  style={[
                    styles.themePreview,
                    styles.systemPreview,
                    { borderColor: colors.border },
                  ]}
                >
                  <Monitor color={colors.textSecondary} size={24} />
                </View>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.language')}
          </Text>
          <View style={styles.languageGrid}>
            <LanguageOption
              active={activeLanguage === 'en'}
              badgeBackground="#DBEAFE"
              badgeColor="#2563EB"
              code="EN"
              colors={colors}
              label={t('settings.languages.english')}
              onPress={() => changeLanguage(i18n, 'en')}
            />
            <LanguageOption
              active={activeLanguage === 'pl'}
              badgeBackground="#FEE2E2"
              badgeColor="#DC2626"
              code="PL"
              colors={colors}
              label={t('settings.languages.polish')}
              onPress={() => changeLanguage(i18n, 'pl')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.dataManagement')}
          </Text>
          <Pressable
            onPress={handleResetData}
            style={({ pressed }) => [
              styles.dangerCard,
              {
                backgroundColor: `${colors.error}10`,
                borderColor: `${colors.error}33`,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <View style={styles.dangerMain}>
              <View style={[styles.dangerIcon, { backgroundColor: `${colors.error}1A` }]}>
                <Trash2 color={colors.error} size={20} />
              </View>
              <View style={styles.copyBlock}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {t('settings.resetData')}
                </Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  {t('settings.resetDataDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.about')}
          </Text>
          <View style={[styles.aboutCard, { backgroundColor: colors.primary }]}>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>{t('settings.productName')}</Text>
              <Text style={styles.aboutVersion}>
                {t('settings.version')} {appVersion}
              </Text>
              <View style={styles.aboutLinks}>
                <Pressable
                  onPress={() => router.push('/terms')}
                  style={({ pressed }) => [styles.aboutLink, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <Text style={styles.aboutLinkText}>{t('settings.terms')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/privacy')}
                  style={({ pressed }) => [styles.aboutLink, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <Text style={styles.aboutLinkText}>{t('settings.privacy')}</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.aboutIcon}>
              <Info color="rgba(255, 255, 255, 0.2)" size={128} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    rowGap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    padding: 20,
  },
  copyBlock: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  rowSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  rowDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  sliderCard: {
    padding: 20,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  frequencyBadge: {
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  frequencySelector: {
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  frequencyOption: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    minWidth: 40,
    paddingHorizontal: 12,
  },
  frequencyOptionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  sliderLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  timeDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  timeInput: {
    borderRadius: 10,
    fontSize: 15,
    fontWeight: '700',
    minWidth: 86,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: 'center',
  },
  themeGrid: {
    columnGap: 12,
    flexDirection: 'row',
  },
  themeCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    padding: 12,
  },
  themePreview: {
    alignItems: 'center',
    aspectRatio: 1.6,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  systemPreview: {
    backgroundColor: '#CBD5E1',
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedLabel: {
    fontWeight: '700',
  },
  languageGrid: {
    columnGap: 12,
    flexDirection: 'row',
  },
  languageCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  languageBadge: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  languageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  languageLabel: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  dangerCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dangerMain: {
    alignItems: 'center',
    columnGap: 12,
    flex: 1,
    flexDirection: 'row',
  },
  dangerIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  aboutCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 24,
    position: 'relative',
  },
  aboutContent: {
    rowGap: 4,
    zIndex: 1,
  },
  aboutTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  aboutVersion: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  aboutLinks: {
    columnGap: 12,
    flexDirection: 'row',
    marginTop: 12,
  },
  aboutLink: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  aboutLinkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  aboutIcon: {
    bottom: -16,
    opacity: 0.2,
    position: 'absolute',
    right: -16,
  },
});
