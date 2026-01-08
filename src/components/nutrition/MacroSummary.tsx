import { motion } from "framer-motion";
import { Flame, Dumbbell, Wheat, Droplets } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useEffect, useState } from "react";

const MacroSummary = () => {
  const { todayMacros, refreshData } = useProgress();
  
  // Listen for progress updates
  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener("progressUpdate", handleUpdate);
    return () => window.removeEventListener("progressUpdate", handleUpdate);
  }, [refreshData]);

  const items = [
    {
      label: "Calorias",
      value: todayMacros.calories,
      unit: "kcal",
      icon: Flame,
      color: "coral",
    },
    {
      label: "Proteína",
      value: todayMacros.protein,
      unit: "g",
      icon: Dumbbell,
      color: "coral",
    },
    {
      label: "Carbs",
      value: todayMacros.carbs,
      unit: "g",
      icon: Wheat,
      color: "gold",
    },
    {
      label: "Gordura",
      value: todayMacros.fat,
      unit: "g",
      icon: Droplets,
      color: "mint",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="px-6 mb-4"
    >
      <div className="glass-card rounded-2xl p-4">
        <h3 className="font-display font-semibold text-foreground text-sm mb-3">
          Consumo do Dia
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                    item.color === "coral"
                      ? "bg-coral/20"
                      : item.color === "gold"
                      ? "bg-gold/20"
                      : "bg-mint/20"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      item.color === "coral"
                        ? "text-coral"
                        : item.color === "gold"
                        ? "text-gold"
                        : "text-mint"
                    }
                  />
                </div>
                <p className="font-bold text-foreground text-sm">
                  {item.value}
                  <span className="text-xs text-muted-foreground ml-0.5">
                    {item.unit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MacroSummary;
