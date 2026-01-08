import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Apple, Dumbbell, BarChart3 } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardCard from "@/components/DashboardCard";
import HeroBanner from "@/components/HeroBanner";
import QuickStats from "@/components/QuickStats";
import HealthMonitor from "@/components/HealthMonitor";
import Logo from "@/components/Logo";
import QuickLogModal from "@/components/modals/QuickLogModal";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showQuickLog, setShowQuickLog] = useState(false);
  const currentDay = 7;

  const handleCardClick = (id: string) => {
    if (id === "nutricao") {
      navigate("/nutricao");
    } else if (id === "mentalidade") {
      navigate("/mentalidade");
    } else if (id === "treino") {
      navigate("/treino");
    }
  };

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
      case "add":
        setShowQuickLog(true);
        break;
    }
  };

  const dashboardCards = [
    {
      id: "mentalidade",
      title: "Mentalidade",
      subtitle: "PNL & Reprogramação",
      icon: Brain,
      variant: "gold" as const,
      progress: 0,
    },
    {
      id: "nutricao",
      title: "Nutrição",
      subtitle: "Plano Alimentar",
      icon: Apple,
      variant: "mint" as const,
      progress: 0,
    },
    {
      id: "treino",
      title: "Treino",
      subtitle: "HIIT em Casa",
      icon: Dumbbell,
      variant: "coral" as const,
      progress: 0,
    },
    {
      id: "progresso",
      title: "Progresso",
      subtitle: "Sua evolução",
      icon: BarChart3,
      variant: "gold" as const,
      progress: 0,
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
          <Logo size="md" />
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

      {/* Health Monitor */}
      <HealthMonitor />

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
          <p className="text-sm text-gold">— Reset 21</p>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Quick Log Modal */}
      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
    </div>
  );
};

export default Index;
