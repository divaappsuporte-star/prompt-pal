import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const Logo = ({ size = "md", showTagline = false }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const zapSizes = {
    sm: 14,
    md: 20,
    lg: 32,
  };

  return (
    <div className="flex flex-col">
      <h1 className={`font-display font-bold ${sizeClasses[size]} flex items-center`}>
        <span className="text-foreground">re</span>
        <motion.span
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="inline-flex items-center justify-center text-coral"
        >
          <Zap 
            size={zapSizes[size]} 
            className="fill-coral stroke-coral -mx-0.5" 
            strokeWidth={2.5}
          />
        </motion.span>
        <span className="text-foreground">et</span>
        <span className="text-gradient-coral">fit</span>
        <span className="text-foreground">21</span>
      </h1>
      {showTagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground mt-0.5"
        >
          Transforme em 21 dias
        </motion.p>
      )}
    </div>
  );
};

export default Logo;
