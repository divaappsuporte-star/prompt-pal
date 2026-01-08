import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { DietType, DIET_INFO } from "@/types/diet";
import { useDietAccess } from "@/hooks/useDietAccess";
import { 
  Beef, 
  Flame, 
  Wheat, 
  Zap, 
  Droplets, 
  Clock,
  LucideIcon 
} from "lucide-react";

const DIET_ICONS: Record<DietType, LucideIcon> = {
  carnivore: Beef,
  keto: Flame,
  lowcarb: Wheat,
  metabolic: Zap,
  detox: Droplets,
  fasting: Clock,
};

interface DietSelectorProps {
  selectedDiet: DietType | null;
  onSelect: (diet: DietType) => void;
}

const DietSelector = ({ selectedDiet, onSelect }: DietSelectorProps) => {
  const { hasDietAccess, unlockedDiets, isLoading } = useDietAccess();
  
  const dietList: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {dietList.map((dietKey, index) => {
        const diet = DIET_INFO[dietKey];
        const hasAccess = hasDietAccess(dietKey);
        const isSelected = selectedDiet === dietKey;
        const Icon = DIET_ICONS[dietKey];

        return (
          <motion.button
            key={dietKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={hasAccess ? { scale: 1.02 } : undefined}
            whileTap={hasAccess ? { scale: 0.98 } : undefined}
            onClick={() => hasAccess && onSelect(dietKey)}
            disabled={!hasAccess}
            className={`
              relative aspect-square rounded-2xl p-4 text-left transition-all
              flex flex-col justify-between
              ${hasAccess 
                ? 'cursor-pointer' 
                : 'cursor-not-allowed opacity-50'
              }
              ${isSelected 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                : ''
              }
            `}
            style={{
              background: hasAccess 
                ? `linear-gradient(135deg, ${diet.color}15, ${diet.color}05)` 
                : undefined,
              borderColor: hasAccess ? `${diet.color}30` : undefined,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            {/* Lock overlay for locked diets */}
            {!hasAccess && (
              <div className="absolute inset-0 rounded-2xl bg-background/60 flex items-center justify-center z-10">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            
            {/* Selected check */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-20"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}

            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${diet.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: diet.color }} />
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-foreground">
                {diet.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {diet.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default DietSelector;
