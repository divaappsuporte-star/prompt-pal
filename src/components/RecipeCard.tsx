import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { DietType } from "@/services/progressService";

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
  accentColor?: string;
}

const RecipeCard = ({ recipe, index, delay = 0, diet, accentColor = "text-coral" }: RecipeCardProps) => {
  const { markRecipeCompleted, checkRecipeCompleted } = useProgress();
  const isCompleted = checkRecipeCompleted(diet, recipe.name);

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      markRecipeCompleted(diet, recipe.name, recipe.calories, recipe.protein, recipe.fat, recipe.carbs || 0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + index * 0.05 }}
      className={`
        glass-card rounded-xl p-4 border transition-all
        ${isCompleted ? "border-mint/50 bg-mint/5" : "border-border/50"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-2 ${isCompleted ? "text-mint" : "text-foreground"}`}>
            {recipe.name}
            {isCompleted && <span className="ml-2 text-xs">✓ Feito</span>}
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
          <p className={`text-xs ${isCompleted ? "text-mint/70" : accentColor}`}>{recipe.instructions}</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
            ${isCompleted 
              ? "bg-mint/20 text-mint cursor-default" 
              : "bg-muted/30 text-muted-foreground hover:bg-mint/20 hover:text-mint cursor-pointer"
            }
          `}
        >
          <Check size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
