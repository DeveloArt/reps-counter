import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useState } from 'react';
import { AddExerciseModal } from '@/components/features/AddExerciseModal';
import { QuickLogModal } from '@/components/features/QuickLogModal';
import { LogEntryModal } from '@/components/features/LogEntryModal';
import { type Exercise } from '@/db/db';

export function Layout() {
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const openAddExercise = () => setIsAddExerciseOpen(true);
  const openLogEntry = (exercise: Exercise) => setSelectedExercise(exercise);

  return (
    <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col bg-background overflow-x-hidden pb-24 shadow-2xl">
      <main className="flex-1">
        <Outlet context={{ openAddExercise, openLogEntry }} />
      </main>
      <BottomNav onAddClick={() => setIsQuickLogOpen(true)} />
      
      <AddExerciseModal 
        isOpen={isAddExerciseOpen} 
        onClose={() => setIsAddExerciseOpen(false)} 
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSelectExercise={(exercise) => {
          setSelectedExercise(exercise);
          setIsQuickLogOpen(false);
        }}
        onAddNew={() => {
          setIsAddExerciseOpen(true);
          setIsQuickLogOpen(false);
        }}
      />

      <LogEntryModal
        isOpen={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
        exercise={selectedExercise}
      />
    </div>
  );
}
