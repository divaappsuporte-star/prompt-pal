import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Check } from "lucide-react";
import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";

interface SleepInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SleepInputModal = ({ isOpen, onClose }: SleepInputModalProps) => {
  const { todaySleep, addSleepTime } = useProgress();
  const [selectedHours, setSelectedHours] = useState(todaySleep || 7);

  const sleepOptions = [
    { hours: 4, label: "4h", quality: "Muito pouco" },
    { hours: 5, label: "5h", quality: "Pouco" },
    { hours: 6, label: "6h", quality: "Razoável" },
    { hours: 7, label: "7h", quality: "Bom" },
    { hours: 8, label: "8h", quality: "Ótimo" },
    { hours: 9, label: "9h+", quality: "Excelente" },
  ];

  const handleSaveSleep = () => {
    addSleepTime(selectedHours);
    onClose();
  };

  const getQualityColor = (hours: number) => {
    if (hours < 5) return "text-coral";
    if (hours < 7) return "text-gold";
    return "text-mint";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card rounded-2xl p-6 w-full max-w-sm"
            style={{ background: "var(--gradient-dark)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                  <Moon className="text-mint" size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Sono</h3>
                  <p className="text-sm text-muted-foreground">Quantas horas dormiu?</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Current Value Display */}
            <div className="text-center mb-6">
              <motion.span
                key={selectedHours}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-5xl font-bold text-foreground"
              >
                {selectedHours}h
              </motion.span>
              <p className={`text-sm mt-1 ${getQualityColor(selectedHours)}`}>
                {sleepOptions.find((o) => o.hours === selectedHours)?.quality || "Bom"}
              </p>
            </div>

            {/* Sleep Options */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {sleepOptions.map((option) => (
                <motion.button
                  key={option.hours}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedHours(option.hours)}
                  className={`
                    rounded-xl p-3 border transition-all
                    ${selectedHours === option.hours
                      ? "bg-mint/20 border-mint"
                      : "glass-card border-border/30 hover:border-mint/50"
                    }
                  `}
                >
                  <span className={`
                    font-display font-semibold
                    ${selectedHours === option.hours ? "text-mint" : "text-foreground"}
                  `}>
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveSleep}
              className="w-full py-4 rounded-xl gradient-mint text-background font-display font-bold flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Salvar
            </motion.button>

            {/* Quick Info */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                💡 7-8 horas de sono otimizam recuperação muscular e metabolismo
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SleepInputModal;
