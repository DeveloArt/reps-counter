import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useState } from 'react';
import { AddExerciseModal } from '@/components/features/AddExerciseModal';
import { QuickLogModal } from '@/components/features/QuickLogModal';
import { LogEntryModal } from '@/components/features/LogEntryModal';
import { type Exercise } from '@/db/db';

import { CookieBanner } from '@/components/ui/CookieBanner';

export function Layout() {
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | undefined>();
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const openAddExercise = (exercise?: Exercise) => {
    setExerciseToEdit(exercise);
    setIsAddExerciseOpen(true);
  };
  const openLogEntry = (exercise: Exercise) => setSelectedExercise(exercise);

  return (
    <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col bg-background overflow-x-hidden pb-24 shadow-2xl">
      <main className="flex-1">
        <Outlet context={{ openAddExercise, openLogEntry }} />
      </main>
      
      <CookieBanner />

      <BottomNav onAddClick={() => setIsQuickLogOpen(true)} />
      
      <AddExerciseModal 
        isOpen={isAddExerciseOpen} 
        onClose={() => {
          setIsAddExerciseOpen(false);
          setExerciseToEdit(undefined);
        }} 
        exerciseToEdit={exerciseToEdit}
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSelectExercise={(exercise) => {
          setSelectedExercise(exercise);
          setIsQuickLogOpen(false);
        }}
        onAddNew={() => {
          setExerciseToEdit(undefined);
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
