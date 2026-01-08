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

  const numberSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };

  const zapSizes = {
    sm: 12,
    md: 16,
    lg: 24,
  };

  return (
    <div className="flex flex-col">
      <h1 className={`font-display font-bold ${sizeClasses[size]} flex items-center tracking-tight`}>
        <span className="text-coral">Nutri</span>
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
          className={`${numberSizes[size]} font-black text-foreground ml-0.5 flex items-center`}
        >
          21
          <motion.span
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.2 }}
            className="inline-flex ml-0.5"
          >
            <Zap 
              size={zapSizes[size]} 
              strokeWidth={2.5}
              fill="hsl(var(--coral))"
              stroke="hsl(var(--coral))"
            />
          </motion.span>
        </motion.span>
      </h1>
      {showTagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground mt-0.5 tracking-wide"
        >
          Transforme em 21 dias
        </motion.p>
      )}
    </div>
  );
};

export default Logo;
