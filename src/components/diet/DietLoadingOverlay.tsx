import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Beef, Salad, Leaf, Flame, GlassWater, Clock, LucideIcon } from "lucide-react";
import { DietInfo, DietType } from "@/types/diet";
import { cn } from "@/lib/utils";

// Icon mapping for each diet type
const DIET_ICONS: Record<DietType, LucideIcon> = {
  carnivore: Beef,
  keto: Salad,
  lowcarb: Leaf,
  metabolic: Flame,
  detox: GlassWater,
  fasting: Clock,
};

interface DietLoadingOverlayProps {
  isOpen: boolean;
  diet: DietInfo | null;
  targetKgLoss: number;
  onComplete: () => void;
}

interface LoadingStep {
  id: string;
  label: string;
  progress: number;
  completed: boolean;
}

const DietLoadingOverlay = ({ 
  isOpen, 
  diet, 
  targetKgLoss,
  onComplete 
}: DietLoadingOverlayProps) => {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: "profile", label: "Analisando seu perfil", progress: 0, completed: false },
    { id: "goal", label: `Configurando meta de -${targetKgLoss}kg`, progress: 0, completed: false },
    { id: "recipes", label: "Gerando combinação de receitas", progress: 0, completed: false },
    { id: "protocol", label: "Criando protocolo personalizado", progress: 0, completed: false },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [chartData, setChartData] = useState<{ day: number; weight: number }[]>([]);

  // Generate chart data for weight projection
  useEffect(() => {
    if (!isOpen) return;
    
    const startWeight = 80; // Placeholder
    const data = [];
    for (let i = 0; i <= 21; i++) {
      const loss = (targetKgLoss / 21) * i;
      data.push({
        day: i,
        weight: startWeight - loss + (Math.random() * 0.5 - 0.25),
      });
    }
    setChartData(data);
  }, [isOpen, targetKgLoss]);

  // Animate progress
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setSteps(prev => prev.map(s => ({ ...s, progress: 0, completed: false })));
      return;
    }

    const interval = setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        const current = newSteps[currentStep];
        
        if (!current) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return prev;
        }

        if (current.progress < 100) {
          current.progress = Math.min(current.progress + Math.random() * 15 + 5, 100);
        }
        
        if (current.progress >= 100 && !current.completed) {
          current.completed = true;
          if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            clearInterval(interval);
            setTimeout(onComplete, 800);
          }
        }
        
        return newSteps;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, currentStep, onComplete]);

  // Update goal label when targetKgLoss changes
  useEffect(() => {
    setSteps(prev => prev.map(s => 
      s.id === "goal" 
        ? { ...s, label: `Configurando meta de -${targetKgLoss}kg` }
        : s
    ));
  }, [targetKgLoss]);

  const colorClasses = {
    coral: {
      bg: "from-coral/30 via-coral/10 to-background",
      accent: "text-coral",
      bar: "bg-coral",
      chart: "#F97316",
    },
    mint: {
      bg: "from-mint/30 via-mint/10 to-background",
      accent: "text-mint",
      bar: "bg-mint",
      chart: "#10B981",
    },
    gold: {
      bg: "from-gold/30 via-gold/10 to-background",
      accent: "text-gold",
      bar: "bg-gold",
      chart: "#F59E0B",
    },
  };

  const colors = diet ? colorClasses[diet.color as keyof typeof colorClasses] : colorClasses.coral;

  return (
    <AnimatePresence>
      {isOpen && diet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }} />
          </div>

          <div className="relative z-10 w-full max-w-md px-6 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              {(() => {
                const IconComponent = DIET_ICONS[diet.key];
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4",
                      diet.color === 'coral' && "bg-coral/20",
                      diet.color === 'mint' && "bg-mint/20",
                      diet.color === 'gold' && "bg-gold/20"
                    )}
                  >
                    <IconComponent className={cn(
                      "w-10 h-10",
                      diet.color === 'coral' && "text-coral",
                      diet.color === 'mint' && "text-mint",
                      diet.color === 'gold' && "text-gold"
                    )} />
                  </motion.div>
                );
              })()}
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                {diet.name}
              </h2>
              <p className={cn("text-lg font-semibold", colors.accent)}>
                Meta: -{targetKgLoss}kg em 21 dias
              </p>
            </motion.div>

            {/* Weight projection chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-4"
            >
              <p className="text-xs text-muted-foreground mb-2 text-center">
                Projeção de Perda de Peso
              </p>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.chart} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={colors.chart} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke={colors.chart}
                      strokeWidth={2}
                      fill="url(#weightGradient)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Dia 1</span>
                <span>Dia 21</span>
              </div>
            </motion.div>

            {/* Loading steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "text-sm font-medium transition-colors",
                      step.completed ? colors.accent : "text-foreground"
                    )}>
                      {step.label}
                    </span>
                    <span className={cn(
                      "text-sm font-bold",
                      step.completed ? colors.accent : "text-muted-foreground"
                    )}>
                      {Math.round(step.progress)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.progress}%` }}
                      transition={{ duration: 0.3 }}
                      className={cn("h-full rounded-full", colors.bar)}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Preparing message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center text-sm text-muted-foreground"
            >
              Preparando seu plano personalizado...
            </motion.p>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  x: Math.random() * 100 - 50,
                  y: "100%"
                }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  y: "-100%"
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className={cn(
                  "absolute w-2 h-2 rounded-full",
                  colors.bar
                )}
                style={{ left: `${15 + i * 15}%` }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DietLoadingOverlay;
