import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DietInfo } from "@/types/diet";

interface DietCardProps {
  diet: DietInfo;
  isLocked: boolean;
  hasActivePlan?: boolean;
  progress?: number;
  onClick: () => void;
  onUnlockClick?: () => void;
  delay?: number;
}

const DietCard = ({ 
  diet, 
  isLocked, 
  hasActivePlan,
  progress = 0,
  onClick, 
  onUnlockClick,
  delay = 0 
}: DietCardProps) => {
  const colorClasses = {
    coral: {
      bg: "from-coral/15 to-coral/5",
      border: "border-coral/20",
      iconBg: "bg-coral/20",
      iconText: "text-coral",
    },
    mint: {
      bg: "from-mint/15 to-mint/5",
      border: "border-mint/20",
      iconBg: "bg-mint/20",
      iconText: "text-mint",
    },
    gold: {
      bg: "from-gold/15 to-gold/5",
      border: "border-gold/20",
      iconBg: "bg-gold/20",
      iconText: "text-gold",
    },
  };

  const colors = colorClasses[diet.color as keyof typeof colorClasses] || colorClasses.coral;

  const handleClick = () => {
    if (isLocked && onUnlockClick) {
      onUnlockClick();
    } else if (!isLocked) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      onClick={handleClick}
      className={cn(
        "relative glass-card rounded-2xl p-4 border cursor-pointer transition-all",
        "bg-gradient-to-br",
        colors.bg,
        colors.border,
        isLocked && "opacity-60"
      )}
    >
      {/* Progress bar */}
      {hasActivePlan && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-2xl overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              "h-full",
              diet.color === 'coral' && "bg-coral",
              diet.color === 'mint' && "bg-mint",
              diet.color === 'gold' && "bg-gold"
            )}
          />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Icon container - same style as Mentalidade */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
          colors.iconBg
        )}>
          <span className="text-2xl">{diet.emoji}</span>
        </div>
        
        {/* Title */}
        <h3 className="font-display font-bold text-foreground text-sm mb-1 line-clamp-1">
          {diet.name.replace('Dieta ', '')}
        </h3>
        
        {/* Short description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
          {diet.features[0]}
        </p>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Lock className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DietCard;
