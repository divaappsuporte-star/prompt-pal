import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Droplets,
  Plus,
  Minus,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface WaterMissionCardProps {
  goalMl: number;
  currentMl: number;
  onAddWater: (amount: number) => void;
}

const WaterMissionCard = ({ goalMl, currentMl, onAddWater }: WaterMissionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progress = Math.min((currentMl / goalMl) * 100, 100);
  const isComplete = currentMl >= goalMl;
  const glasses = Math.floor(currentMl / 250); // 250ml = 1 copo
  const remainingMl = goalMl - currentMl;

  const waterButtons = [
    { label: "Copo", amount: 250, icon: "🥛" },
    { label: "Garrafa P", amount: 500, icon: "💧" },
    { label: "Garrafa G", amount: 1000, icon: "🍶" },
  ];

  return (
    <motion.div
      layout
      className={`rounded-xl overflow-hidden transition-colors border ${
        isComplete 
          ? 'border-blue-500/50 bg-blue-500/5' 
          : 'border-border bg-muted/30'
      }`}
    >
      {/* Header */}
      <motion.button
        layout="position"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center gap-3 text-left hover:bg-muted/30 transition-colors"
      >
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
        ) : (
          <Droplets className="w-5 h-5 text-blue-500 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm ${isComplete ? 'text-blue-500 font-medium' : 'text-foreground'}`}>
              Beber {(goalMl / 1000).toFixed(1)}L de água
            </span>
            <span className="text-xs text-muted-foreground">
              {(currentMl / 1000).toFixed(1)}L / {(goalMl / 1000).toFixed(1)}L
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
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
              {/* Quick stats */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  🥛 {glasses} copos bebidos
                </span>
                {!isComplete && (
                  <span className="text-muted-foreground">
                    Faltam {(remainingMl / 1000).toFixed(1)}L
                  </span>
                )}
              </div>

              {/* Quick add buttons */}
              <div className="grid grid-cols-3 gap-2">
                {waterButtons.map((btn) => (
                  <Button
                    key={btn.amount}
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddWater(btn.amount);
                    }}
                    className="flex flex-col items-center gap-1 h-auto py-2"
                  >
                    <span className="text-lg">{btn.icon}</span>
                    <span className="text-xs">{btn.label}</span>
                    <span className="text-[10px] text-muted-foreground">+{btn.amount}ml</span>
                  </Button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="flex items-center gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentMl >= 250) onAddWater(-250);
                  }}
                  disabled={currentMl < 250}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                  Ajustar ±250ml
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddWater(250);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {isComplete && (
                <div className="text-center text-sm text-blue-500 font-medium py-2">
                  🎉 Meta de hidratação alcançada!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WaterMissionCard;
