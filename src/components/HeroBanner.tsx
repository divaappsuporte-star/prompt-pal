import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { Brain, Apple, Dumbbell } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface HeroBannerProps {
  userName?: string;
  currentDay: number;
}

const HeroBanner = ({ userName = "Atleta", currentDay }: HeroBannerProps) => {
  const { progress, overallProgress } = useProgress();

  // Calculate individual progress
  const mindsetProgress = Math.round((progress.mindset.completedChapters.length / 10) * 100);
  const workoutProgress = Math.round((progress.workouts.completedSessions.length / 21) * 100);
  
  const nutritionTotal = Object.values(progress.nutrition).reduce((acc, diet) => {
    return acc + diet.completedChapters.length;
  }, 0);
  const nutritionProgress = Math.round((nutritionTotal / 25) * 100);

  // Pie chart data
  const pieData = [
    { name: "Mentalidade", value: mindsetProgress || 5, color: "hsl(40, 90%, 65%)" },
    { name: "Nutrição", value: nutritionProgress || 5, color: "hsl(145, 45%, 65%)" },
    { name: "Treino", value: workoutProgress || 5, color: "hsl(0, 85%, 65%)" },
  ];

  const pillars = [
    { icon: Brain, label: "Mente", value: mindsetProgress, color: "text-gold", bg: "bg-gold" },
    { icon: Apple, label: "Nutrição", value: nutritionProgress, color: "text-mint", bg: "bg-mint" },
    { icon: Dumbbell, label: "Treino", value: workoutProgress, color: "text-coral", bg: "bg-coral" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-4 mb-4"
    >
      <div className="bg-card/60 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          {/* Pie Chart */}
          <div className="w-24 h-24 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={28}
                  outerRadius={42}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground">{overallProgress}%</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-2">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2"
              >
                <pillar.icon size={14} className={pillar.color} />
                <div className="flex-1">
                  <div className="w-full h-1.5 rounded-full bg-muted/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pillar.value}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                      className={`h-full rounded-full ${pillar.bg}`}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium ${pillar.color} w-8 text-right`}>
                  {pillar.value}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
