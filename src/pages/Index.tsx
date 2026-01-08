import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Apple, Dumbbell, BarChart3, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import DashboardCard from "@/components/DashboardCard";
import HeroBanner from "@/components/HeroBanner";
import QuickStats from "@/components/QuickStats";
import HealthMonitor from "@/components/HealthMonitor";
import Logo from "@/components/Logo";
import QuickLogModal from "@/components/modals/QuickLogModal";
import ProfileModal from "@/components/modals/ProfileModal";


const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const currentDay = 1;

  const userName = profile?.full_name?.split(" ")[0] || "Atleta";

  // Check if profile is incomplete and show onboarding modal
  const isProfileIncomplete = !profile?.full_name || !profile?.height_cm || !profile?.weight_kg || !profile?.goal_weight_kg;

  useEffect(() => {
    if (profile && isProfileIncomplete) {
      setIsOnboarding(true);
      setShowProfile(true);
    }
  }, [profile, isProfileIncomplete]);

  const handleProfileClose = (forceClose?: boolean) => {
    // Allow closing if forced (after successful save) or not in onboarding
    if (forceClose || !isOnboarding) {
      setShowProfile(false);
      setIsOnboarding(false);
    }
  };

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
        className="px-6 pt-14 pb-6"
      >
        <div className="flex items-center justify-between">
          <div className="w-10" /> {/* Spacer for centering */}
          <Logo size="md" />
          <button
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.header>

      {/* Hero Banner - Full Width */}
      <HeroBanner userName={userName} currentDay={currentDay} />

      {/* Dashboard Cards - Sua Jornada */}
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

      {/* Health Monitor */}
      <HealthMonitor />

      {/* Quick Stats - Resumo de Hoje */}
      <QuickStats />

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

      {/* Modals */}
      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={handleProfileClose}
        isOnboarding={isOnboarding}
      />
    </div>
  );
};

export default Index;
