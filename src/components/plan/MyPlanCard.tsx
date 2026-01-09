import { motion } from "framer-motion";
import { Target, ChevronRight, CalendarDays, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllActivePlans } from "@/hooks/useAllActivePlans";
import { DIET_INFO } from "@/types/diet";

interface MyPlanCardProps {
  delay?: number;
}

const MyPlanCard = ({ delay = 0.15 }: MyPlanCardProps) => {
  const navigate = useNavigate();
  const { activePlans, isLoading } = useAllActivePlans();
  
  // Get the primary active plan (first one or most recent)
  const primaryPlan = activePlans?.[0];
  const hasPlan = !!primaryPlan;
  
  const handleClick = () => {
    if (hasPlan) {
      navigate("/meu-plano");
    } else {
      navigate("/criar-plano");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="aspect-square rounded-2xl bg-muted/50 animate-pulse"
      />
    );
  }

  const dietInfo = primaryPlan ? DIET_INFO[primaryPlan.diet_type] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="aspect-square rounded-2xl p-4 cursor-pointer border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent glass-card flex flex-col justify-between"
    >
      <div>
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
          <Target className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="font-display font-bold text-base text-foreground leading-tight">
          Meu Plano
        </h3>
        <p className="text-xs text-primary font-medium">
          de 21 Dias
        </p>
      </div>

      <div>
        {hasPlan && primaryPlan ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Dia {primaryPlan.current_day} de 21</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Play className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-medium text-primary">
                  Continuar
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-primary" />
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(primaryPlan.current_day / 21) * 100}%` }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Criar Plano
            </span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyPlanCard;
