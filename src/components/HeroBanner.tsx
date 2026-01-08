import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip
} from "recharts";

const HeroBanner = () => {
  const { profile } = useAuth();
  const { todayCalories, progress } = useProgress();

  const currentWeight = profile?.weight_kg || 70;
  const goalWeight = profile?.goal_weight_kg || 65;
  const weightToLose = Math.max(0, currentWeight - goalWeight);

  // Calculate total calories from completed sessions
  const totalCaloriesBurned = progress.workouts.completedSessions.reduce(
    (acc, session) => acc + session.caloriesBurned, 0
  );

  // Simulate progress data based on calories burned and activities
  const estimatedWeightLoss = (totalCaloriesBurned / 7700).toFixed(2); // 7700 kcal = 1kg
  const progressPercent = weightToLose > 0 
    ? Math.min(100, Math.round((parseFloat(estimatedWeightLoss) / weightToLose) * 100))
    : 0;

  // Weekly evolution data (simulated based on real progress)
  const weeklyData = [
    { day: "S", value: currentWeight },
    { day: "T", value: currentWeight - (parseFloat(estimatedWeightLoss) * 0.1) },
    { day: "Q", value: currentWeight - (parseFloat(estimatedWeightLoss) * 0.25) },
    { day: "Q", value: currentWeight - (parseFloat(estimatedWeightLoss) * 0.4) },
    { day: "S", value: currentWeight - (parseFloat(estimatedWeightLoss) * 0.6) },
    { day: "S", value: currentWeight - (parseFloat(estimatedWeightLoss) * 0.8) },
    { day: "D", value: currentWeight - parseFloat(estimatedWeightLoss) },
  ];

  // Calories distribution by activity
  const totalCalories = progress.workouts.completedSessions.reduce(
    (acc, session) => acc + session.caloriesBurned, 0
  );
  const caloriesData = [
    { name: "Tre", value: totalCalories || 0 },
    { name: "Nut", value: Math.round(totalCalories * 0.3) },
    { name: "Atv", value: Math.round(totalCalories * 0.15) },
  ];

  // Progress metrics
  const metricsData = [
    { name: "Sem1", progress: 20, target: 25 },
    { name: "Sem2", progress: 45, target: 50 },
    { name: "Sem3", progress: progressPercent, target: 75 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-2 mb-4"
    >
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-3 border border-primary/20 shadow-lg shadow-primary/5">
        {/* Grid de Infográficos */}
        <div className="grid grid-cols-3 gap-2">
          
          {/* Gráfico Principal - Evolução de Peso */}
          <div className="col-span-2 bg-background/60 rounded-xl p-2 border border-primary/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-primary font-mono uppercase tracking-wider">Evolução</span>
              <span className="text-[10px] text-muted-foreground">{currentWeight}kg → {goalWeight}kg</span>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#weightGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progresso Circular */}
          <div className="bg-background/60 rounded-xl p-2 border border-primary/10 flex flex-col items-center justify-center">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={150.8}
                  initial={{ strokeDashoffset: 150.8 }}
                  animate={{ strokeDashoffset: 150.8 - (150.8 * progressPercent) / 100 }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-primary">{progressPercent}%</span>
              </div>
            </div>
            <span className="text-[8px] text-muted-foreground mt-1 font-mono">META</span>
          </div>

          {/* Barras de Calorias */}
          <div className="bg-background/60 rounded-xl p-2 border border-primary/10">
            <span className="text-[10px] text-primary font-mono uppercase tracking-wider">Kcal</span>
            <div className="h-14 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caloriesData} barSize={10}>
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <span className="text-xs font-bold text-primary">-{totalCaloriesBurned}</span>
              <span className="text-[8px] text-muted-foreground ml-1">kcal</span>
            </div>
          </div>

          {/* Linha de Progresso Semanal */}
          <div className="bg-background/60 rounded-xl p-2 border border-primary/10">
            <span className="text-[10px] text-primary font-mono uppercase tracking-wider">Semanas</span>
            <div className="h-14 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsData}>
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Rápidos */}
          <div className="bg-background/60 rounded-xl p-2 border border-primary/10 flex flex-col justify-between">
            <span className="text-[10px] text-primary font-mono uppercase tracking-wider">Hoje</span>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-muted-foreground">Perdido</span>
                <span className="text-xs font-bold text-primary">{estimatedWeightLoss}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-muted-foreground">Treinos</span>
                <span className="text-xs font-bold text-foreground">{progress.workouts.completedSessions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-muted-foreground">Faltam</span>
                <span className="text-xs font-bold text-muted-foreground">{(weightToLose - parseFloat(estimatedWeightLoss)).toFixed(1)}kg</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
