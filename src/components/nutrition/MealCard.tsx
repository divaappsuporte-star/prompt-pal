import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  tags: string[];
  restrictions?: string[];
}

interface MealCardProps {
  meal: Meal;
  delay?: number;
}

const MealCard = ({ meal, delay = 0 }: MealCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-4 cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Food Emoji/Image */}
        <div className="w-16 h-16 rounded-xl bg-card/80 flex items-center justify-center text-3xl">
          {meal.image}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-semibold text-foreground">
                {meal.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Clock size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{meal.time}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-coral">{meal.calories}</span>
              <span className="text-xs text-muted-foreground ml-1">kcal</span>
            </div>
          </div>

          {/* Macros */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-coral" />
              <span className="text-xs text-muted-foreground">
                {meal.protein}g prot
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">
                {meal.carbs}g carb
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">
                {meal.fat}g fat
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {meal.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-card text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MealCard;
