import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Apple, Dumbbell, BarChart3 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardCard from "@/components/DashboardCard";
import HeroBanner from "@/components/HeroBanner";
import WorkoutCarousel from "@/components/WorkoutCarousel";
import QuickStats from "@/components/QuickStats";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const currentDay = 7;

  const handleCardClick = (id: string) => {
    if (id === "nutricao") {
      navigate("/nutricao");
    }
  };

  const dashboardCards = [
    {
      id: "mentalidade",
      title: "Mentalidade",
      subtitle: "PNL & Reprogramação",
      icon: Brain,
      variant: "gold" as const,
      progress: 45,
    },
    {
      id: "nutricao",
      title: "Nutrição",
      subtitle: "Plano Low Carb",
      icon: Apple,
      variant: "mint" as const,
      progress: 62,
    },
    {
      id: "treino",
      title: "Treino",
      subtitle: "HIIT em Casa",
      icon: Dumbbell,
      variant: "coral" as const,
      progress: 33,
    },
    {
      id: "progresso",
      title: "Progresso",
      subtitle: "Sua evolução",
      icon: BarChart3,
      variant: "gold" as const,
      progress: 48,
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">
              <span className="text-foreground">Personal</span>
              <span className="text-gradient-coral"> 21</span>
            </h1>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
          >
            <span className="text-lg">👤</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Banner */}
      <HeroBanner userName="Atleta" currentDay={currentDay} />

      {/* Quick Stats */}
      <QuickStats />

      {/* Dashboard Cards */}
      <div className="px-4 py-2">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 px-0">
          Sua Jornada
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              variant={card.variant}
              progress={card.progress}
              delay={0.1 + index * 0.1}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Workout Carousel */}
      <WorkoutCarousel />

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-8"
      >
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-lg text-foreground font-display italic mb-2">
            "A constância começa na mente antes de aparecer no corpo."
          </p>
          <p className="text-sm text-gold">— Personal 21</p>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
