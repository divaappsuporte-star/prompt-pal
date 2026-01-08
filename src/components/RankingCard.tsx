import { motion, AnimatePresence } from "framer-motion";
import { X, Check, X as XIcon } from "lucide-react";

export type DailyStatus = 'critical' | 'emerging' | 'elite';

export interface TodayCompleted {
  workout: boolean;
  nutrition: boolean;
  hydration: boolean;
  sleep: boolean;
  mindset: boolean;
}

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  name: string;
  showName: boolean;
  progress: number;
  currentDay: number;
  isUser?: boolean;
  userId?: string;
  dailyStatus: DailyStatus;
  todayCompleted: TodayCompleted;
}

interface RankingCardProps {
  node: NetworkNode | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const RankingCard = ({ node, position, onClose }: RankingCardProps) => {
  if (!node) return null;

  const getStatusColor = (status: DailyStatus) => {
    switch (status) {
      case 'elite': return 'border-emerald-400/60';
      case 'emerging': return 'border-amber-400/60';
      case 'critical': return 'border-red-400/60';
    }
  };

  const getStatusLabel = (status: DailyStatus) => {
    switch (status) {
      case 'elite': return { text: '100% hoje', color: 'text-emerald-400' };
      case 'emerging': return { text: 'Quase lá', color: 'text-amber-400' };
      case 'critical': return { text: 'Precisa melhorar', color: 'text-red-400' };
    }
  };

  const completedCount = Object.values(node.todayCompleted).filter(Boolean).length;
  const completionPercent = Math.round((completedCount / 5) * 100);
  const statusLabel = getStatusLabel(node.dailyStatus);

  const tasks = [
    { key: 'workout', label: 'Treino' },
    { key: 'nutrition', label: 'Nutrição' },
    { key: 'hydration', label: 'Hidratação' },
    { key: 'sleep', label: 'Sono' },
    { key: 'mindset', label: 'Mentalidade' },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className={`absolute z-50 glass-card rounded-xl p-4 min-w-[200px] shadow-elevated border ${getStatusColor(node.dailyStatus)}`}
        style={{
          left: Math.min(position.x, window.innerWidth - 240),
          top: position.y + 20,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">
            {node.showName || node.isUser ? node.name : "Atleta Anônimo"}
            {node.isUser && <span className="text-coral ml-1">(Você)</span>}
          </h3>
          <span className="text-xs text-muted-foreground">
            Dia {node.currentDay}/21
          </span>
        </div>

        <div className="space-y-2 mb-3">
          {tasks.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {node.todayCompleted[key] ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <XIcon className="w-4 h-4 text-red-400/60" />
              )}
              <span className={node.todayCompleted[key] ? 'text-foreground' : 'text-muted-foreground'}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${statusLabel.color}`}>
              {statusLabel.text}
            </span>
            <span className="text-xs text-muted-foreground">
              {completionPercent}%
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RankingCard;
