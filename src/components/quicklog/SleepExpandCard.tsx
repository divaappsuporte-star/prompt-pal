import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";

interface SleepExpandCardProps {
  isCompleted: boolean;
}

const SleepExpandCard = ({ isCompleted }: SleepExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { todaySleep, addSleepTime } = useProgress();
  const { profile } = useAuth();

  const sleepGoal = profile?.sleep_goal_hours || 8;
  const hasLogged = todaySleep > 0;

  const sleepOptions = [4, 5, 6, 7, 8, 9];

  const handleAddSleep = (hours: number) => {
    addSleepTime(hours);
  };

  const getSleepQuality = (hours: number) => {
    if (hours >= 8) return { label: "Ótimo", color: "text-emerald-400" };
    if (hours >= 7) return { label: "Bom", color: "text-cyan-400" };
    if (hours >= 6) return { label: "Regular", color: "text-amber-400" };
    return { label: "Ruim", color: "text-red-400" };
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
          isCompleted ? 'bg-emerald-500' : 'bg-indigo-500/20'
        }`}>
          {isCompleted ? (
            <Check size={16} className="text-white" />
          ) : (
            <Moon size={16} className="text-indigo-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-foreground'}`}>
            Sono
          </p>
          <p className="text-xs text-muted-foreground">
            {hasLogged ? (
              <>
                {todaySleep}h dormidas • 
                <span className={`ml-1 ${getSleepQuality(todaySleep).color}`}>
                  {getSleepQuality(todaySleep).label}
                </span>
              </>
            ) : (
              `Meta: ${sleepGoal}h`
            )}
          </p>
        </div>

        {/* Expand Icon */}
        {!hasLogged && (
          isExpanded ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )
        )}

        {hasLogged && (
          <span className="text-xs text-emerald-400 font-medium">✓ Registrado</span>
        )}
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && !hasLogged && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              <p className="text-xs text-muted-foreground mb-2">
                Quantas horas você dormiu ontem à noite?
              </p>
              
              {/* Sleep Options */}
              <div className="grid grid-cols-6 gap-2">
                {sleepOptions.map((hours) => (
                  <motion.button
                    key={hours}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddSleep(hours)}
                    className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                      hours >= sleepGoal 
                        ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {hours}h
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

export default SleepExpandCard;