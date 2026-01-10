import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Dumbbell, User, ChevronRight, Sparkles, Shield, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDietAccess, useUserRole } from "@/hooks/useDietAccess";
import { DietType, DIET_INFO } from "@/types/diet";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";
import DietCard from "@/components/diet/DietCard";
import BodyStatusCard from "@/components/diet/BodyStatusCard";
import QuickLogModal from "@/components/modals/QuickLogModal";
import ProfileModal from "@/components/modals/ProfileModal";
import MyPlanCard from "@/components/plan/MyPlanCard";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { isDietLocked, canViewDiet, selectedDiet, bonusDiets } = useDietAccess();
  const { isSuperAdmin } = useUserRole();
  
  const [activeTab, setActiveTab] = useState("home");
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const wantsExercise = (profile as any)?.wants_exercise ?? true;

  // Check if profile is incomplete and show onboarding modal
  const isProfileIncomplete = !profile?.full_name || !profile?.height_cm || !profile?.weight_kg || !profile?.goal_weight_kg;

  useEffect(() => {
    if (profile && isProfileIncomplete) {
      setIsOnboarding(true);
      setShowProfile(true);
    }
  }, [profile, isProfileIncomplete]);

  const handleProfileClose = (forceClose?: boolean) => {
    if (forceClose || !isOnboarding) {
      setShowProfile(false);
      setIsOnboarding(false);
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

  const handleDietClick = (dietKey: DietType) => {
    const isLocked = isDietLocked(dietKey);
    const canView = canViewDiet(dietKey);
    
    if (isLocked && !canView) {
      // Show message that they need to create a plan first
      toast.info("Crie seu plano de 21 dias para desbloquear este protocolo", {
        description: "Acesse 'Meu Plano' para escolher sua dieta base",
        duration: 4000,
      });
      return;
    }
    
    // Can view this diet - navigate
    const dietInfo = DIET_INFO[dietKey];
    navigate(dietInfo.route);
  };

  // Diet list in order: main diets first, then bonus
  const dietList: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4"
      >
        <div className="flex items-center justify-between">
          {/* Admin link - only visible for super admins */}
          {isSuperAdmin ? (
            <button
              onClick={() => navigate("/admin")}
              className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center hover:bg-coral/30 transition-colors"
            >
              <Shield className="w-5 h-5 text-coral" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <Logo size="md" />
          <button
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.header>

      {/* Top Cards Grid - Mentalidade + Meu Plano */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Mindset Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/mentalidade")}
            className="aspect-square rounded-2xl p-4 cursor-pointer border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent glass-card flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-gold" />
              </div>
              <p className="text-xs text-gold font-medium mb-1">COMECE POR AQUI</p>
              <h3 className="font-display font-bold text-base text-foreground leading-tight">
                Mentalidade
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">PNL & Reprog.</span>
              <ChevronRight className="w-4 h-4 text-gold" />
            </div>
          </motion.div>

          {/* My Plan Card */}
          <MyPlanCard delay={0.15} />
        </div>
      </div>

      {/* Diet Cards Section */}
      <div className="px-4 mb-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-display text-xl font-bold text-foreground mb-4"
        >
          Protocolos Alimentares
        </motion.h2>
        
        <div className="grid grid-cols-2 gap-3">
          {dietList.map((dietKey, index) => {
            const diet = DIET_INFO[dietKey];
            const isLocked = isDietLocked(dietKey);
            
            return (
              <DietCard
                key={dietKey}
                diet={diet}
                isLocked={isLocked}
                hasActivePlan={selectedDiet === dietKey}
                progress={0}
                onClick={() => handleDietClick(dietKey)}
                onUnlockClick={() => handleDietClick(dietKey)}
                delay={0.2 + index * 0.05}
              />
            );
          })}
        </div>
      </div>

      {/* Food Education Card */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/educacao-alimentar")}
          className="glass-card rounded-2xl p-5 cursor-pointer border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-foreground">
                Educação Alimentar
              </h3>
              <p className="text-sm text-muted-foreground">
                Protocolo 2026 • A Revolução da Comida de Verdade
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Body Status Card */}
      <div className="px-4 mb-6">
        <BodyStatusCard />
      </div>

      {/* Training Section - Conditional */}
      {wantsExercise && (
        <div className="px-4 mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-display text-xl font-bold text-foreground mb-4"
          >
            Treinos
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/treino")}
            className="glass-card rounded-2xl p-5 cursor-pointer border border-coral/20 bg-gradient-to-br from-coral/10 to-transparent"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-coral/20 flex items-center justify-center">
                <Dumbbell className="w-7 h-7 text-coral" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  HIIT em Casa
                </h3>
                <p className="text-sm text-muted-foreground">
                  Treinos intensos de 15-30 minutos
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-coral" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-6 py-4"
      >
        <div className="glass-card rounded-2xl p-6 text-center">
          <Sparkles className="w-5 h-5 text-gold mx-auto mb-3" />
          <p className="text-lg text-foreground font-display italic mb-2">
            "A constância começa na mente antes de aparecer no corpo."
          </p>
          <p className="text-sm text-gold">— Nutri21</p>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />

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
