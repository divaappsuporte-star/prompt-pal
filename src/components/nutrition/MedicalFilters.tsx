import { motion } from "framer-motion";
import { Heart, AlertTriangle, X } from "lucide-react";
import type { MedicalCondition } from "@/pages/Nutrition";

interface MedicalFiltersProps {
  conditions: MedicalCondition[];
  onToggle: (id: string) => void;
  onDismiss: () => void;
}

const conditionIcons: Record<string, string> = {
  diabetes: "🩸",
  gastrite: "🔥",
  hipertensao: "❤️",
  intolerancia_lactose: "🥛",
  celiaquia: "🌾",
};

const MedicalFilters = ({ conditions, onToggle, onDismiss }: MedicalFiltersProps) => {
  const hasActiveConditions = conditions.some(c => c.active);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="px-6 mb-4 overflow-hidden"
    >
      <div className="glass-card rounded-2xl p-4">
        {/* Warning Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-coral/10 border border-coral/30 mb-4">
          <AlertTriangle size={18} className="text-coral flex-shrink-0" />
          <p className="text-xs text-coral font-medium">
            <strong>Importante:</strong> Selecione suas condições de saúde para receitas seguras.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-coral" />
          <h3 className="font-display font-semibold text-foreground text-sm">
            Filtros Médicos
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Selecione suas condições para adaptar automaticamente as receitas e dietas
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {conditions.map((condition) => (
            <motion.button
              key={condition.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(condition.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                condition.active
                  ? "bg-coral text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-card/80"
              }`}
            >
              <span>{conditionIcons[condition.id]}</span>
              <span>{condition.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Dismiss Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className="w-full py-3 rounded-xl bg-muted/30 text-muted-foreground text-sm font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          Não tenho nenhum desses problemas
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MedicalFilters;
