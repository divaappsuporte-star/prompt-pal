import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Check, ChevronDown, ChevronUp, Coffee, Sun, Moon as MoonIcon } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAllActivePlans } from "@/hooks/useAllActivePlans";
import { useDailyMeals } from "@/hooks/useDailyMeals";
import { DietType } from "@/types/diet";
import { MealType } from "@/services/progressService";
import { toast } from "sonner";

interface MealsExpandCardProps {
  isCompleted: boolean;
}

type MainMealType = 'breakfast' | 'lunch' | 'dinner';

const MEAL_CONFIG: Record<MainMealType, { icon: typeof Coffee; label: string; color: string }> = {
  breakfast: { icon: Coffee, label: "Café da Manhã", color: "text-amber-400" },
  lunch: { icon: Sun, label: "Almoço", color: "text-orange-400" },
  dinner: { icon: MoonIcon, label: "Jantar", color: "text-indigo-400" },
};

const MealsExpandCard = ({ isCompleted }: MealsExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { markMealCompleted, checkMealTypeCompleted } = useProgress();
  const { activePlans } = useAllActivePlans();

  // Get the first active plan
  const activePlanEntries = Object.entries(activePlans);
  const primaryPlan = activePlanEntries.length > 0 ? activePlanEntries[0] : null;
  const dietType = primaryPlan ? primaryPlan[0] as DietType : null;
  const plan = primaryPlan ? primaryPlan[1] : null;

  const { dailyPlan, isLoading } = useDailyMeals(
    dietType || 'lowcarb',
    plan?.target_weight_loss || 3,
    plan?.current_day || 1
  );

  if (!plan || !dietType) {
    return null;
  }

  const mealTypes: MainMealType[] = ['breakfast', 'lunch', 'dinner'];

  // Map DietType to progressService DietType (exclude 'metabolic' which is not in progressService)
  const getProgressDietType = (diet: DietType): 'carnivore' | 'lowcarb' | 'keto' | 'fasting' | 'detox' => {
    if (diet === 'metabolic') return 'lowcarb'; // fallback
    return diet as 'carnivore' | 'lowcarb' | 'keto' | 'fasting' | 'detox';
  };

  const progressDiet = getProgressDietType(dietType);

  const handleCompleteMeal = (mealType: MainMealType) => {
    const meal = dailyPlan?.[mealType];
    if (!meal) return;

    const result = markMealCompleted(
      progressDiet,
      mealType,
      meal.name,
      meal.calories,
      meal.protein || 0,
      meal.fat || 0,
      meal.carbs || 0,
      { 
        title: 'Refeição concluída', 
        message: 'Ótima escolha!', 
        bodyProcess: 'Digestão em andamento',
        timeframe: 'Agora',
        icon: '✓'
      }
    );

    if (result.success) {
      toast.success(`${MEAL_CONFIG[mealType].label} concluído!`);
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const completedMealsCount = mealTypes.filter(type => checkMealTypeCompleted(progressDiet, type)).length;

  return (
    <motion.div
      className={`rounded-xl border transition-all overflow-hidden ${
        isCompleted 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-muted/50 border-border'
      }`}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3"
      >
        {/* Status Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-emerald-500' : 'bg-coral/20'
        }`}>
          {isCompleted ? (
            <Check size={16} className="text-white" />
          ) : (
            <Apple size={16} className="text-coral" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-foreground'}`}>
            Nutrição
          </p>
          <p className="text-xs text-muted-foreground">
            {completedMealsCount}/3 refeições • Dia {plan.current_day}
          </p>
        </div>

        {/* Expand Icon */}
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
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
            <div className="px-3 pb-3 space-y-2">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Carregando refeições...
                </div>
              ) : (
                mealTypes.map((mealType) => {
                  const config = MEAL_CONFIG[mealType];
                  const Icon = config.icon;
                  const meal = dailyPlan?.[mealType];
                  const isMealCompleted = checkMealTypeCompleted(progressDiet, mealType);

                  return (
                    <div
                      key={mealType}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                        isMealCompleted 
                          ? 'bg-emerald-500/10' 
                          : 'bg-background/50'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        isMealCompleted ? 'bg-emerald-500' : 'bg-muted'
                      }`}>
                        {isMealCompleted ? (
                          <Check size={14} className="text-white" />
                        ) : (
                          <Icon size={14} className={config.color} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isMealCompleted ? 'text-emerald-400' : 'text-foreground'
                        }`}>
                          {config.label}
                        </p>
                        {meal && (
                          <p className="text-xs text-muted-foreground truncate">
                            {meal.name} • {meal.calories} kcal
                          </p>
                        )}
                      </div>

                      {!isMealCompleted && meal && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCompleteMeal(mealType)}
                          className="px-2.5 py-1.5 rounded-lg bg-coral/20 text-coral text-xs font-medium"
                        >
                          Concluir
                        </motion.button>
                      )}

                      {isMealCompleted && (
                        <span className="text-xs text-emerald-400">✓</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealsExpandCard;