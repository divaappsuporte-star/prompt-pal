import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Flame, Moon, Dumbbell, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyFeedback, MealFeedback } from "@/types/diet";

interface BodyStatusCardProps {
  feedbacks: DailyFeedback[];
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Flame,
  Moon,
  Dumbbell,
  Heart,
  Activity,
};

const BodyStatusCard = ({ feedbacks, className }: BodyStatusCardProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Get today's feedbacks only
  const todayFeedbacks = feedbacks.filter(f => {
    const today = new Date().toDateString();
    return new Date(f.received_at).toDateString() === today;
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (todayFeedbacks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("glass-card rounded-2xl p-5", className)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-mint" />
          </div>
          <h3 className="font-display font-bold text-foreground">
            Como Seu Corpo Está Atualmente
          </h3>
        </div>
        
        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm">
            Complete suas refeições para ver o status do seu corpo
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Cada refeição concluída revelará o que está acontecendo no seu organismo
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card rounded-2xl p-5", className)}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-mint" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">
            Como Seu Corpo Está Atualmente
          </h3>
          <p className="text-xs text-muted-foreground">
            {todayFeedbacks.length} processo{todayFeedbacks.length > 1 ? 's' : ''} ativo{todayFeedbacks.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {todayFeedbacks.map((item, idx) => {
          const IconComponent = iconMap[item.feedback.icon] || Activity;
          const itemId = `${item.day}-${item.meal_type}-${idx}`;
          const isExpanded = expandedId === itemId;

          return (
            <motion.div
              key={itemId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-muted/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(itemId)}
                className="w-full p-3 flex items-center gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-4 h-4 text-coral" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {item.feedback.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(item.received_at)}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3"
                  >
                    <div className="pt-2 border-t border-border space-y-3">
                      <p className="text-sm text-foreground">
                        {item.feedback.message}
                      </p>
                      
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          O que está acontecendo:
                        </p>
                        <p className="text-sm text-foreground">
                          {item.feedback.bodyProcess}
                        </p>
                      </div>

                      <p className="text-xs text-mint font-medium">
                        ⏱️ {item.feedback.timeframe}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BodyStatusCard;
