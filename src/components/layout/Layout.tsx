import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col bg-background overflow-x-hidden pb-24 shadow-2xl">
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
