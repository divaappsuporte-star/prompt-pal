import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Scale, Ruler, User2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalPlan } from "@/hooks/usePersonalPlan";
import { DietType, DIET_INFO } from "@/types/diet";
import DietSelector from "@/components/plan/DietSelector";
import DietLoadingOverlay from "@/components/diet/DietLoadingOverlay";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const CreatePlan = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createPlan, hasPlan, isLoading } = usePersonalPlan();
  
  const [step, setStep] = useState<'diet' | 'goal'>('diet');
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);
  const [targetKgLoss, setTargetKgLoss] = useState(5);
  const [showLoading, setShowLoading] = useState(false);

  // Redirect if user already has a plan
  useEffect(() => {
    if (!isLoading && hasPlan) {
      navigate("/meu-plano", { replace: true });
    }
  }, [isLoading, hasPlan, navigate]);

  // Show loading while checking for existing plan
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Don't render if redirecting
  if (hasPlan) {
    return null;
  }

  const currentWeight = profile?.weight_kg || 70;
  const height = profile?.height_cm || 170;
  const targetWeight = currentWeight - targetKgLoss;

  const handleDietSelect = (diet: DietType) => {
    setSelectedDiet(diet);
  };

  const handleContinue = () => {
    if (selectedDiet) {
      setStep('goal');
    }
  };

  const handleCreatePlan = () => {
    if (selectedDiet) {
      setShowLoading(true);
    }
  };

  const handleLoadingComplete = async () => {
    if (selectedDiet) {
      try {
        await createPlan.mutateAsync({
          dietType: selectedDiet,
          targetWeightLoss: targetKgLoss,
        });
        setShowLoading(false);
        navigate("/meu-plano");
      } catch (error) {
        console.error("Error creating plan:", error);
        setShowLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-14 pb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => step === 'goal' ? setStep('diet') : navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Criar Plano Personalizado
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 'diet' ? 'Escolha seu protocolo' : 'Defina sua meta'}
            </p>
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {step === 'diet' ? (
          <motion.div
            key="diet-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4"
          >
            {/* User Stats Summary */}
            <div className="glass-card rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Seus Dados</p>
                  <p className="text-xs text-muted-foreground">Base do seu plano personalizado</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Scale className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{currentWeight}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Ruler className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{height}</p>
                  <p className="text-xs text-muted-foreground">cm</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <User2 className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                  <p className="text-lg font-bold text-foreground">{profile?.goal_weight_kg || '--'}</p>
                  <p className="text-xs text-muted-foreground">meta</p>
                </div>
              </div>
            </div>

            {/* Diet Selection */}
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-3">
                Escolha seu Protocolo
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione a dieta que será a base do seu plano de 21 dias
              </p>
              
              <DietSelector 
                selectedDiet={selectedDiet}
                onSelect={handleDietSelect}
              />
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!selectedDiet}
              className="w-full h-14 text-lg font-display"
            >
              Continuar
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="goal-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4"
          >
            {/* Selected Diet Card */}
            {selectedDiet && (
              <div 
                className="glass-card rounded-2xl p-4 mb-6 border"
                style={{ borderColor: `${DIET_INFO[selectedDiet].color}30` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${DIET_INFO[selectedDiet].color}20` }}
                  >
                    <Target className="w-6 h-6" style={{ color: DIET_INFO[selectedDiet].color }} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground">
                      {DIET_INFO[selectedDiet].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {DIET_INFO[selectedDiet].description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Weight Goal Section */}
            <div className="glass-card rounded-2xl p-5 mb-6">
              <h2 className="font-display text-lg font-bold text-foreground mb-2">
                Meta de Emagrecimento
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Quanto você deseja perder em 21 dias?
              </p>

              {/* Weight Display */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Atual</p>
                  <p className="text-2xl font-bold text-foreground">{currentWeight}kg</p>
                </div>
                <div className="flex-1 px-4">
                  <div className="h-0.5 bg-gradient-to-r from-muted via-primary to-primary rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Meta</p>
                  <p className="text-2xl font-bold text-primary">{targetWeight.toFixed(1)}kg</p>
                </div>
              </div>

              {/* Slider */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Perda desejada</span>
                  <span className="text-lg font-bold text-primary">-{targetKgLoss}kg</span>
                </div>
                <Slider
                  value={[targetKgLoss]}
                  onValueChange={(value) => setTargetKgLoss(value[0])}
                  min={1}
                  max={15}
                  step={0.5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-1kg</span>
                  <span>-15kg</span>
                </div>
              </div>

              {/* Warning for aggressive goals */}
              {targetKgLoss > 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3"
                >
                  <p className="text-xs text-amber-500">
                    ⚠️ Meta agressiva. Recomendamos acompanhamento profissional.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Create Plan Button */}
            <Button
              onClick={handleCreatePlan}
              disabled={createPlan.isPending}
              className="w-full h-14 text-lg font-display"
            >
              {createPlan.isPending ? "Criando..." : "Criar Meu Plano"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <DietLoadingOverlay
        isOpen={showLoading}
        diet={selectedDiet ? DIET_INFO[selectedDiet] : null}
        targetKgLoss={targetKgLoss}
        onComplete={handleLoadingComplete}
      />
    </div>
  );
};

export default CreatePlan;
