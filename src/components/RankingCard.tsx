import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, TrendingUp, X } from "lucide-react";

export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  name: string;
  progress: number;
  rank: number;
  currentDay: number;
  isUser?: boolean;
}

interface RankingCardProps {
  node: NetworkNode | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const RankingCard = ({ node, position, onClose }: RankingCardProps) => {
  if (!node) return null;

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Crown className="w-5 h-5 text-gold fill-gold" />;
    if (rank <= 10) return <Star className="w-5 h-5 text-coral fill-coral" />;
    return <TrendingUp className="w-5 h-5 text-mint" />;
  };

  const getRankColor = (rank: number) => {
    if (rank <= 3) return "text-gold";
    if (rank <= 10) return "text-coral";
    return "text-mint";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="absolute z-50 glass-card rounded-xl p-4 min-w-[180px] shadow-elevated"
        style={{
          left: Math.min(position.x, window.innerWidth - 220),
          top: position.y + 20,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          {getRankIcon(node.rank)}
          <span className={`font-display font-bold text-lg ${getRankColor(node.rank)}`}>
            #{node.rank}
          </span>
        </div>

        <h3 className="font-semibold text-foreground mb-2">
          {node.name} {node.isUser && <span className="text-coral">(Você)</span>}
        </h3>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{node.progress}%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${node.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full gradient-coral rounded-full"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Dia {node.currentDay} de 21
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RankingCard;
