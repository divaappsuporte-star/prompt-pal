import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import RankingCard, { NetworkNode, DailyStatus, TodayCompleted } from "./RankingCard";

interface NeuralNetworkProps {
  currentUserProgress?: number;
  currentUserDay?: number;
}

// Calculate daily status based on completed tasks
const calculateDailyStatus = (completed: TodayCompleted): DailyStatus => {
  const count = Object.values(completed).filter(Boolean).length;
  if (count === 5) return 'elite';
  if (count >= 3) return 'emerging';
  return 'critical';
};

// Mock competitors data - will be replaced with Supabase data
const generateMockCompetitors = (): NetworkNode[] => {
  const competitors: Omit<NetworkNode, 'dailyStatus'>[] = [
    { 
      id: "1", name: "João Silva", showName: true, progress: 95, currentDay: 20, x: 280, y: 60,
      todayCompleted: { workout: true, nutrition: true, hydration: true, sleep: true, mindset: true }
    },
    { 
      id: "2", name: "Maria Santos", showName: true, progress: 88, currentDay: 18, x: 180, y: 40,
      todayCompleted: { workout: true, nutrition: true, hydration: true, sleep: true, mindset: true }
    },
    { 
      id: "3", name: "Pedro Lima", showName: false, progress: 82, currentDay: 17, x: 100, y: 80,
      todayCompleted: { workout: true, nutrition: true, hydration: true, sleep: false, mindset: true }
    },
    { 
      id: "4", name: "Ana Costa", showName: true, progress: 76, currentDay: 16, x: 320, y: 120,
      todayCompleted: { workout: true, nutrition: true, hydration: false, sleep: true, mindset: false }
    },
    { 
      id: "5", name: "Lucas Oliveira", showName: true, progress: 71, currentDay: 15, x: 60, y: 140,
      todayCompleted: { workout: true, nutrition: false, hydration: true, sleep: false, mindset: true }
    },
    { 
      id: "6", name: "Carla Souza", showName: false, progress: 65, currentDay: 14, x: 240, y: 160,
      todayCompleted: { workout: false, nutrition: true, hydration: true, sleep: false, mindset: false }
    },
    { 
      id: "7", name: "Rafael Mendes", showName: true, progress: 58, currentDay: 12, x: 140, y: 180,
      todayCompleted: { workout: true, nutrition: false, hydration: false, sleep: false, mindset: false }
    },
    { 
      id: "8", name: "Julia Ferreira", showName: true, progress: 52, currentDay: 11, x: 300, y: 190,
      todayCompleted: { workout: false, nutrition: true, hydration: false, sleep: false, mindset: false }
    },
    { 
      id: "9", name: "Bruno Alves", showName: false, progress: 45, currentDay: 9, x: 80, y: 200,
      todayCompleted: { workout: false, nutrition: false, hydration: true, sleep: false, mindset: false }
    },
    { 
      id: "10", name: "Fernanda Rocha", showName: true, progress: 38, currentDay: 8, x: 220, y: 210,
      todayCompleted: { workout: false, nutrition: false, hydration: false, sleep: true, mindset: false }
    },
    // Extra nodes outside initial view
    { 
      id: "11", name: "Carlos Neto", showName: true, progress: 92, currentDay: 19, x: 380, y: 30,
      todayCompleted: { workout: true, nutrition: true, hydration: true, sleep: true, mindset: true }
    },
    { 
      id: "12", name: "Beatriz Lopes", showName: false, progress: 62, currentDay: 13, x: -20, y: 100,
      todayCompleted: { workout: true, nutrition: true, hydration: false, sleep: false, mindset: true }
    },
    { 
      id: "13", name: "Diego Santos", showName: true, progress: 28, currentDay: 6, x: 350, y: 220,
      todayCompleted: { workout: false, nutrition: false, hydration: false, sleep: false, mindset: true }
    },
    { 
      id: "14", name: "Larissa Lima", showName: true, progress: 85, currentDay: 17, x: 400, y: 150,
      todayCompleted: { workout: true, nutrition: true, hydration: true, sleep: true, mindset: false }
    },
  ];

  return competitors.map(c => ({
    ...c,
    dailyStatus: calculateDailyStatus(c.todayCompleted)
  }));
};

const NeuralNetwork = ({ currentUserProgress = 45, currentUserDay = 7 }: NeuralNetworkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  
  const canvasDragX = useMotionValue(0);
  const canvasDragY = useMotionValue(0);

  useEffect(() => {
    const mockNodes = generateMockCompetitors();
    
    // User's completed tasks (would come from progress service)
    const userCompleted: TodayCompleted = {
      workout: false,
      nutrition: true,
      hydration: true,
      sleep: false,
      mindset: true
    };
    
    const userNode: NetworkNode = {
      id: "you",
      name: "Você",
      showName: true,
      progress: currentUserProgress,
      currentDay: currentUserDay,
      x: 180,
      y: 120,
      isUser: true,
      dailyStatus: calculateDailyStatus(userCompleted),
      todayCompleted: userCompleted
    };
    
    const allNodes = [...mockNodes, userNode].sort((a, b) => b.progress - a.progress);
    setNodes(allNodes);
    
    // Initialize positions
    const positions = new Map<string, { x: number; y: number }>();
    [...mockNodes, userNode].forEach(n => positions.set(n.id, { x: n.x, y: n.y }));
    setNodePositions(positions);
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

  const handleNodeDrag = (nodeId: string, offsetX: number, offsetY: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setNodePositions(prev => {
      const newPositions = new Map(prev);
      newPositions.set(nodeId, { 
        x: node.x + offsetX, 
        y: node.y + offsetY 
      });
      
      // Apply subtle spring effect to connected nodes
      connections
        .filter(c => c.from.id === nodeId || c.to.id === nodeId)
        .forEach(conn => {
          const connectedId = conn.from.id === nodeId ? conn.to.id : conn.from.id;
          const connectedNode = nodes.find(n => n.id === connectedId);
          if (connectedNode) {
            const current = prev.get(connectedId) || { x: connectedNode.x, y: connectedNode.y };
            newPositions.set(connectedId, {
              x: current.x + offsetX * 0.03,
              y: current.y + offsetY * 0.03
            });
          }
        });
      
      return newPositions;
    });
  };

  const handleNodeDragEnd = (nodeId: string) => {
    // Reset all nodes to original positions
    setNodePositions(prev => {
      const newPositions = new Map(prev);
      nodes.forEach(n => {
        newPositions.set(n.id, { x: n.x, y: n.y });
      });
      return newPositions;
    });
  };

  const getNodeColor = (status: DailyStatus, isUser: boolean) => {
    const colors = {
      critical: 'bg-red-500/40 border border-red-400/60',
      emerging: 'bg-amber-500/40 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]',
      elite: 'bg-emerald-500/50 border border-emerald-400/70 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
    };
    
    const base = colors[status];
    return isUser ? `${base} ring-2 ring-white/50` : base;
  };

  // Generate connections between nearby nodes
  const generateConnections = () => {
    const connections: { from: NetworkNode; to: NetworkNode; opacity: number }[] = [];
    
    nodes.forEach((nodeA, i) => {
      nodes.slice(i + 1).forEach((nodeB) => {
        const posA = nodePositions.get(nodeA.id) || { x: nodeA.x, y: nodeA.y };
        const posB = nodePositions.get(nodeB.id) || { x: nodeB.x, y: nodeB.y };
        const distance = Math.sqrt(
          Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2)
        );
        if (distance < 150) {
          connections.push({
            from: nodeA,
            to: nodeB,
            opacity: Math.max(0.05, 0.15 - distance / 1000),
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
      className="absolute inset-0 overflow-hidden"
      onClick={() => setSelectedNode(null)}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-zinc-800/10" />
      
      <motion.div
        drag
        dragConstraints={{ left: -200, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        style={{ x: canvasDragX, y: canvasDragY }}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {connections.map((conn, idx) => {
            const fromPos = nodePositions.get(conn.from.id) || { x: conn.from.x, y: conn.from.y };
            const toPos = nodePositions.get(conn.to.id) || { x: conn.to.x, y: conn.to.y };
            
            return (
              <motion.line
                key={idx}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={{ opacity: conn.opacity }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </svg>

        {/* Network nodes */}
        {nodes.map((node, idx) => {
          const pos = nodePositions.get(node.id) || { x: node.x, y: node.y };
          const size = 16;
          
          return (
            <motion.div
              key={node.id}
              drag
              dragElastic={0.3}
              dragMomentum={false}
              onDrag={(_, info) => handleNodeDrag(node.id, info.offset.x, info.offset.y)}
              onDragEnd={() => handleNodeDragEnd(node.id)}
              className={`absolute rounded-full cursor-pointer ${getNodeColor(node.dailyStatus, !!node.isUser)}`}
              style={{
                width: size,
                height: size,
                left: pos.x - size / 2,
                top: pos.y - size / 2,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                left: pos.x - size / 2,
                top: pos.y - size / 2,
              }}
              transition={{
                opacity: { duration: 0.5, delay: idx * 0.03 },
                left: { type: "spring", stiffness: 200, damping: 20 },
                top: { type: "spring", stiffness: 200, damping: 20 },
              }}
              whileHover={{ scale: 1.4 }}
              whileDrag={{ scale: 1.3, zIndex: 50 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleNodeClick(node, e)}
            >
              {node.isUser && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/40"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}

        {/* Floating particles - more subtle */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15],
              y: [0, Math.random() * 30 - 15],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span>Precisa melhorar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span>Quase lá</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span>100% hoje</span>
        </div>
      </motion.div>

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
