import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WorkoutCarousel from "@/components/WorkoutCarousel";

const Treino = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-4"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </motion.button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Treinos
            </h1>
            <p className="text-sm text-muted-foreground">
              Escolha seu treino do dia
            </p>
          </div>
        </div>
      </motion.header>

      {/* Workout Content */}
      <WorkoutCarousel />
    </div>
  );
};

export default Treino;
