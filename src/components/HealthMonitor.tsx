import { motion } from "framer-motion";
import { Brain, Utensils, Dumbbell, Droplets, Moon, TrendingUp } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Progress } from "@/components/ui/progress";

const HealthMonitor = () => {
  const { progress, todayHydration, todaySleep, todayCalories, overallProgress } = useProgress();

  // Calculate pillar progress
  const mindsetProgress = Math.round((progress.mindset.completedChapters.length / 10) * 100);
  const workoutProgress = Math.round((progress.workouts.completedDays.length / 21) * 100);
  
  // Nutrition progress (average of all diets)
  const diets = ["carnivore", "lowcarb", "keto", "fasting", "detox"] as const;
  const totalNutritionChapters = diets.reduce((acc, diet) => {
    return acc + progress.nutrition[diet].completedChapters.length;
  }, 0);
  const nutritionProgress = Math.round((totalNutritionChapters / (5 * 20)) * 100); // 5 diets × 20 chapters each

  // Daily stats
  const hydrationPercent = Math.min(100, Math.round((todayHydration / 2000) * 100));
  const sleepPercent = Math.min(100, Math.round((todaySleep / 8) * 100));

  const pillars = [
    {
      name: "Mentalidade",
      icon: Brain,
      progress: mindsetProgress,
      detail: `${progress.mindset.completedChapters.length}/10 capítulos`,
      color: "coral",
    },
    {
      name: "Nutrição",
      icon: Utensils,
      progress: nutritionProgress,
      detail: `${totalNutritionChapters} capítulos concluídos`,
      color: "gold",
    },
    {
      name: "Treino",
      icon: Dumbbell,
      progress: workoutProgress,
      detail: `${progress.workouts.completedDays.length}/21 dias`,
      color: "mint",
    },
  ];

  const dailyStats = [
    {
      name: "Hidratação",
      icon: Droplets,
      value: `${(todayHydration / 1000).toFixed(1)}L`,
      target: "2L",
      percent: hydrationPercent,
      color: "gold",
    },
    {
      name: "Sono",
      icon: Moon,
      value: `${todaySleep}h`,
      target: "8h",
      percent: sleepPercent,
      color: "mint",
    },
    {
      name: "Calorias",
      icon: TrendingUp,
      value: `${todayCalories}`,
      target: "kcal",
      percent: Math.min(100, Math.round((todayCalories / 300) * 100)),
      color: "coral",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-4 py-2"
    >
      <div className="glass-card rounded-2xl p-5 border border-border/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/20 flex items-center justify-center">
              <TrendingUp className="text-coral" size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">Seu Progresso</h3>
              <p className="text-xs text-muted-foreground">Jornada de 21 dias</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-coral">{overallProgress}%</span>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Pillars Progress */}
        <div className="space-y-4 mb-5">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-${pillar.color}/20 flex items-center justify-center`}>
                    <pillar.icon size={14} className={`text-${pillar.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{pillar.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{pillar.detail}</span>
              </div>
              <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pillar.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    pillar.color === "coral" ? "bg-coral" :
                    pillar.color === "gold" ? "bg-gold" : "bg-mint"
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 my-4" />

        {/* Daily Stats */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Hoje</p>
          <div className="grid grid-cols-3 gap-3">
            {dailyStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-${stat.color}/20 flex items-center justify-center mb-2`}>
                  <stat.icon size={18} className={`text-${stat.color}`} />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {stat.value}
                  <span className="text-xs text-muted-foreground ml-0.5">/{stat.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{stat.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthMonitor;
