import { motion } from "framer-motion";
import { Play, Clock, Flame } from "lucide-react";
import { useState } from "react";

interface WorkoutDay {
  day: number;
  title: string;
  duration: string;
  calories: number;
  intensity: "Leve" | "Médio" | "Intenso";
  completed: boolean;
}

const workoutDays: WorkoutDay[] = [
  { day: 1, title: "Adaptação Cardio", duration: "25 min", calories: 180, intensity: "Leve", completed: true },
  { day: 2, title: "Core & Mobilidade", duration: "30 min", calories: 200, intensity: "Leve", completed: true },
  { day: 3, title: "Full Body Básico", duration: "35 min", calories: 250, intensity: "Leve", completed: true },
  { day: 4, title: "HIIT Iniciante", duration: "20 min", calories: 220, intensity: "Médio", completed: false },
  { day: 5, title: "Força Inferior", duration: "40 min", calories: 300, intensity: "Médio", completed: false },
  { day: 6, title: "Recuperação Ativa", duration: "20 min", calories: 120, intensity: "Leve", completed: false },
  { day: 7, title: "Cardio Funcional", duration: "35 min", calories: 280, intensity: "Médio", completed: false },
];

const WorkoutCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(3);

  const intensityColors = {
    Leve: "text-mint",
    Médio: "text-gold",
    Intenso: "text-coral",
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="font-display text-xl font-bold text-foreground">
          Treinos da Semana
        </h2>
        <span className="text-sm text-muted-foreground">
          {workoutDays.filter(d => d.completed).length}/21 completos
        </span>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 px-4" style={{ width: "max-content" }}>
          {workoutDays.map((workout, index) => {
            const isActive = index === activeIndex;
            const isCompleted = workout.completed;

            return (
              <motion.div
                key={workout.day}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(index)}
                className={`
                  relative w-48 rounded-2xl overflow-hidden cursor-pointer
                  transition-all duration-300
                  ${isActive ? "ring-2 ring-coral shadow-glow-coral" : ""}
                  ${isCompleted ? "opacity-80" : ""}
                `}
              >
                {/* Card Background */}
                <div className={`
                  absolute inset-0 
                  ${isActive ? "gradient-card" : "bg-card"}
                `} />

                {/* Content */}
                <div className="relative p-4">
                  {/* Day Badge */}
                  <div className={`
                    inline-flex items-center justify-center
                    w-10 h-10 rounded-xl mb-3
                    ${isCompleted ? "bg-mint/20 text-mint" : "bg-coral/20 text-coral"}
                    font-display font-bold
                  `}>
                    {workout.day}
                  </div>

                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 rounded-full bg-mint flex items-center justify-center">
                        <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <h3 className="font-display font-semibold text-foreground mb-2 text-sm">
                    {workout.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{workout.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={12} />
                      <span>{workout.calories} kcal</span>
                    </div>
                  </div>

                  <div className={`text-xs font-medium ${intensityColors[workout.intensity]}`}>
                    {workout.intensity}
                  </div>

                  {isActive && !isCompleted && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 w-full gradient-coral text-primary-foreground py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Play size={16} fill="currentColor" />
                      Iniciar Treino
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCarousel;
