import { Home, BarChart2, Target, Settings, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  onAddClick: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: Home, label: t('nav.home'), path: '/app' },
    { icon: BarChart2, label: t('nav.stats'), path: '/app/stats' },
    { icon: Plus, label: t('nav.add'), path: '#', isFab: true, onClick: onAddClick },
    { icon: Target, label: t('nav.goals'), path: '/app/goals' },
    { icon: Settings, label: t('nav.settings'), path: '/app/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card/90 backdrop-blur-lg border-t border-border/60 flex items-center justify-around py-3 px-4 z-50 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        if (item.isFab) {
          return (
            <div key={item.label} className="relative -mt-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={item.onClick}
                className="bg-primary size-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 border-4 border-background active:scale-90 transition-transform"
              >
                <item.icon className="size-8" strokeWidth={2} />
              </motion.button>
            </div>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className={cn("size-6", isActive && "fill-current")} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
