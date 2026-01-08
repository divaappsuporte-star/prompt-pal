import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-banner.jpg";

interface HeroBannerProps {
  userName?: string;
  currentDay: number;
}

const HeroBanner = ({ userName = "Atleta", currentDay }: HeroBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-56 rounded-3xl overflow-hidden mx-4 mt-4 shadow-elevated"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Reset 21 Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Olá, {userName}</p>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Dia <span className="text-gradient-coral">{currentDay}</span> de 21
          </h1>
          <p className="text-sm text-gold flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse-soft" />
            Você está no ritmo certo!
          </p>
        </motion.div>

        {/* Day Progress */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30"
        >
          <div
            className="h-full gradient-coral origin-left"
            style={{ width: `${(currentDay / 21) * 100}%` }}
          />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="glass-card px-3 py-1.5 rounded-full"
        >
          <span className="text-xs font-medium text-foreground">
            🔥 {currentDay} dias seguidos
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
