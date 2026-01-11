import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Circle,
  Utensils,
  Coffee,
  UtensilsCrossed,
  Moon,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  prep_time: number;
  ingredients: string[];
  instructions: string[];
}

interface MealExpandCardProps {
  type: 'breakfast' | 'lunch' | 'dinner';
  label: string;
  time: string;
  meal: Meal | null;
  feedback: string | null;
  completed: boolean;
  onComplete: () => void;
  isLoading?: boolean;
  dietType?: string;
}

const MEAL_CONFIG = {
  breakfast: { icon: Coffee, label: 'Café da Manhã', color: 'text-orange-500' },
  lunch: { icon: UtensilsCrossed, label: 'Almoço', color: 'text-primary' },
  dinner: { icon: Moon, label: 'Jantar', color: 'text-indigo-500' },
};

const MealExpandCard = ({
  type,
  label,
  time,
  meal: initialMeal,
  feedback,
  completed,
  onComplete,
  isLoading = false,
  dietType = 'lowcarb',
}: MealExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [meal, setMeal] = useState(initialMeal);
  const [swapReason, setSwapReason] = useState<string | null>(null);
  const config = MEAL_CONFIG[type];

  const handleSwapRecipe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSwapping || !meal || completed) return;
    
    setIsSwapping(true);
    setSwapReason(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/swap-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            currentRecipe: {
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein,
              fat: meal.fat,
              carbs: meal.carbs,
            },
            dietType: dietType,
            mealType: type,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao trocar receita");
      }

      const data = await response.json();
      
      if (data.success && data.recipe) {
        setMeal({
          name: data.recipe.name,
          description: meal.description,
          calories: data.recipe.calories,
          protein: data.recipe.protein,
          fat: data.recipe.fat,
          carbs: data.recipe.carbs,
          prep_time: meal.prep_time,
          ingredients: data.recipe.instructions.split('.').filter((s: string) => s.trim()),
          instructions: [data.recipe.instructions],
        });
        setSwapReason(data.recipe.reason || null);
        toast.success("Receita trocada!", {
          description: data.recipe.name,
        });
      }
    } catch (error) {
      console.error("Swap recipe error:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao trocar receita");
    } finally {
      setIsSwapping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full bg-muted" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-1" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="glass-card rounded-xl p-4 opacity-60">
        <div className="flex items-center gap-4">
          <Circle className="w-6 h-6 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">Receita não disponível para este dia</p>
          </div>
        </div>
      </div>
    );
  }

  const MealIcon = config.icon;

  return (
    <motion.div
      layout
      className={`glass-card rounded-xl overflow-hidden transition-colors ${
        completed ? 'border border-primary/30 bg-primary/5' : ''
      }`}
    >
      {/* Header - Always visible */}
      <motion.button
        layout="position"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
      >
        {completed ? (
          <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <MealIcon className={`w-4 h-4 ${config.color}`} />
            <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
              {config.label}
            </span>
          </div>
          <p className="font-medium text-foreground truncate">{meal.name}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{meal.calories} kcal</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>
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
            <div className="px-4 pb-4 space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {meal.description}
              </p>

              {/* Quick Stats */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium">{meal.calories} kcal</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{meal.prep_time} min</span>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Proteína</p>
                  <p className="font-bold text-red-500">{meal.protein}g</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Gordura</p>
                  <p className="font-bold text-yellow-500">{meal.fat}g</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-bold text-blue-500">{meal.carbs}g</p>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Ingredientes</h4>
                <ul className="space-y-1">
                  {meal.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Modo de Preparo</h4>
                <ol className="space-y-2">
                  {meal.instructions.map((step, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Swap Reason */}
              {swapReason && (
                <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <p className="text-xs font-medium text-primary mb-1">💡 Por que essa troca?</p>
                  <p className="text-sm text-muted-foreground">{swapReason}</p>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm text-primary">
                    💡 {feedback}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Swap Recipe Button */}
                {!completed && (
                  <Button
                    variant="outline"
                    onClick={handleSwapRecipe}
                    disabled={isSwapping}
                    className="flex-1"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isSwapping ? 'animate-spin' : ''}`} />
                    {isSwapping ? "Trocando..." : "Trocar Receita"}
                  </Button>
                )}

                {/* Complete Button */}
                {!completed && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete();
                    }}
                    className="flex-1"
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    Concluir
                  </Button>
                )}

                {completed && (
                  <div className="w-full text-center text-sm text-primary font-medium py-2">
                    ✓ Refeição concluída
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealExpandCard;
