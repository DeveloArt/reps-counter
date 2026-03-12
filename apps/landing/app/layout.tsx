import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FitCounter - Track Your Micro-Workouts',
  description: 'Track your daily exercises and build healthy habits with FitCounter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
