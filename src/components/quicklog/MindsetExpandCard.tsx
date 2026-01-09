import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

interface MindsetExpandCardProps {
  isCompleted: boolean;
}

const MINDSET_CHAPTERS = [
  "Ressignificando a Fome",
  "O Poder do Hábito",
  "Dopamina e Recompensa",
  "Neuroplasticidade",
  "Mindful Eating",
  "Gatilhos Emocionais",
  "Autocontrole",
  "Visualização",
  "Afirmações Positivas",
  "Mentalidade de Crescimento",
];

const MindsetExpandCard = ({ isCompleted }: MindsetExpandCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { progress, completeMindset } = useProgress();

  const completedChapters = progress.mindset.completedChapters || [];
  const nextChapter = completedChapters.length + 1;
  const hasCompletedToday = completedChapters.length > 0;

  const handleCompleteChapter = () => {
    if (nextChapter <= MINDSET_CHAPTERS.length) {
      completeMindset(nextChapter);
    }
  };

  return (
    <motion.div
      className={`rounded-xl border transition-all overflow-hidden ${
        isCompleted 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : 'bg-muted/50 border-border'
      }`}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3"
      >
        {/* Status Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-emerald-500' : 'bg-purple-500/20'
        }`}>
          {isCompleted ? (
            <Check size={16} className="text-white" />
          ) : (
            <Brain size={16} className="text-purple-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <p className={`font-medium ${isCompleted ? 'text-emerald-400' : 'text-foreground'}`}>
            Mentalidade
          </p>
          <p className="text-xs text-muted-foreground">
            {completedChapters.length}/{MINDSET_CHAPTERS.length} capítulos
          </p>
        </div>

        {/* Expand Icon */}
        {isExpanded ? (
          <ChevronUp size={18} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={18} className="text-muted-foreground" />
        )}
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {nextChapter <= MINDSET_CHAPTERS.length ? (
                <>
                  {/* Next Chapter Info */}
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={14} className="text-purple-400" />
                      <span className="text-xs text-purple-400 font-medium">
                        Próximo Capítulo
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Cap. {nextChapter}: {MINDSET_CHAPTERS[nextChapter - 1]}
                    </p>
                  </div>

                  {/* Mark Complete Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCompleteChapter}
                    className="w-full py-2.5 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Marcar como lido
                  </motion.button>
                </>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <Check size={24} className="text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-emerald-400">
                    Todos os capítulos concluídos!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MindsetExpandCard;