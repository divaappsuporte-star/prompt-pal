import { motion } from "framer-motion";
import { Check, Lock, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { DietType, MealType, MealFeedbackData } from "@/services/progressService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Recipe {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs?: number;
  instructions: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  delay?: number;
  diet: DietType;
  mealType: MealType;
  accentColor?: string;
  feedback?: MealFeedbackData;
}

// Default feedbacks per meal type
const DEFAULT_FEEDBACKS: Record<MealType, MealFeedbackData> = {
  breakfast: {
    title: "Metabolismo Ativado",
    message: "Seu corpo está saindo do jejum noturno e iniciando a produção de enzimas digestivas.",
    bodyProcess: "A primeira refeição rica em proteína eleva a termogênese em até 30%, queimando mais calorias apenas para digerir.",
    timeframe: "Efeito nas próximas 4-6 horas",
    icon: "Flame",
  },
  lunch: {
    title: "Síntese Proteica Ativa",
    message: "Seu corpo está no pico de absorção de nutrientes. As proteínas estão sendo direcionadas para reparação muscular.",
    bodyProcess: "O sistema digestivo está trabalhando em capacidade máxima, convertendo proteínas em aminoácidos essenciais.",
    timeframe: "Digestão completa em 3-4 horas",
    icon: "Activity",
  },
  dinner: {
    title: "Preparação para Regeneração",
    message: "Seu corpo está se preparando para o período de recuperação noturno.",
    bodyProcess: "Durante o sono, o GH (hormônio do crescimento) será liberado para reparar tecidos. A proteína do jantar fornece os blocos de construção.",
    timeframe: "Regeneração durante 6-8h de sono",
    icon: "Moon",
  },
  snack: {
    title: "Manutenção Energética",
    message: "Lanche estratégico para manter níveis de energia estáveis.",
    bodyProcess: "Evita picos de insulina e mantém o metabolismo ativo entre as refeições principais.",
    timeframe: "Energia sustentada por 2-3 horas",
    icon: "Zap",
  },
};

const RecipeCard = ({ 
  recipe: initialRecipe, 
  index, 
  delay = 0, 
  diet, 
  mealType,
  accentColor = "text-coral",
  feedback 
}: RecipeCardProps) => {
  const { checkMealTypeCompleted, checkRecipeCompleted, markMealCompleted } = useProgress();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [recipe, setRecipe] = useState(initialRecipe);
  const [swapReason, setSwapReason] = useState<string | null>(null);
  
  const isMealTypeCompleted = checkMealTypeCompleted(diet, mealType);
  const isThisRecipeCompleted = checkRecipeCompleted(diet, recipe.name);
  
  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isMealTypeCompleted && !isThisRecipeCompleted) {
      const mealNames: Record<MealType, string> = {
        breakfast: 'café da manhã',
        lunch: 'almoço',
        dinner: 'jantar',
        snack: 'lanche',
      };
      toast.error(`Você já marcou um ${mealNames[mealType]} hoje.`);
      return;
    }
    
    if (!isThisRecipeCompleted) {
      const mealFeedback = feedback || DEFAULT_FEEDBACKS[mealType];
      const result = markMealCompleted(
        diet, 
        mealType,
        recipe.name, 
        recipe.calories, 
        recipe.protein, 
        recipe.fat, 
        recipe.carbs || 0,
        mealFeedback
      );
      
      if (result.success) {
        toast.success('Refeição registrada!', {
          description: mealFeedback.title,
        });
      } else if (result.error) {
        toast.error(result.error);
      }
    }
  };

  const handleSwapRecipe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSwapping) return;
    
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
              name: recipe.name,
              calories: recipe.calories,
              protein: recipe.protein,
              fat: recipe.fat,
              carbs: recipe.carbs || 0,
            },
            dietType: diet,
            mealType: mealType,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao trocar receita");
      }

      const data = await response.json();
      
      if (data.success && data.recipe) {
        setRecipe({
          name: data.recipe.name,
          calories: data.recipe.calories,
          protein: data.recipe.protein,
          fat: data.recipe.fat,
          carbs: data.recipe.carbs,
          instructions: data.recipe.instructions,
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

  const isDisabled = isMealTypeCompleted && !isThisRecipeCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.05 }}
      className={cn(
        "glass-card rounded-xl border transition-all overflow-hidden",
        isThisRecipeCompleted && "border-mint/50 bg-mint/5",
        isDisabled && "opacity-50",
        !isThisRecipeCompleted && !isDisabled && "border-border/50"
      )}
    >
      {/* Header - clickable to expand */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium mb-2",
              isThisRecipeCompleted ? "text-mint" : "text-foreground"
            )}>
              {recipe.name}
              {isThisRecipeCompleted && <span className="ml-2 text-xs">✓ Feito</span>}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>{recipe.calories} kcal</span>
              <span>•</span>
              <span>{recipe.protein}g prot</span>
              <span>•</span>
              <span>{recipe.fat}g gord</span>
              {recipe.carbs !== undefined && (
                <>
                  <span>•</span>
                  <span>{recipe.carbs}g carb</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp size={18} className="text-muted-foreground" />
            ) : (
              <ChevronDown size={18} className="text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-3"
        >
          {/* Instructions */}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Modo de Preparo:</p>
            <p className={cn(
              "text-sm",
              isThisRecipeCompleted ? "text-mint/70" : accentColor
            )}>
              {recipe.instructions}
            </p>
          </div>

          {/* Swap reason if available */}
          {swapReason && (
            <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">💡 Por que essa troca?</p>
              <p className="text-sm text-muted-foreground">{swapReason}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {/* Swap button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSwapRecipe}
              disabled={isSwapping || isThisRecipeCompleted}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all",
                isSwapping && "opacity-70 cursor-wait",
                isThisRecipeCompleted && "opacity-50 cursor-not-allowed",
                !isSwapping && !isThisRecipeCompleted && "bg-muted/50 hover:bg-muted text-foreground"
              )}
            >
              <RefreshCw size={16} className={cn(isSwapping && "animate-spin")} />
              {isSwapping ? "Trocando..." : "Trocar Receita"}
            </motion.button>

            {/* Complete button */}
            <motion.button
              whileHover={{ scale: isDisabled ? 1 : 1.02 }}
              whileTap={{ scale: isDisabled ? 1 : 0.98 }}
              onClick={handleMarkComplete}
              disabled={isThisRecipeCompleted}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all",
                isThisRecipeCompleted && "bg-mint/20 text-mint cursor-default",
                isDisabled && "bg-muted/20 text-muted-foreground cursor-not-allowed",
                !isThisRecipeCompleted && !isDisabled && "bg-mint/80 text-white hover:bg-mint"
              )}
            >
              {isDisabled ? <Lock size={16} /> : <Check size={16} />}
              {isThisRecipeCompleted ? "Concluída" : "Concluir"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecipeCard;
