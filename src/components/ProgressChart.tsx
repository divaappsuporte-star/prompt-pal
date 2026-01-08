import { motion } from "framer-motion";
import { TrendingUp, Droplets, Moon, Flame, Brain, Apple, Dumbbell } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const ProgressChart = () => {
  const { progress, overallProgress, todayHydration, todaySleep, todayCalories } = useProgress();

  // Calculate individual progress
  const mindsetProgress = Math.round((progress.mindset.completedChapters.length / 10) * 100);
  const workoutProgress = Math.round((progress.workouts.completedSessions.length / 21) * 100);
  
  const nutritionTotal = Object.values(progress.nutrition).reduce((acc, diet) => {
    return acc + diet.completedChapters.length;
  }, 0);
  const nutritionProgress = Math.round((nutritionTotal / 25) * 100); // 5 diets x 5 chapters

  const stats = [
    { 
      label: "Progresso Geral", 
      value: overallProgress, 
      icon: TrendingUp,
      color: "text-coral",
      bgColor: "bg-coral/20"
    },
    { 
      label: "Mentalidade", 
      value: mindsetProgress, 
      icon: Brain,
      color: "text-gold",
      bgColor: "bg-gold/20"
    },
    { 
      label: "Nutrição", 
      value: nutritionProgress, 
      icon: Apple,
      color: "text-mint",
      bgColor: "bg-mint/20"
    },
    { 
      label: "Treino", 
      value: workoutProgress, 
      icon: Dumbbell,
      color: "text-coral",
      bgColor: "bg-coral/20"
    },
  ];

  const todayStats = [
    { 
      label: "Água", 
      value: `${(todayHydration / 1000).toFixed(1)}L`,
      target: "/ 2L",
      icon: Droplets,
      color: "text-blue-400"
    },
    { 
      label: "Sono", 
      value: `${todaySleep}h`,
      target: "/ 8h",
      icon: Moon,
      color: "text-purple-400"
    },
    { 
      label: "Calorias", 
      value: todayCalories > 0 ? `-${todayCalories}` : "0",
      target: "kcal",
      icon: Flame,
      color: "text-orange-400"
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground">
          Seu Progresso
        </h2>
        <span className="text-sm text-muted-foreground">
          {overallProgress}% completo
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/60 rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
                <span className="text-sm text-foreground">{stat.label}</span>
              </div>
              <span className={`text-sm font-semibold ${stat.color}`}>
                {stat.value}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`h-full rounded-full ${stat.bgColor.replace('/20', '')}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-3">
        {todayStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-card/60 rounded-xl p-3 text-center"
          >
            <stat.icon size={18} className={`mx-auto mb-1 ${stat.color}`} />
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.target}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;