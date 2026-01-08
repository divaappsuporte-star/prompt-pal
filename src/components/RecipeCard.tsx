import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
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
  recipe, 
  index, 
  delay = 0, 
  diet, 
  mealType,
  accentColor = "text-coral",
  feedback 
}: RecipeCardProps) => {
  const { checkMealTypeCompleted, checkRecipeCompleted, markMealCompleted } = useProgress();
  
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

  const isDisabled = isMealTypeCompleted && !isThisRecipeCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.05 }}
      className={cn(
        "glass-card rounded-xl p-4 border transition-all",
        isThisRecipeCompleted && "border-mint/50 bg-mint/5",
        isDisabled && "opacity-50",
        !isThisRecipeCompleted && !isDisabled && "border-border/50"
      )}
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
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
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
          <p className={cn(
            "text-xs",
            isThisRecipeCompleted ? "text-mint/70" : accentColor
          )}>
            {recipe.instructions}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: isDisabled ? 1 : 1.1 }}
          whileTap={{ scale: isDisabled ? 1 : 0.9 }}
          onClick={handleMarkComplete}
          disabled={isThisRecipeCompleted}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
            isThisRecipeCompleted && "bg-mint/20 text-mint cursor-default",
            isDisabled && "bg-muted/20 text-muted-foreground cursor-not-allowed",
            !isThisRecipeCompleted && !isDisabled && "bg-muted/30 text-muted-foreground hover:bg-mint/20 hover:text-mint cursor-pointer"
          )}
        >
          {isDisabled ? <Lock size={16} /> : <Check size={18} />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
