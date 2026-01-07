import { motion } from "framer-motion";
import { Heart, AlertCircle } from "lucide-react";
import type { MedicalCondition } from "@/pages/Nutrition";

interface MedicalFiltersProps {
  conditions: MedicalCondition[];
  onToggle: (id: string) => void;
}

const conditionIcons: Record<string, string> = {
  diabetes: "🩸",
  gastrite: "🔥",
  hipertensao: "❤️",
  intolerancia_lactose: "🥛",
  celiaquia: "🌾",
};

const MedicalFilters = ({ conditions, onToggle }: MedicalFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="px-6 mb-4 overflow-hidden"
    >
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart size={16} className="text-coral" />
          <h3 className="font-display font-semibold text-foreground text-sm">
            Filtros Médicos
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Selecione suas condições para adaptar automaticamente as refeições
        </p>
        <div className="flex flex-wrap gap-2">
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
      </div>
    </motion.div>
  );
};

export default MedicalFilters;
