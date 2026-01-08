import { motion, AnimatePresence } from "framer-motion";
import { X, Droplets, Plus } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface WaterInputModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaterInputModal = ({ isOpen, onClose }: WaterInputModalProps) => {
  const { todayHydration, addWaterIntake } = useProgress();

  const waterOptions = [
    { ml: 250, label: "250ml", icon: "🥛" },
    { ml: 500, label: "500ml", icon: "🫗" },
    { ml: 750, label: "750ml", icon: "🍶" },
    { ml: 1000, label: "1 Litro", icon: "💧" },
  ];

  const progress = Math.min((todayHydration / 2000) * 100, 100);

  const handleAddWater = (ml: number) => {
    addWaterIntake(ml);
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
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Droplets className="text-gold" size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">Hidratação</h3>
                  <p className="text-sm text-muted-foreground">Registre sua água</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Current Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Hoje</span>
                <span className="font-display font-bold text-gold">
                  {(todayHydration / 1000).toFixed(1)}L / 2L
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full gradient-gold"
                />
              </div>
            </div>

            {/* Water Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {waterOptions.map((option) => (
                <motion.button
                  key={option.ml}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAddWater(option.ml)}
                  className="glass-card rounded-xl p-4 border border-gold/20 hover:border-gold/50 transition-all"
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-foreground">
                      {option.label}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                      <Plus size={14} className="text-gold" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Quick Info */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                💡 Beber 2L de água por dia melhora energia, digestão e metabolismo
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaterInputModal;
