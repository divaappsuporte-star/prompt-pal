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
}

const DashboardCard = ({
  title,
  subtitle,
  icon: Icon,
  variant = "default",
  progress,
  onClick,
  delay = 0,
}: DashboardCardProps) => {
  const variantStyles = {
    default: "border-border/30",
    coral: "border-coral/20",
    gold: "border-gold/20",
    mint: "border-mint/20",
  };

  const iconColors = {
    default: "text-foreground",
    coral: "text-coral",
    gold: "text-gold",
    mint: "text-mint",
  };

  const progressColors = {
    default: "bg-primary",
    coral: "bg-coral",
    gold: "bg-gold",
    mint: "bg-mint",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer
        bg-card/80 rounded-2xl p-4
        border ${variantStyles[variant]}
        transition-all duration-300
      `}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className={`inline-flex p-2.5 rounded-xl bg-muted/30 ${iconColors[variant]}`}>
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
          <div className="w-full h-1.5 rounded-full bg-muted/30 mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
              className={`h-full rounded-full ${progressColors[variant]}`}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
