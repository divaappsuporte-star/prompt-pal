import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Droplets, Dumbbell, Apple, Moon, Brain, Check, Plus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DailyTasks {
  workout: boolean;
  nutrition: boolean;
  hydration: boolean;
  sleep: boolean;
  mindset: boolean;
}

type DailyStatus = 'critical' | 'emerging' | 'elite';

const QuickLogModal = ({ isOpen, onClose }: QuickLogModalProps) => {
  const navigate = useNavigate();
  const { 
    todayHydration, 
    todaySleep, 
    todayCalories,
    progress,
    addWaterIntake,
    addSleepTime 
  } = useProgress();

  const [tasks, setTasks] = useState<DailyTasks>({
    workout: false,
    nutrition: false,
    hydration: false,
    sleep: false,
    mindset: false,
  });

  // Calculate task status from progress data
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    
    // Check workout - if any calories burned today
    const workoutDone = todayCalories > 0;
    
    // Check nutrition - if any recipe completed today
    const nutritionDone = Object.values(progress.nutrition).some(diet => 
      diet.completedRecipes.some(r => r.endsWith(`_${today}`))
    );
    
    // Check hydration - if >= 2000ml
    const hydrationDone = todayHydration >= 2000;
    
    // Check sleep - if >= 7 hours
    const sleepDone = todaySleep >= 7;
    
    // Check mindset - if any chapter completed
    const mindsetDone = progress.mindset.completedChapters.length > 0;

    setTasks({
      workout: workoutDone,
      nutrition: nutritionDone,
      hydration: hydrationDone,
      sleep: sleepDone,
      mindset: mindsetDone,
    });
  }, [todayHydration, todaySleep, todayCalories, progress]);

  const calculateStatus = (): DailyStatus => {
    const completed = Object.values(tasks).filter(Boolean).length;
    if (completed === 5) return 'elite';
    if (completed >= 3) return 'emerging';
    return 'critical';
  };

  const getStatusInfo = () => {
    const status = calculateStatus();
    const completed = Object.values(tasks).filter(Boolean).length;
    
    switch (status) {
      case 'elite':
        return { label: 'Elite', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/50' };
      case 'emerging':
        return { label: 'Emergente', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/50' };
      default:
        return { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    }
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleQuickWater = () => {
    addWaterIntake(250);
  };

  const handleQuickSleep = (hours: number) => {
    addSleepTime(hours);
  };

  const statusInfo = getStatusInfo();
  const completedCount = Object.values(tasks).filter(Boolean).length;

  const taskItems = [
    {
      key: 'workout',
      icon: Dumbbell,
      label: 'Treino',
      detail: tasks.workout ? `${todayCalories} kcal queimadas` : 'Não treinou hoje',
      done: tasks.workout,
      action: () => handleNavigate('/treino'),
      quickAction: null,
    },
    {
      key: 'nutrition',
      icon: Apple,
      label: 'Nutrição',
      detail: tasks.nutrition ? 'Receita concluída' : 'Nenhuma refeição registrada',
      done: tasks.nutrition,
      action: () => handleNavigate('/nutricao'),
      quickAction: null,
    },
    {
      key: 'hydration',
      icon: Droplets,
      label: 'Hidratação',
      detail: `${(todayHydration / 1000).toFixed(1)}L / 2L`,
      done: tasks.hydration,
      action: null,
      quickAction: { label: '+250ml', onClick: handleQuickWater },
    },
    {
      key: 'sleep',
      icon: Moon,
      label: 'Sono',
      detail: todaySleep > 0 ? `${todaySleep}h dormidas` : 'Não registrado',
      done: tasks.sleep,
      action: null,
      quickAction: todaySleep === 0 ? { label: '+7h', onClick: () => handleQuickSleep(7) } : null,
    },
    {
      key: 'mindset',
      icon: Brain,
      label: 'Mentalidade',
      detail: tasks.mindset ? `${progress.mindset.completedChapters.length} capítulos` : 'Nenhuma leitura',
      done: tasks.mindset,
      action: () => handleNavigate('/mentalidade'),
      quickAction: null,
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl border-t border-border overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Progresso de Hoje
              </h2>
              <p className="text-sm text-muted-foreground">
                Registre suas atividades
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
          <div className="px-4 py-3">
            <div className={`flex items-center justify-between p-3 rounded-xl ${statusInfo.bg} border ${statusInfo.border}`}>
              <span className={`font-semibold ${statusInfo.color}`}>
                Status: {statusInfo.label}
              </span>
              <span className={`text-sm ${statusInfo.color}`}>
                {completedCount}/5 tarefas
              </span>
            </div>
          </div>

          {/* Task List */}
          <div className="px-4 pb-4 space-y-2">
            {taskItems.map((task) => {
              const Icon = task.icon;
              return (
                <motion.div
                  key={task.key}
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    task.done 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  {/* Status Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    task.done ? 'bg-emerald-500' : 'bg-muted'
                  }`}>
                    {task.done ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <Icon size={16} className="text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className={`font-medium ${task.done ? 'text-emerald-400' : 'text-foreground'}`}>
                      {task.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.detail}
                    </p>
                  </div>

                  {/* Actions */}
                  {!task.done && task.quickAction && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={task.quickAction.onClick}
                      className="px-3 py-1.5 rounded-lg bg-coral/20 text-coral text-xs font-medium flex items-center gap-1"
                    >
                      <Plus size={12} />
                      {task.quickAction.label}
                    </motion.button>
                  )}

                  {!task.done && task.action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={task.action}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                    >
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </motion.button>
                  )}

                  {task.done && (
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ Feito
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Padding for safe area */}
          <div className="h-6" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickLogModal;
