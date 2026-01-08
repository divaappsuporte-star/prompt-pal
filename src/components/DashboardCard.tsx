import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "coral" | "gold" | "mint";
  progress?: number;
  onClick?: () => void;
  delay?: number;
  guideBadge?: "start" | "next" | null;
}

const DashboardCard = ({
  title,
  subtitle,
  icon: Icon,
  variant = "default",
  progress,
  onClick,
  delay = 0,
  guideBadge = null,
}: DashboardCardProps) => {
  const variantStyles = {
    default: "border-border/50",
    coral: "border-coral/30 hover:border-coral/60",
    gold: "border-gold/30 hover:border-gold/60",
    mint: "border-mint/30 hover:border-mint/60",
  };

  const iconColors = {
    default: "text-foreground",
    coral: "text-coral",
    gold: "text-gold",
    mint: "text-mint",
  };

  const glowStyles = {
    default: "",
    coral: "hover:shadow-glow-coral",
    gold: "hover:shadow-glow-gold",
    mint: "",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer
        glass-card rounded-2xl p-4
        border ${variantStyles[variant]}
        transition-all duration-300
        ${glowStyles[variant]}
        ${guideBadge ? 'ring-2 ring-gold/50 shadow-glow-gold' : ''}
      `}
    >
      {/* Guide Badge */}
      {guideBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 z-20"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gold/30 rounded-full blur-md"
            />
            <span className="relative block bg-gradient-to-r from-gold to-coral text-background text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
              {guideBadge === "start" ? "Comece aqui" : "Agora é aqui"}
            </span>
          </div>
        </motion.div>
      )}
      {/* Background gradient effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br from-${variant === 'default' ? 'primary' : variant}/5 to-transparent`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className={`inline-flex p-2.5 rounded-xl bg-muted/50 ${iconColors[variant]}`}>
            <Icon size={20} />
          </div>
          {progress !== undefined && (
            <span className={`text-lg font-display font-bold ${iconColors[variant]}`}>
              {progress}%
            </span>
          )}
        </div>
        
        <div className="mt-3">
          <h3 className="font-display text-base font-semibold text-foreground leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {progress !== undefined && (
          <div className="w-full h-1.5 rounded-full bg-muted/50 mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
              className={`h-full rounded-full ${
                variant === "coral" ? "gradient-coral" :
                variant === "gold" ? "gradient-gold" :
                variant === "mint" ? "bg-mint" : "bg-primary"
              }`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
