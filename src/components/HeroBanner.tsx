import { motion } from "framer-motion";
import NeuralNetwork from "./NeuralNetwork";
import { useProgress } from "@/hooks/useProgress";
import { useMemo } from "react";

interface HeroBannerProps {
  userName?: string;
  currentDay: number;
}

type DailyStatus = 'critical' | 'emerging' | 'elite';

const HeroBanner = ({ userName = "Atleta", currentDay }: HeroBannerProps) => {
  const { overallProgress, todayHydration, todaySleep, todayCalories, progress } = useProgress();

  // Calculate daily tasks completion
  const dailyTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const diets = ["carnivore", "lowcarb", "keto", "fasting", "detox"] as const;
    
    const hasNutrition = diets.some(diet => 
      progress.nutrition[diet].completedRecipes.some(r => r.endsWith(`_${today}`))
    );
    
    return {
      workout: todayCalories > 0,
      nutrition: hasNutrition,
      hydration: todayHydration >= 2000,
      sleep: todaySleep >= 7,
      mindset: progress.mindset.completedChapters.length > 0
    };
  }, [todayCalories, todayHydration, todaySleep, progress]);

  const completedCount = Object.values(dailyTasks).filter(Boolean).length;
  
  const dailyStatus: DailyStatus = useMemo(() => {
    if (completedCount === 5) return 'elite';
    if (completedCount >= 1) return 'emerging';
    return 'critical';
  }, [completedCount]);

  // Dynamic message based on status
  const statusMessage = useMemo(() => {
    switch (dailyStatus) {
      case 'elite':
        return { text: "Parabéns! Continue assim! 🏆", color: "text-emerald-400" };
      case 'emerging':
        return { text: "Você está no ritmo certo!", color: "text-amber-400" };
      case 'critical':
        return { text: "Comece suas tarefas hoje!", color: "text-red-400" };
    }
  }, [dailyStatus]);

  // Streak calculation (simplified - days with at least 1 task)
  const streak = useMemo(() => {
    if (completedCount === 0) return 0;
    // For now, return currentDay if there's any progress today
    return currentDay;
  }, [completedCount, currentDay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-44 overflow-hidden"
    >
      {/* Neural Network Background */}
      <NeuralNetwork 
        currentUserProgress={overallProgress} 
        currentUserDay={currentDay} 
      />
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Olá, {userName}</p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Dia <span className="text-gradient-coral">{currentDay}</span> de 21
          </h1>
          <p className={`text-sm ${statusMessage.color} flex items-center gap-2`}>
            <span className={`inline-block w-2 h-2 rounded-full animate-pulse-soft ${
              dailyStatus === 'elite' ? 'bg-emerald-400' :
              dailyStatus === 'emerging' ? 'bg-amber-400' : 'bg-red-400'
            }`} />
            {statusMessage.text}
          </p>
        </motion.div>

        {/* Day Progress */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30"
        >
          <div
            className="h-full gradient-coral origin-left"
            style={{ width: `${(currentDay / 21) * 100}%` }}
          />
        </motion.div>
      </div>

    </motion.div>
  );
};

export default HeroBanner;
