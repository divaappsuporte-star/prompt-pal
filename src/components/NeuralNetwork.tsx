import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Crown, Star, TrendingUp } from "lucide-react";
import RankingCard, { NetworkNode } from "./RankingCard";

interface NeuralNetworkProps {
  currentUserProgress?: number;
  currentUserDay?: number;
}

// Mock competitors data - will be replaced with Supabase data
const generateMockCompetitors = (): NetworkNode[] => [
  { id: "1", name: "João Silva", progress: 95, rank: 1, currentDay: 20, x: 280, y: 60 },
  { id: "2", name: "Maria Santos", progress: 88, rank: 2, currentDay: 18, x: 180, y: 40 },
  { id: "3", name: "Pedro Lima", progress: 82, rank: 3, currentDay: 17, x: 100, y: 80 },
  { id: "4", name: "Ana Costa", progress: 76, rank: 4, currentDay: 16, x: 320, y: 120 },
  { id: "5", name: "Lucas Oliveira", progress: 71, rank: 5, currentDay: 15, x: 60, y: 140 },
  { id: "6", name: "Carla Souza", progress: 65, rank: 6, currentDay: 14, x: 240, y: 160 },
  { id: "7", name: "Rafael Mendes", progress: 58, rank: 8, currentDay: 12, x: 140, y: 180 },
  { id: "8", name: "Julia Ferreira", progress: 52, rank: 9, currentDay: 11, x: 300, y: 190 },
  { id: "9", name: "Bruno Alves", progress: 45, rank: 10, currentDay: 9, x: 80, y: 200 },
  { id: "10", name: "Fernanda Rocha", progress: 38, rank: 11, currentDay: 8, x: 220, y: 210 },
];

const NeuralNetwork = ({ currentUserProgress = 45, currentUserDay = 7 }: NeuralNetworkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    const mockNodes = generateMockCompetitors();
    // Add current user to the network
    const userRank = mockNodes.filter(n => n.progress > currentUserProgress).length + 1;
    const userNode: NetworkNode = {
      id: "you",
      name: "Você",
      progress: currentUserProgress,
      rank: userRank,
      currentDay: currentUserDay,
      x: 180,
      y: 120,
      isUser: true,
    };
    
    // Sort by rank and set
    const allNodes = [...mockNodes, userNode].sort((a, b) => a.rank - b.rank);
    setNodes(allNodes);
  }, [currentUserProgress, currentUserDay]);

  const handleNodeClick = (node: NetworkNode, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCardPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setSelectedNode(node);
  };

  const getRankIcon = (rank: number, isUser: boolean) => {
    const baseClasses = isUser ? "drop-shadow-[0_0_8px_rgba(255,107,107,0.8)]" : "";
    if (rank <= 3) return <Crown className={`w-3 h-3 text-gold fill-gold ${baseClasses}`} />;
    if (rank <= 10) return <Star className={`w-3 h-3 text-coral fill-coral ${baseClasses}`} />;
    return <TrendingUp className={`w-3 h-3 text-mint ${baseClasses}`} />;
  };

  const getNodeColor = (rank: number, isUser: boolean) => {
    if (isUser) return "bg-coral shadow-[0_0_20px_rgba(255,107,107,0.6)]";
    if (rank <= 3) return "bg-gold/80";
    if (rank <= 10) return "bg-coral/60";
    return "bg-mint/50";
  };

  const getNodeSize = (rank: number) => {
    if (rank <= 3) return 20;
    if (rank <= 10) return 16;
    return 12;
  };

  // Generate connections between nearby nodes
  const generateConnections = () => {
    const connections: { from: NetworkNode; to: NetworkNode; opacity: number }[] = [];
    
    nodes.forEach((nodeA, i) => {
      nodes.slice(i + 1).forEach((nodeB) => {
        const distance = Math.sqrt(
          Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
        );
        if (distance < 150) {
          connections.push({
            from: nodeA,
            to: nodeB,
            opacity: Math.max(0.1, 1 - distance / 150),
          });
        }
      });
    });
    
    return connections;
  };

  const connections = generateConnections();

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={() => setSelectedNode(null)}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-coral/5" />
      
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
        dragElastic={0.1}
        style={{ x: dragX, y: dragY }}
        className="relative w-full h-full"
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--coral))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--gold))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--mint))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {connections.map((conn, idx) => (
            <motion.line
              key={idx}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke="url(#lineGradient)"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: conn.opacity,
              }}
              transition={{ 
                duration: 1.5, 
                delay: idx * 0.05,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2
              }}
            />
          ))}
        </svg>

        {/* Network nodes */}
        {nodes.map((node, idx) => {
          const size = getNodeSize(node.rank);
          
          return (
            <motion.div
              key={node.id}
              className={`absolute rounded-full flex items-center justify-center cursor-pointer ${getNodeColor(node.rank, !!node.isUser)}`}
              style={{
                width: size,
                height: size,
                left: node.x - size / 2,
                top: node.y - size / 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: 1,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                },
                opacity: { duration: 0.5, delay: idx * 0.05 }
              }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleNodeClick(node, e)}
            >
              {node.rank <= 10 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  {getRankIcon(node.rank, !!node.isUser)}
                </div>
              )}
              
              {node.isUser && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-coral"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-coral/30"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-4 text-xs text-muted-foreground flex items-center gap-1"
      >
        <span className="inline-block w-4 h-4 border border-muted-foreground/30 rounded"></span>
        Arraste para explorar • Toque nos pontos
      </motion.p>

      {/* Ranking Card */}
      <RankingCard
        node={selectedNode}
        position={cardPosition}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default NeuralNetwork;
