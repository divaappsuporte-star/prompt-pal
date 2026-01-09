import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Check, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";

interface HydrationExpandCardProps {
  isCompleted: boolean;
}

const HydrationExpandCard = ({ isCompleted }: HydrationExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { todayHydration, addWaterIntake } = useProgress();
  const { profile } = useAuth();

  const waterGoal = profile?.water_goal_ml || 2000;
  const progressPercent = Math.min((todayHydration / waterGoal) * 100, 100);

  const waterOptions = [
    { label: "+250ml", value: 250 },
    { label: "+500ml", value: 500 },
    { label: "+750ml", value: 750 },
    { label: "+1L", value: 1000 },
  ];

  const handleAddWater = (ml: number) => {
    addWaterIntake(ml);
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
          isCompleted ? 'bg-emerald-500' : 'bg-cyan-500/20'
        }`}>
          {isCompleted ? (
            <Check size={16} className="text-white" />
          ) : (
            <Droplets size={16} className="text-cyan-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-foreground'}`}>
            Hidratação
          </p>
          <p className="text-xs text-muted-foreground">
            {(todayHydration / 1000).toFixed(1)}L / {(waterGoal / 1000).toFixed(1)}L
          </p>
        </div>

        {/* Expand Icon */}
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Water Options */}
              <div className="grid grid-cols-4 gap-2">
                {waterOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddWater(option.value)}
                    className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                  >
                    <Plus size={12} />
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HydrationExpandCard;