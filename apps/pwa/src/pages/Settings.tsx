import { db } from '@fitcounter/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ChevronRight, Info, Monitor, Moon, Sun, Trash2 } from 'lucide-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const settings = useLiveQuery(() => db.settings.get(1));

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
    }
  };

  const handleTimeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (settings) {
      await db.settings.update(1, { notificationTime: val });
    }
  };

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
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
      alert('Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  const handleResetData = async () => {
    if (confirm(t('settings.resetDataDesc') || 'Are you sure? This action is permanent.')) {
      try {
        await db.delete();
        await db.open();
        window.location.reload();
      } catch (error) {
        console.error('Failed to reset data:', error);
        alert('Failed to reset data');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors">
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
                <span>1 time</span>
                <span>10 times</span>
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
            <div className="w-full aspect-video rounded bg-gradient-to-br from-muted to-foreground border border-border flex items-center justify-center">
              <Monitor className="size-6 text-muted-foreground mix-blend-difference" />
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
        <div className="px-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => changeLanguage('en')}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
              i18n.language === 'en'
                ? 'bg-primary/5 border-primary'
                : 'border-transparent bg-card hover:bg-muted'
            )}
          >
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              EN
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                i18n.language === 'en' ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              English
            </span>
          </button>
          <button
            onClick={() => changeLanguage('pl')}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
              i18n.language === 'pl'
                ? 'bg-primary/5 border-primary'
                : 'border-transparent bg-card hover:bg-muted'
            )}
          >
            <div className="size-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
              PL
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                i18n.language === 'pl' ? 'font-bold text-foreground' : 'text-muted-foreground'
              )}
            >
              Polski
            </span>
          </button>
        </div>

        {/* Data Management Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.dataManagement')}
          </h3>
        </div>
        <div className="px-4 flex flex-col gap-3">
          <button
            onClick={handleResetData}
            className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
                <Trash2 className="size-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base font-bold text-foreground">
                  {t('settings.resetData')}
                </span>
                <span className="text-xs text-muted-foreground">{t('settings.resetDataDesc')}</span>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* About Section */}
        <div className="px-4 pt-8 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">
            {t('settings.about')}
          </h3>
        </div>
        <div className="mx-4 mb-8 p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h4 className="text-lg font-bold">FitCounter Pro</h4>
            <p className="text-sm opacity-90 mt-1">{t('settings.version')} 2.4.1 (Build 402)</p>
            <div className="mt-4 flex gap-3">
              <Link
                to="/app/terms"
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
              >
                {t('settings.terms')}
              </Link>
              <Link
                to="/app/privacy"
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors"
              >
                {t('settings.privacy')}
              </Link>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Info className="size-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
