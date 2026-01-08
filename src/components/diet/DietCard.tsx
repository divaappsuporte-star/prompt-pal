import { motion } from "framer-motion";
import { Lock, ChevronRight, Check } from "lucide-react";
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
    coral: "from-coral/20 to-coral/5 border-coral/30",
    mint: "from-mint/20 to-mint/5 border-mint/30",
    gold: "from-gold/20 to-gold/5 border-gold/30",
  };

  const iconColorClasses = {
    coral: "text-coral",
    mint: "text-mint",
    gold: "text-gold",
  };

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
        "relative glass-card rounded-2xl p-4 border cursor-pointer transition-all overflow-hidden",
        "bg-gradient-to-br",
        colorClasses[diet.color as keyof typeof colorClasses],
        isLocked && "opacity-60"
      )}
    >
      {/* Progress bar */}
      {hasActivePlan && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
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

      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Emoji */}
          <span className="text-3xl mb-2 block">{diet.emoji}</span>
          
          {/* Title */}
          <h3 className="font-display font-bold text-foreground text-lg mb-1">
            {diet.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {diet.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {diet.features.slice(0, 2).map((feature, idx) => (
              <span 
                key={idx}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  "bg-background/50 text-muted-foreground"
                )}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Lock/Arrow indicator */}
        <div className="ml-3">
          {isLocked ? (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : hasActivePlan ? (
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              diet.color === 'coral' && "bg-coral/20",
              diet.color === 'mint' && "bg-mint/20",
              diet.color === 'gold' && "bg-gold/20"
            )}>
              <Check className={cn("w-5 h-5", iconColorClasses[diet.color as keyof typeof iconColorClasses])} />
            </div>
          ) : (
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              diet.color === 'coral' && "bg-coral/20",
              diet.color === 'mint' && "bg-mint/20",
              diet.color === 'gold' && "bg-gold/20"
            )}>
              <ChevronRight className={cn("w-5 h-5", iconColorClasses[diet.color as keyof typeof iconColorClasses])} />
            </div>
          )}
        </div>
      </div>

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <div className="text-center p-4">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              Desbloquear
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DietCard;
