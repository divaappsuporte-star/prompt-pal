import { motion, AnimatePresence } from "framer-motion";
import { getExerciseInfo } from "@/data/exerciseData";
import { useState } from "react";

interface ExerciseImageProps {
  exerciseName: string;
  isExpanded: boolean;
}

const ExerciseImage = ({ exerciseName, isExpanded }: ExerciseImageProps) => {
  const exercise = getExerciseInfo(exerciseName);
  const [imageError, setImageError] = useState(false);
  
  if (!exercise) return null;

  // Placeholder image with exercise initials
  const getPlaceholderBg = (name: string) => {
    const colors = [
      "from-coral/30 to-coral/10",
      "from-gold/30 to-gold/10", 
      "from-mint/30 to-mint/10",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-3 pb-1 space-y-3">
            {/* Exercise Image or Placeholder */}
            <div className="relative rounded-xl overflow-hidden">
              {!imageError ? (
                <img
                  src={exercise.imageUrl}
                  alt={exercise.name}
                  className="w-full h-40 object-cover rounded-xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div 
                  className={`w-full h-40 bg-gradient-to-br ${getPlaceholderBg(exercise.name)} rounded-xl flex flex-col items-center justify-center border border-white/10`}
                >
                  <div className="text-4xl font-bold text-white/30">
                    {exercise.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <p className="text-xs text-white/40 mt-2">{exercise.description}</p>
                </div>
              )}
              
              {/* Muscle groups badges */}
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {exercise.muscleGroups.slice(0, 3).map((muscle, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white/80 backdrop-blur-sm"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1">
                <span>📋</span> Como fazer
              </p>
              <div className="space-y-1">
                {exercise.instructions.map((instruction, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-mint/20 text-mint text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed">{instruction}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExerciseImage;
