import { motion, AnimatePresence } from "framer-motion";
import { getExerciseInfo } from "@/data/exerciseData";

interface ExerciseImageProps {
  exerciseName: string;
  isExpanded: boolean;
}

const ExerciseImage = ({ exerciseName, isExpanded }: ExerciseImageProps) => {
  const exercise = getExerciseInfo(exerciseName);
  
  if (!exercise) return null;

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
          <div className="pt-3 pb-1 space-y-2">
            {/* Muscle groups badges */}
            <div className="flex flex-wrap gap-1 mb-2">
              {exercise.muscleGroups.map((muscle, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint/20 text-mint"
                >
                  {muscle}
                </span>
              ))}
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
