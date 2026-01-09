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
  excludeDetox?: boolean;
}

const DietSelector = ({ selectedDiet, onSelect, excludeDetox = false }: DietSelectorProps) => {
  const { hasPurchasedDiet, purchasedDiets, isLoading } = useDietAccess();
  
  // Only show purchased diets in the selector (user must buy first)
  const allDiets: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'];
  const dietList = excludeDetox 
    ? purchasedDiets.filter(d => d !== 'detox') 
    : purchasedDiets;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  // If no purchased diets, show message
  if (dietList.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-bold text-foreground mb-2">
          Nenhum protocolo desbloqueado
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Adquira um protocolo na tela inicial para criar seu plano personalizado de 21 dias.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {dietList.map((dietKey, index) => {
        const diet = DIET_INFO[dietKey];
        const isSelected = selectedDiet === dietKey;
        const Icon = DIET_ICONS[dietKey];

        return (
          <motion.button
            key={dietKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(dietKey)}
            className={`
              relative aspect-square rounded-2xl p-4 text-left transition-all
              flex flex-col justify-between cursor-pointer
              ${isSelected 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                : ''
              }
            `}
            style={{
              background: `linear-gradient(135deg, ${diet.color}15, ${diet.color}05)`,
              borderColor: `${diet.color}30`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            
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
