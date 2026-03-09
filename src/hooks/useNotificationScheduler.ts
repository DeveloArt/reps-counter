import { useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import { useTranslation } from 'react-i18next';

export function useNotificationScheduler() {
  const settings = useLiveQuery(() => db.settings.get(1));
  const { t } = useTranslation();
  const lastNotifiedRef = useRef<number>(0);

  useEffect(() => {
    if (!settings?.notificationsEnabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkAndSendNotifications = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const [startHourStr, startMinuteStr] = (settings.notificationTime || '09:00').split(':');
      const startHour = parseInt(startHourStr, 10);
      const startMinute = parseInt(startMinuteStr, 10);

      const frequency = settings.notificationFrequency || 1;
      
      // Calculate notification times
      // We assume a 12-hour active window from the start time
      const activeWindowHours = 12;
      const intervalHours = frequency > 1 ? activeWindowHours / (frequency - 1) : 0;

      const notificationTimes = [];
      for (let i = 0; i < frequency; i++) {
        const h = Math.floor(startHour + i * intervalHours);
        const m = startMinute;
        notificationTimes.push({ hour: h % 24, minute: m });
      }

      // Check if current time matches any notification time
      const isTimeToNotify = notificationTimes.some(
        (time) => currentHour === time.hour && currentMinute === time.minute
      );

      if (isTimeToNotify) {
        // Prevent sending multiple notifications in the same minute
        const nowMs = now.getTime();
        if (nowMs - lastNotifiedRef.current > 60000) {
          new Notification('FitCounter', {
            body: t('settings.dailyNotificationsDesc'),
            icon: '/pwa-192x192.png',
          });
          lastNotifiedRef.current = nowMs;
        }
      }
    };

    // Check every minute
    const intervalId = setInterval(checkAndSendNotifications, 60000);
    
    // Initial check
    checkAndSendNotifications();

    return () => clearInterval(intervalId);
  }, [settings?.notificationsEnabled, settings?.notificationFrequency, settings?.notificationTime, t]);
}
