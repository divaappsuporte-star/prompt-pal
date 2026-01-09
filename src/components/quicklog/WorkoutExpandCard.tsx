import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Check, ChevronDown, ChevronUp, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";

interface WorkoutExpandCardProps {
  isCompleted: boolean;
  onClose: () => void;
}

const WorkoutExpandCard = ({ isCompleted, onClose }: WorkoutExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { todayCalories, progress } = useProgress();

  const currentDay = progress.workouts.unlockedDays?.[0] || 1;

  const handleStartWorkout = () => {
    onClose();
    navigate('/treino');
  };

  return (
    <motion.div
      className={`rounded-xl border transition-all overflow-hidden ${
        isCompleted 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-muted/50 border-border'
      }`}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3"
      >
        {/* Status Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-emerald-500' : 'bg-red-500/20'
        }`}>
          {isCompleted ? (
            <Check size={16} className="text-white" />
          ) : (
            <Dumbbell size={16} className="text-red-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-foreground'}`}>
            Treino
          </p>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? (
              `${todayCalories} kcal queimadas`
            ) : (
              `Dia ${currentDay} disponível`
            )}
          </p>
        </div>

        {/* Expand Icon */}
        {!isCompleted && (
          isExpanded ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )
        )}

        {isCompleted && (
          <span className="text-xs text-emerald-400 font-medium">✓ Feito</span>
        )}
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {/* Workout Info */}
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm font-medium text-foreground mb-1">
                  Treino do Dia {currentDay}
                </p>
                <p className="text-xs text-muted-foreground">
                  Circuito de 20 minutos • Alta intensidade
                </p>
              </div>

              {/* Start Workout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartWorkout}
                className="w-full py-2.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Play size={16} className="fill-current" />
                Iniciar Treino
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WorkoutExpandCard;