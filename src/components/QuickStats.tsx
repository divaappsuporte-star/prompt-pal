import { useState } from "react";
import { motion } from "framer-motion";
import ProgressRing from "./ui/ProgressRing";
import { Flame, Droplets, Moon, TrendingUp, Plus } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import WaterInputModal from "./modals/WaterInputModal";
import SleepInputModal from "./modals/SleepInputModal";

const QuickStats = () => {
  const { todayHydration, todaySleep, todayCalories, overallProgress } = useProgress();
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [sleepModalOpen, setSleepModalOpen] = useState(false);

  // Calculate progress percentages
  const hydrationProgress = Math.min(Math.round((todayHydration / 2000) * 100), 100);
  const sleepProgress = Math.min(Math.round((todaySleep / 8) * 100), 100);
  const caloriesDisplay = todayCalories > 0 ? `-${todayCalories}` : "0";

  const stats = [
    { 
      icon: Flame, 
      label: "Calorias", 
      value: caloriesDisplay, 
      unit: "kcal", 
      progress: Math.min(Math.round((todayCalories / 300) * 100), 100), 
      variant: "coral" as const,
      clickable: false,
      subtext: todayCalories > 0 ? "queimadas" : "faça um treino"
    },
    { 
      icon: Droplets, 
      label: "Hidratação", 
      value: `${(todayHydration / 1000).toFixed(1)}`, 
      unit: "L", 
      progress: hydrationProgress, 
      variant: "gold" as const,
      clickable: true,
      onClick: () => setWaterModalOpen(true),
      subtext: todayHydration === 0 ? "toque para adicionar" : `de 2L`
    },
    { 
      icon: Moon, 
      label: "Sono", 
      value: todaySleep > 0 ? `${todaySleep}h` : "--", 
      unit: "", 
      progress: sleepProgress, 
      variant: "mint" as const,
      clickable: true,
      onClick: () => setSleepModalOpen(true),
      subtext: todaySleep === 0 ? "toque para registrar" : todaySleep >= 7 ? "ótimo!" : "aumente para 7-8h"
    },
    { 
      icon: TrendingUp, 
      label: "Progresso", 
      value: `${overallProgress}`, 
      unit: "%", 
      progress: overallProgress, 
      variant: "coral" as const,
      clickable: false,
      subtext: "jornada total"
    },
  ];

  return (
    <>
      <div className="px-4 py-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">
          Resumo de Hoje
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={stat.clickable ? { scale: 1.02 } : undefined}
              whileTap={stat.clickable ? { scale: 0.98 } : undefined}
              onClick={stat.onClick}
              className={`
                glass-card rounded-2xl p-4 relative
                ${stat.clickable ? "cursor-pointer" : ""}
              `}
            >
              {/* Add indicator for clickable cards */}
              {stat.clickable && stat.progress === 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                >
                  <Plus size={14} className="text-background" />
                </motion.div>
              )}
              
              <div className="flex items-start justify-between">
                <div>
                  <div className={`
                    inline-flex p-2 rounded-lg mb-2
                    ${stat.variant === "coral" ? "bg-coral/20 text-coral" : 
                      stat.variant === "gold" ? "bg-gold/20 text-gold" : 
                      "bg-mint/20 text-mint"}
                  `}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="font-display text-lg font-bold text-foreground">
                    {stat.value}
                    {stat.unit && <span className="text-xs text-muted-foreground ml-1">{stat.unit}</span>}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.subtext}</p>
                </div>

                <ProgressRing
                  progress={stat.progress}
                  size={48}
                  strokeWidth={4}
                  variant={stat.variant}
                >
                  <span className="text-xs font-bold text-foreground">{stat.progress}%</span>
                </ProgressRing>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <WaterInputModal isOpen={waterModalOpen} onClose={() => setWaterModalOpen(false)} />
      <SleepInputModal isOpen={sleepModalOpen} onClose={() => setSleepModalOpen(false)} />
    </>
  );
};

export default QuickStats;
