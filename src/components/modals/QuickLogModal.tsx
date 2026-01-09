import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useAllActivePlans } from "@/hooks/useAllActivePlans";
import {
  HydrationExpandCard,
  SleepExpandCard,
  MindsetExpandCard,
  MealsExpandCard,
  WorkoutExpandCard,
} from "@/components/quicklog";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DailyStatus = 'critical' | 'emerging' | 'elite';

const QuickLogModal = ({ isOpen, onClose }: QuickLogModalProps) => {
  const { profile } = useAuth();
  const { activePlans } = useAllActivePlans();
  const { 
    todayHydration, 
    todaySleep, 
    todayCalories,
    progress,
    checkMealTypeCompleted
  } = useProgress();

  const wantsExercise = (profile as any)?.wants_exercise ?? false;
  const waterGoal = profile?.water_goal_ml || 2000;
  const sleepGoal = profile?.sleep_goal_hours || 8;

  // Get first active plan
  const activePlanEntries = Object.entries(activePlans);
  const hasPlan = activePlanEntries.length > 0;
  const primaryDiet = hasPlan ? activePlanEntries[0][0] : null;

  // Map to progressService diet type
  const getProgressDiet = () => {
    if (!primaryDiet) return null;
    if (primaryDiet === 'metabolic') return 'lowcarb';
    return primaryDiet as 'carnivore' | 'lowcarb' | 'keto' | 'fasting' | 'detox';
  };

  const progressDiet = getProgressDiet();

  // Calculate task completion status
  const hydrationCompleted = todayHydration >= waterGoal;
  const sleepCompleted = todaySleep >= sleepGoal;
  const mindsetCompleted = progress.mindset.completedChapters.length > 0;
  const workoutCompleted = todayCalories > 0;
  
  // Check meals completion
  const mealsCompleted = progressDiet ? (
    checkMealTypeCompleted(progressDiet, 'breakfast') &&
    checkMealTypeCompleted(progressDiet, 'lunch') &&
    checkMealTypeCompleted(progressDiet, 'dinner')
  ) : false;

  // Calculate total tasks and completed
  const getTotalTasks = () => {
    let total = 3; // Hydration, Sleep, Mindset are always present
    if (hasPlan) total += 1; // Nutrition
    if (wantsExercise) total += 1; // Workout
    return total;
  };

  const getCompletedTasks = () => {
    let completed = 0;
    if (hydrationCompleted) completed++;
    if (sleepCompleted) completed++;
    if (mindsetCompleted) completed++;
    if (hasPlan && mealsCompleted) completed++;
    if (wantsExercise && workoutCompleted) completed++;
    return completed;
  };

  const totalTasks = getTotalTasks();
  const completedTasks = getCompletedTasks();

  const calculateStatus = (): DailyStatus => {
    const ratio = completedTasks / totalTasks;
    if (ratio >= 1) return 'elite';
    if (ratio >= 0.6) return 'emerging';
    return 'critical';
  };

  const getStatusInfo = () => {
    const status = calculateStatus();
    
    switch (status) {
      case 'elite':
        return { label: 'Elite', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50' };
      case 'emerging':
        return { label: 'Emergente', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50' };
      default:
        return { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    }
  };

  const statusInfo = getStatusInfo();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl border-t border-border overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Progresso de Hoje
              </h2>
              <p className="text-sm text-muted-foreground">
                Marque suas atividades
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <X size={20} className="text-foreground" />
            </motion.button>
          </div>

          {/* Status Badge */}
          <div className="px-4 py-3 flex-shrink-0">
            <div className={`flex items-center justify-between p-3 rounded-xl ${statusInfo.bg} border ${statusInfo.border}`}>
              <span className={`font-semibold ${statusInfo.color}`}>
                Status: {statusInfo.label}
              </span>
              <span className={`text-sm ${statusInfo.color}`}>
                {completedTasks}/{totalTasks} tarefas
              </span>
            </div>
          </div>

          {/* Expandable Cards */}
          <div className="px-4 pb-4 space-y-2 overflow-y-auto flex-1">
            {/* Fixed tasks - always visible */}
            <HydrationExpandCard isCompleted={hydrationCompleted} />
            <SleepExpandCard isCompleted={sleepCompleted} />
            <MindsetExpandCard isCompleted={mindsetCompleted} />

            {/* Nutrition - only if has active plan */}
            {hasPlan && (
              <MealsExpandCard isCompleted={mealsCompleted} />
            )}

            {/* Workout - only if wants exercise */}
            {wantsExercise && (
              <WorkoutExpandCard 
                isCompleted={workoutCompleted} 
                onClose={onClose}
              />
            )}
          </div>

          {/* Bottom Padding for safe area */}
          <div className="h-6 flex-shrink-0" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickLogModal;