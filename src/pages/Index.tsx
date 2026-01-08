import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, Dumbbell, User, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDietAccess } from "@/hooks/useDietAccess";
import { useActivePlan } from "@/hooks/useActivePlan";
import { DietType, DIET_INFO } from "@/types/diet";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";
import DietCard from "@/components/diet/DietCard";
import BodyStatusCard from "@/components/diet/BodyStatusCard";
import GoalSelectionModal from "@/components/diet/GoalSelectionModal";
import DietLoadingOverlay from "@/components/diet/DietLoadingOverlay";
import QuickLogModal from "@/components/modals/QuickLogModal";
import ProfileModal from "@/components/modals/ProfileModal";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { hasDietAccess, isLoading: accessLoading } = useDietAccess();
  
  const [activeTab, setActiveTab] = useState("home");
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  // Diet selection state
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [targetKgLoss, setTargetKgLoss] = useState(5);

  const { createPlan, activePlan } = useActivePlan(selectedDiet || undefined);

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
    const hasAccess = hasDietAccess(dietKey);
    
    if (hasAccess) {
      setSelectedDiet(dietKey);
      setShowGoalModal(true);
    } else {
      // TODO: Open payment modal
      console.log("Diet locked, show payment modal for:", dietKey);
    }
  };

  const handleGoalConfirm = async (kgLoss: number) => {
    setTargetKgLoss(kgLoss);
    setShowGoalModal(false);
    setShowLoadingOverlay(true);
  };

  const handleLoadingComplete = async () => {
    if (selectedDiet) {
      try {
        await createPlan.mutateAsync({ targetWeightLoss: targetKgLoss });
        setShowLoadingOverlay(false);
        // Navigate to diet page
        const dietInfo = DIET_INFO[selectedDiet];
        navigate(dietInfo.route);
      } catch (error) {
        console.error("Error creating plan:", error);
        setShowLoadingOverlay(false);
      }
    }
  };

  // Diet list in order
  const dietList: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic', 'detox', 'fasting'];

  // Mock feedbacks for body status (will come from active plan)
  const mockFeedbacks = activePlan?.daily_feedbacks || [];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-14 pb-6"
      >
        <div className="flex items-center justify-between">
          <div className="w-10" />
          <Logo size="md" />
          <button
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.header>

      {/* Mindset Card - Start Here */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/mentalidade")}
          className="glass-card rounded-2xl p-5 cursor-pointer border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center">
              <Brain className="w-7 h-7 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gold font-medium mb-1">COMECE POR AQUI</p>
              <h3 className="font-display font-bold text-lg text-foreground">
                Mentalidade
              </h3>
              <p className="text-sm text-muted-foreground">
                PNL & Reprogramação Mental
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gold" />
          </div>
        </motion.div>
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
        
        <div className="grid grid-cols-1 gap-4">
          {dietList.map((dietKey, index) => {
            const diet = DIET_INFO[dietKey];
            const hasAccess = hasDietAccess(dietKey);
            
            return (
              <DietCard
                key={dietKey}
                diet={diet}
                isLocked={!hasAccess}
                hasActivePlan={false}
                progress={0}
                onClick={() => handleDietClick(dietKey)}
                onUnlockClick={() => handleDietClick(dietKey)}
                delay={0.2 + index * 0.1}
              />
            );
          })}
        </div>
      </div>

      {/* Body Status Card */}
      <div className="px-4 mb-6">
        <BodyStatusCard feedbacks={mockFeedbacks} />
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
          <p className="text-sm text-gold">— Reset 21</p>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        showTraining={wantsExercise}
      />

      {/* Modals */}
      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={handleProfileClose}
        isOnboarding={isOnboarding}
      />
      
      {/* Goal Selection Modal */}
      {selectedDiet && (
        <GoalSelectionModal
          isOpen={showGoalModal}
          onClose={() => {
            setShowGoalModal(false);
            setSelectedDiet(null);
          }}
          onConfirm={handleGoalConfirm}
          diet={DIET_INFO[selectedDiet]}
          isLoading={createPlan.isPending}
        />
      )}

      {/* Loading Overlay */}
      <DietLoadingOverlay
        isOpen={showLoadingOverlay}
        diet={selectedDiet ? DIET_INFO[selectedDiet] : null}
        targetKgLoss={targetKgLoss}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
};

export default Index;
