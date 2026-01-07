import { motion } from "framer-motion";
import ProgressRing from "./ui/ProgressRing";
import { Flame, Footprints, Moon, Activity } from "lucide-react";

const QuickStats = () => {
  const stats = [
    { icon: Flame, label: "Calorias", value: "1,850", unit: "kcal", progress: 72, variant: "coral" as const },
    { icon: Footprints, label: "Passos", value: "8,234", unit: "passos", progress: 82, variant: "gold" as const },
    { icon: Moon, label: "Sono", value: "7h 20m", unit: "", progress: 91, variant: "mint" as const },
    { icon: Activity, label: "Ativo", value: "45", unit: "min", progress: 60, variant: "coral" as const },
  ];

  return (
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
            className="glass-card rounded-2xl p-4"
          >
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
  );
};

export default QuickStats;
