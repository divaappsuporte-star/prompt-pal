import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Target, 
  Scale, 
  Ruler, 
  User2, 
  Heart, 
  Check,
  CheckCircle2,
  Droplets,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalPlan } from "@/hooks/usePersonalPlan";
import { useDietAccess } from "@/hooks/useDietAccess";
import { DietType, DIET_INFO, HealthCondition, HEALTH_CONDITION_LABELS } from "@/types/diet";
import DietSelector from "@/components/plan/DietSelector";
import DietLoadingOverlay from "@/components/diet/DietLoadingOverlay";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type Step = 'health' | 'diet' | 'extras' | 'goal';

const HEALTH_CONDITIONS: HealthCondition[] = [
  'diabetes',
  'gastrite', 
  'hipertensao',
  'intolerancia_lactose',
  'celiaquia'
];

const CreatePlan = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createPlan, hasPlan, isLoading } = usePersonalPlan();
  const { hasDietAccess, unlockedDiets } = useDietAccess();
  
  const [step, setStep] = useState<Step>('health');
  const [selectedConditions, setSelectedConditions] = useState<HealthCondition[]>([]);
  const [noConditions, setNoConditions] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);
  const [includeDetox, setIncludeDetox] = useState(false);
  const [targetKgLoss, setTargetKgLoss] = useState(5);
  const [showLoading, setShowLoading] = useState(false);

  const hasDetoxAccess = hasDietAccess('detox');
  
  // Check if user has multiple diet options (excluding detox which is an add-on)
  const mainDiets: DietType[] = ['carnivore', 'keto', 'lowcarb', 'metabolic', 'fasting'];
  const unlockedMainDiets = mainDiets.filter(d => hasDietAccess(d));
  const hasMultipleDiets = unlockedMainDiets.length > 1;

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

  const handleConditionToggle = (condition: HealthCondition) => {
    setNoConditions(false);
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleNoConditions = () => {
    setNoConditions(true);
    setSelectedConditions([]);
  };

  const handleHealthContinue = () => {
    // TODO: Save health conditions to database
    setStep('diet');
  };

  const handleDietSelect = (diet: DietType) => {
    setSelectedDiet(diet);
  };

  const handleDietContinue = () => {
    if (selectedDiet) {
      // If user has detox access, show extras step
      if (hasDetoxAccess) {
        setStep('extras');
      } else {
        setStep('goal');
      }
    }
  };

  const handleExtrasContinue = () => {
    setStep('goal');
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
          includeDetox,
        });
        setShowLoading(false);
        navigate("/meu-plano");
      } catch (error) {
        console.error("Error creating plan:", error);
        setShowLoading(false);
      }
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'health':
        navigate(-1);
        break;
      case 'diet':
        setStep('health');
        break;
      case 'extras':
        setStep('diet');
        break;
      case 'goal':
        if (hasDetoxAccess) {
          setStep('extras');
        } else {
          setStep('diet');
        }
        break;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'health': return 'Sua Saúde';
      case 'diet': return 'Escolha seu Protocolo';
      case 'extras': return 'Extras do Plano';
      case 'goal': return 'Defina sua Meta';
    }
  };

  const getStepNumber = () => {
    const steps = ['health', 'diet'];
    if (hasDetoxAccess) steps.push('extras');
    steps.push('goal');
    return steps.indexOf(step) + 1;
  };

  const getTotalSteps = () => {
    return hasDetoxAccess ? 4 : 3;
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
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground">
              Criar Plano Personalizado
            </h1>
            <p className="text-sm text-muted-foreground">
              Etapa {getStepNumber()} de {getTotalSteps()} • {getStepTitle()}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(getStepNumber() / getTotalSteps()) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {/* Step 1: Health Conditions */}
        {step === 'health' && (
          <motion.div
            key="health-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4"
          >
            <div className="glass-card rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-foreground">
                    Condições de Saúde
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Para personalizar seu plano com segurança
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Selecione as condições que se aplicam a você. Isso nos ajuda a adaptar receitas e evitar alimentos que possam prejudicá-lo.
              </p>

              <div className="space-y-3 mb-4">
                {HEALTH_CONDITIONS.map((condition) => (
                  <motion.button
                    key={condition}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConditionToggle(condition)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedConditions.includes(condition)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <span className="text-foreground font-medium">
                      {HEALTH_CONDITION_LABELS[condition]}
                    </span>
                    {selectedConditions.includes(condition) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNoConditions}
                  className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${
                    noConditions
                      ? 'border-mint bg-mint/10'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <span className="text-foreground font-medium">
                    Não possuo nenhuma condição
                  </span>
                  {noConditions && (
                    <Check className="w-5 h-5 text-mint" />
                  )}
                </motion.button>
              </div>
            </div>

            <Button
              onClick={handleHealthContinue}
              disabled={selectedConditions.length === 0 && !noConditions}
              className="w-full h-14 text-lg font-display"
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Step 2: Diet Selection */}
        {step === 'diet' && (
          <motion.div
            key="diet-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Escolha UMA Dieta
                </h2>
                <span className="px-2 py-0.5 text-xs font-bold bg-primary/20 text-primary rounded-full">
                  OBRIGATÓRIO
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {hasMultipleDiets 
                  ? "Você tem acesso a múltiplos protocolos! Selecione apenas UM como base do seu plano de 21 dias."
                  : "Selecione UMA dieta que será a base do seu plano personalizado de 21 dias."
                }
              </p>
              
              {selectedDiet && (
                <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-primary font-medium">
                    1 protocolo selecionado: {DIET_INFO[selectedDiet].name}
                  </span>
                </div>
              )}
              
              <DietSelector 
                selectedDiet={selectedDiet}
                onSelect={handleDietSelect}
                excludeDetox={true}
              />
            </div>

            <Button
              onClick={handleDietContinue}
              disabled={!selectedDiet}
              className="w-full h-14 text-lg font-display"
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Step 3: Extras (Detox) */}
        {step === 'extras' && (
          <motion.div
            key="extras-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4"
          >
            <div className="glass-card rounded-2xl p-5 mb-6 border border-mint/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-mint" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-foreground">
                    Sucos Detox Desbloqueados!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Potencialize seus resultados
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Você tem acesso aos Sucos Detox! Deseja incluir um suco verde diário ao seu plano para acelerar a desintoxicação e potencializar a queima de gordura?
              </p>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIncludeDetox(!includeDetox)}
                className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                  includeDetox
                    ? 'border-mint bg-mint/10'
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  includeDetox ? 'border-mint bg-mint' : 'border-muted-foreground'
                }`}>
                  {includeDetox && <Check className="w-4 h-4 text-background" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    Incluir 1 Suco Detox por dia
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receita diária integrada ao seu plano
                  </p>
                </div>
              </motion.button>

              {includeDetox && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 rounded-xl bg-mint/5 border border-mint/20"
                >
                  <p className="text-xs text-mint">
                    ✓ Um suco detox será adicionado às suas missões diárias
                  </p>
                </motion.div>
              )}
            </div>

            <Button
              onClick={handleExtrasContinue}
              className="w-full h-14 text-lg font-display"
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Step 4: Goal Setting */}
        {step === 'goal' && (
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
                className="glass-card rounded-2xl p-4 mb-4 border"
                style={{ borderColor: `${DIET_INFO[selectedDiet].color}30` }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${DIET_INFO[selectedDiet].color}20` }}
                  >
                    <Target className="w-6 h-6" style={{ color: DIET_INFO[selectedDiet].color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-foreground">
                      {DIET_INFO[selectedDiet].name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Protocolo principal
                    </p>
                  </div>
                  {includeDetox && (
                    <div className="px-2 py-1 rounded-full bg-mint/20 text-mint text-xs font-medium">
                      + Detox
                    </div>
                  )}
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
                  className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-500">
                    Meta agressiva. Recomendamos acompanhamento profissional para perdas acima de 7kg em 21 dias.
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
              {createPlan.isPending ? "Criando..." : "Criar Meu Plano de 21 Dias"}
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
