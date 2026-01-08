import { motion, AnimatePresence } from "framer-motion";
import { Check, Brain, Flame, Moon, Dumbbell, Heart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealFeedback } from "@/types/diet";
import { cn } from "@/lib/utils";

interface MealFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: MealFeedback | null;
  recipeName?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Flame,
  Moon,
  Dumbbell,
  Heart,
  Activity,
};

const MealFeedbackModal = ({ 
  isOpen, 
  onClose, 
  feedback,
  recipeName 
}: MealFeedbackModalProps) => {
  if (!feedback) return null;

  const IconComponent = iconMap[feedback.icon] || Activity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] max-w-md mx-auto glass-card rounded-3xl overflow-hidden"
          >
            {/* Success header */}
            <div className="bg-gradient-to-br from-mint/30 to-mint/10 p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className="w-16 h-16 rounded-full bg-mint/30 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-mint" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground mb-1"
              >
                Refeição Concluída
              </motion.p>
              
              {recipeName && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display font-bold text-foreground"
                >
                  {recipeName}
                </motion.p>
              )}
            </div>

            {/* Feedback content */}
            <div className="p-6 space-y-4">
              {/* Title with icon */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-coral" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {feedback.title}
                </h3>
              </motion.div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-foreground leading-relaxed"
              >
                {feedback.message}
              </motion.p>

              {/* Body process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-muted rounded-xl p-4"
              >
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  🔬 O que está acontecendo no seu corpo:
                </p>
                <p className="text-sm text-foreground">
                  {feedback.bodyProcess}
                </p>
              </motion.div>

              {/* Timeframe */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-mint font-medium text-center"
              >
                ⏱️ {feedback.timeframe}
              </motion.p>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full gradient-coral text-primary-foreground font-semibold py-5"
                >
                  Entendi
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MealFeedbackModal;
