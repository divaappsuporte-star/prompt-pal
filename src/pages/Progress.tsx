import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Apple, Dumbbell, Droplets, Moon, Flame, TrendingUp } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import BottomNavigation from "@/components/BottomNavigation";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from "recharts";

const Progress = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const { progress, overallProgress, todayHydration, todaySleep, todayCalories } = useProgress();

  // Calculate individual progress
  const mindsetProgress = Math.round((progress.mindset.completedChapters.length / 10) * 100);
  const workoutProgress = Math.round((progress.workouts.completedSessions.length / 21) * 100);
  
  const nutritionTotal = Object.values(progress.nutrition).reduce((acc, diet) => {
    return acc + diet.completedChapters.length;
  }, 0);
  const nutritionProgress = Math.round((nutritionTotal / 25) * 100);

  // Pie chart data
  const pieData = [
    { name: "Mentalidade", value: mindsetProgress || 5, color: "hsl(40, 100%, 75%)" },
    { name: "Nutrição", value: nutritionProgress || 5, color: "hsl(145, 50%, 80%)" },
    { name: "Treino", value: workoutProgress || 5, color: "hsl(0, 100%, 71%)" },
  ];

  // Weekly mock data for area chart
  const weeklyData = [
    { day: "Seg", value: 20 },
    { day: "Ter", value: 35 },
    { day: "Qua", value: 45 },
    { day: "Qui", value: 40 },
    { day: "Sex", value: 60 },
    { day: "Sáb", value: 75 },
    { day: "Dom", value: overallProgress },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate("/");
        break;
      case "treino":
        navigate("/treino");
        break;
      case "nutricao":
        navigate("/nutricao");
        break;
      case "mente":
        navigate("/mentalidade");
        break;
    }
  };

  const pillars = [
    { icon: Brain, label: "Mente", value: mindsetProgress, color: "text-gold", bg: "bg-gold" },
    { icon: Apple, label: "Nutrição", value: nutritionProgress, color: "text-mint", bg: "bg-mint" },
    { icon: Dumbbell, label: "Treino", value: workoutProgress, color: "text-coral", bg: "bg-coral" },
  ];

  const todayStats = [
    { icon: Droplets, value: `${(todayHydration / 1000).toFixed(1)}L`, label: "Água", color: "text-blue-400" },
    { icon: Moon, value: `${todaySleep}h`, label: "Sono", color: "text-purple-400" },
    { icon: Flame, value: todayCalories > 0 ? `-${todayCalories}` : "0", label: "kcal", color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-14 pb-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">Seu Progresso</h1>
        </div>
      </motion.header>

      {/* Main Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 mb-6"
      >
        <div className="bg-card/60 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            {/* Pie Chart */}
            <div className="w-32 h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
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
                <span className="text-2xl font-bold text-foreground">{overallProgress}%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 ml-6 space-y-3">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${pillar.bg}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground">{pillar.label}</span>
                      <span className={`text-sm font-semibold ${pillar.color}`}>{pillar.value}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted/30 mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pillar.value}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-full rounded-full ${pillar.bg}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 mb-6"
      >
        <div className="bg-card/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-coral" />
            <span className="text-sm font-medium text-foreground">Evolução Semanal</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 100%, 71%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 100%, 71%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(0, 0%, 65%)', fontSize: 11 }}
                />
                <YAxis hide domain={[0, 100]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(0, 100%, 71%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Today Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-6"
      >
        <div className="grid grid-cols-3 gap-3">
          {todayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-card/60 rounded-2xl p-4 text-center"
            >
              <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pillar Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4"
      >
        <div className="space-y-3">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-card/60 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl bg-muted/30`}>
                <pillar.icon size={24} className={pillar.color} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{pillar.label}</p>
                <div className="w-full h-2 rounded-full bg-muted/30 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pillar.value}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className={`h-full rounded-full ${pillar.bg}`}
                  />
                </div>
              </div>
              <span className={`text-lg font-bold ${pillar.color}`}>{pillar.value}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Progress;