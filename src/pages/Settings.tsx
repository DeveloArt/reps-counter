import { ArrowLeft, Sun, Moon, Monitor, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      };

      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background/80 backdrop-blur-md p-4 border-b border-primary/10">
        <button className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="size-6 text-primary" />
        </button>
        <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight flex-1 ml-2">{t('settings.title')}</h2>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Reminders Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">{t('settings.reminders')}</h3>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-1 items-center justify-between gap-4 rounded-xl border border-primary/10 bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-1">
                <p className="text-foreground text-base font-bold leading-tight">{t('settings.dailyNotifications')}</p>
                <p className="text-muted-foreground text-sm font-normal leading-normal">{t('settings.dailyNotificationsDesc')}</p>
              </div>
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-muted p-0.5 has-[:checked]:justify-end has-[:checked]:bg-primary transition-all">
                <div className="h-full w-[27px] rounded-full bg-white shadow-md"></div>
                <input defaultChecked className="invisible absolute" type="checkbox" />
              </label>
            </div>
            
            <div className="relative flex w-full flex-col items-start justify-between gap-3 p-5 rounded-xl border border-primary/10 bg-card shadow-sm">
              <div className="flex w-full items-center justify-between">
                <p className="text-foreground text-base font-medium leading-normal">{t('settings.reminderFrequency')}</p>
                <span className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded text-primary">3/day</span>
              </div>
              <div className="flex h-6 w-full items-center gap-4">
                <div className="flex h-1.5 flex-1 rounded-full bg-muted">
                  <div className="h-full w-[45%] rounded-full bg-primary relative">
                    <div className="absolute -right-2 -top-1.5 size-4.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-primary shadow-sm"></div>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-between text-[10px] text-muted-foreground font-medium">
                <span>1 time</span>
                <span>10 times</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">{t('settings.appearance')}</h3>
        </div>
        <div className="px-4 grid grid-cols-3 gap-3">
          <button 
            onClick={() => setTheme('light')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
              theme === 'light' ? "bg-primary/5 border-primary" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <div className="w-full aspect-video rounded bg-muted border border-border flex items-center justify-center">
              <Sun className="size-6 text-muted-foreground" />
            </div>
            <span className={cn("text-xs font-medium", theme === 'light' ? "font-bold text-foreground" : "text-muted-foreground")}>{t('settings.light')}</span>
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
              theme === 'dark' ? "bg-primary/5 border-primary" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <div className="w-full aspect-video rounded bg-foreground border border-border flex items-center justify-center">
              <Moon className="size-6 text-background" />
            </div>
            <span className={cn("text-xs font-medium", theme === 'dark' ? "font-bold text-foreground" : "text-muted-foreground")}>{t('settings.dark')}</span>
          </button>
          <button 
            onClick={() => setTheme('system')}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
              theme === 'system' ? "bg-primary/5 border-primary" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <div className="w-full aspect-video rounded bg-gradient-to-br from-muted to-foreground border border-border flex items-center justify-center">
              <Monitor className="size-6 text-muted-foreground mix-blend-difference" />
            </div>
            <span className={cn("text-xs font-medium", theme === 'system' ? "font-bold text-foreground" : "text-muted-foreground")}>{t('settings.system')}</span>
          </button>
        </div>

        {/* Language Section */}
        <div className="px-4 pt-6 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">{t('settings.language')}</h3>
        </div>
        <div className="px-4 grid grid-cols-2 gap-3">
          <button 
            onClick={() => changeLanguage('en')}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
              i18n.language === 'en' ? "bg-primary/5 border-primary" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">EN</div>
            <span className={cn("text-sm font-medium", i18n.language === 'en' ? "font-bold text-foreground" : "text-muted-foreground")}>English</span>
          </button>
          <button 
            onClick={() => changeLanguage('pl')}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
              i18n.language === 'pl' ? "bg-primary/5 border-primary" : "border-transparent bg-card hover:bg-muted"
            )}
          >
            <div className="size-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">PL</div>
            <span className={cn("text-sm font-medium", i18n.language === 'pl' ? "font-bold text-foreground" : "text-muted-foreground")}>Polski</span>
          </button>
        </div>

        {/* About Section */}
        <div className="px-4 pt-8 pb-2">
          <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider opacity-60">{t('settings.about')}</h3>
        </div>
        <div className="mx-4 mb-8 p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h4 className="text-lg font-bold">FitCounter Pro</h4>
            <p className="text-sm opacity-90 mt-1">{t('settings.version')} 2.4.1 (Build 402)</p>
            <div className="mt-4 flex gap-3">
              <Link to="/terms" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">{t('settings.terms')}</Link>
              <Link to="/privacy" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-colors">{t('settings.privacy')}</Link>
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
