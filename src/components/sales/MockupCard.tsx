import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockupCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  tag?: string;
  tagColor?: "coral" | "gold" | "mint";
  color: "coral" | "gold" | "mint";
  locked?: boolean;
  progress?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const MockupCard = ({
  icon: Icon,
  title,
  subtitle,
  tag,
  tagColor = "coral",
  color,
  locked = false,
  progress,
  className,
  size = "md"
}: MockupCardProps) => {
  const colorClasses = {
    coral: {
      bg: "from-coral/15 to-coral/5",
      border: "border-coral/20",
      iconBg: "bg-coral/20",
      iconText: "text-coral",
      progressBg: "bg-coral",
    },
    gold: {
      bg: "from-gold/15 to-gold/5",
      border: "border-gold/20",
      iconBg: "bg-gold/20",
      iconText: "text-gold",
      progressBg: "bg-gold",
    },
    mint: {
      bg: "from-mint/15 to-mint/5",
      border: "border-mint/20",
      iconBg: "bg-mint/20",
      iconText: "text-mint",
      progressBg: "bg-mint",
    },
  };

  const tagColors = {
    coral: "bg-coral/20 text-coral",
    gold: "bg-gold/20 text-gold",
    mint: "bg-mint/20 text-mint",
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconInnerSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-gradient-to-br transition-all",
        colors.bg,
        colors.border,
        sizeClasses[size],
        locked && "opacity-60",
        className
      )}
    >
      {/* Progress bar */}
      {progress !== undefined && progress > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-2xl overflow-hidden">
          <div
            className={cn("h-full transition-all", colors.progressBg)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Tag */}
        {tag && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full mb-2",
            tagColors[tagColor]
          )}>
            {tag}
          </span>
        )}

        {/* Icon */}
        <div className={cn(
          "rounded-xl flex items-center justify-center mb-3",
          iconSizes[size],
          colors.iconBg
        )}>
          <Icon className={cn(iconInnerSizes[size], colors.iconText)} />
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-foreground text-sm mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Locked overlay */}
      {locked && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockupCard;
