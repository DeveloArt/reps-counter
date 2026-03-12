import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  muted: string;
  success: string;
  warning: string;
  error: string;
}

const lightColors: ThemeColors = {
  primary: '#0D5D5D',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  muted: '#F1F5F9',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkColors: ThemeColors = {
  primary: '#14B8A6',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  muted: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
  theme: 'system',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setThemeState(newTheme);
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
