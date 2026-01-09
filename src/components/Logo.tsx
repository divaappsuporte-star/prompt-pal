import { motion } from "framer-motion";
import nutri21Logo from "@/assets/nutri21-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

const Logo = ({ size = "md", showTagline = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-14",
    md: "h-20",
    lg: "h-28",
  };

  return (
    <div className="flex flex-col">
      <motion.img
        src={nutri21Logo}
        alt="Nutri21"
        className={`${sizeClasses[size]} w-auto select-none pointer-events-none`}
        draggable={false}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      />
      {showTagline && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-muted-foreground mt-0.5 tracking-wide"
        >
          Transforme em 21 dias
        </motion.p>
      )}
    </div>
  );
};

export default Logo;
