import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, Info, Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const settings = useLiveQuery(() => db.settings.get(1));
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language).toLowerCase().startsWith('pl')
    ? 'pl'
    : 'en';

  useEffect(() => {
    if ('Notification' in window) {
      if (settings !== undefined) {
        setNotificationsEnabled(
          Notification.permission === 'granted' && !!settings.notificationsEnabled
        );
      } else {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    }
  }, [settings?.notificationsEnabled]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleFrequencyChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value, 10);
    if (settings) {
      await db.settings.update(1, { notificationFrequency: val });
    } else {
      await db.settings.add({
        id: 1,
        notificationTime: '09:00', // Default value
        notificationFrequency: val,
        notificationsEnabled: false, // Default value
        theme: 'system', // Default value
        dailyGoalReps: 100, // Default value
        dailyGoalTime: 600, // Default value
        onboardingCompleted: false, // Default value
      });
    }
  };

  const handleTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (settings) {
      await db.settings.update(1, { notificationTime: val });
    } else {
      // Create a new settings record if it doesn't exist
      await db.settings.add({
        id: 1,
        notificationTime: val,
        notificationFrequency: 1, // Default value
        notificationsEnabled: false, // Default value
        theme: 'system', // Default value
        dailyGoalReps: 100, // Default value
        dailyGoalTime: 600, // Default value
        onboardingCompleted: false, // Default value
      });
    }
  };

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert(t('settings.alerts.notificationsNotSupported'));
      return;
    }

    if (Notification.permission === 'granted') {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      if (settings) {
        await db.settings.update(1, { notificationsEnabled: newValue });
      }
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        if (settings) {
          await db.settings.update(1, { notificationsEnabled: true });
        }
        new Notification('FitCounter', {
          body: t('settings.dailyNotificationsDesc'),
          icon: '/pwa-192x192.png',
        });
      }
    } else {
      alert(t('settings.alerts.notificationsBlocked'));
    }
  };

  const handleResetData = async () => {
    if (confirm(t('settings.resetDataDesc'))) {
      try {
        await db.delete();
        await db.open();
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset data:', error);
        alert(t('settings.alerts.resetFailed'));
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="size-6 text-primary" />
        </button>
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
          {t('settings.title')}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Reminders Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.reminders')}
          </h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-foreground text-base font-bold leading-tight">
                  {t('settings.dailyNotifications')}
                </p>
                <p className="text-muted-foreground text-sm font-normal leading-normal">
                  {t('settings.dailyNotificationsDesc')}
                </p>
              </div>
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-muted p-0.5 has-[:checked]:justify-end has-[:checked]:bg-primary transition-all">
                <div className="h-full w-[27px] rounded-full bg-white shadow-md" />
                <input
                  className="invisible absolute"
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                />
              </label>
            </div>

            <div
              className={cn(
                'relative flex w-full flex-col items-start justify-between gap-3 p-5 rounded-xl border border-primary/10 bg-card shadow-sm transition-opacity',
                !notificationsEnabled && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <p className="text-foreground text-base font-medium leading-normal">
                  {t('settings.reminderFrequency')}
                </p>
                <span className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded text-primary">
                  {settings?.notificationFrequency || 1}/day
                </span>
              </div>
              <div className="flex h-6 w-full items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={settings?.notificationFrequency || 1}
                  onChange={handleFrequencyChange}
                  className="w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="flex w-full justify-between text-[10px] text-muted-foreground font-medium">
                <span>{t('settings.frequency.min')}</span>
                <span>{t('settings.frequency.max')}</span>
              </div>
            </div>

            <div
              className={cn(
                'relative flex w-full items-center justify-between gap-3 p-5 rounded-xl border border-primary/10 bg-card shadow-sm transition-opacity',
                !notificationsEnabled && 'opacity-50 pointer-events-none'
              )}
            >
              <div className="flex flex-col gap-1">
                <p className="text-foreground text-base font-medium leading-normal">
                  {t('settings.reminderTime')}
                </p>
                <p className="text-muted-foreground text-xs font-normal leading-normal">
                  {t('settings.reminderTimeDesc')}
                </p>
              </div>
              <input
                type="time"
                value={settings?.notificationTime || '09:00'}
                onChange={handleTimeChange}
                className="p-2 rounded-lg bg-muted border-transparent focus:border-primary focus:ring-0 text-foreground font-bold"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.appearance')}
          </h3>
        </div>
        <div className="px-4 grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
              theme === 'light'
                ? 'bg-primary/5 border-primary'
                : 'border-transparent bg-card hover:bg-muted'
            )}
          >
            <div className="w-full aspect-video rounded bg-muted border border-border flex items-center justify-center">
              <Sun className="size-6 text-muted-foreground" />
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                theme === 'light' ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              {t('settings.light')}
            </span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
              theme === 'dark'
                ? 'bg-primary/5 border-primary'
                : 'border-transparent bg-card hover:bg-muted'
            )}
          >
            <div className="w-full aspect-video rounded bg-foreground border border-border flex items-center justify-center">
              <Moon className="size-6 text-background" />
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                theme === 'dark' ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              {t('settings.dark')}
            </span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
              theme === 'system'
                ? 'bg-primary/5 border-primary'
                : 'border-transparent bg-card hover:bg-muted'
            )}
          >
            <div className="w-full aspect-video rounded bg-muted border border-border flex overflow-hidden">
              <div className="flex-1 bg-muted flex items-center justify-center">
                <Sun className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 bg-foreground flex items-center justify-center">
                <Moon className="size-4 text-background" />
              </div>
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                theme === 'system' ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              {t('settings.system')}
            </span>
          </button>
        </div>

        {/* Language Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.language')}
          </h3>
        </div>
        <div className="px-4 space-y-2">
          <button
            onClick={() => changeLanguage('en')}
            className={cn(
              'flex w-full items-center justify-between p-4 rounded-xl border transition-all',
              activeLanguage === 'en'
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'border-primary/10 bg-card hover:bg-muted'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇺🇸</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  activeLanguage === 'en' ? 'font-bold text-foreground' : 'text-muted-foreground'
                )}
              >
                English
              </span>
            </div>
            {activeLanguage === 'en' && <div className="size-2 rounded-full bg-primary" />}
          </button>
          <button
            onClick={() => changeLanguage('pl')}
            className={cn(
              'flex w-full items-center justify-between p-4 rounded-xl border transition-all',
              activeLanguage === 'pl'
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'border-primary/10 bg-card hover:bg-muted'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🇵🇱</span>
              <span
                className={cn(
                  'text-sm font-medium',
                  activeLanguage === 'pl' ? 'font-bold text-foreground' : 'text-muted-foreground'
                )}
              >
                Polski
              </span>
            </div>
            {activeLanguage === 'pl' && <div className="size-2 rounded-full bg-primary" />}
          </button>
        </div>

        {/* About Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.about')}
          </h3>
        </div>
        <div className="px-4 space-y-2">
          <Link
            to="/privacy"
            className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-card hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-3">
              <Info className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t('settings.privacy')}</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <Link
            to="/terms"
            className="flex items-center justify-between p-4 rounded-xl border border-primary/10 bg-card hover:bg-muted transition-all"
          >
            <div className="flex items-center gap-3">
              <Info className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t('settings.terms')}</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="px-4 pt-8 pb-4">
          <button
            onClick={handleResetData}
            className="flex w-full items-center justify-center gap-2 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <Trash2 className="size-5" />
            {t('settings.resetData')}
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">
            FitCounter v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
