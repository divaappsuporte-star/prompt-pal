import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, AlertTriangle, Scale, Flame, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/AuthContext";
import { DietInfo } from "@/types/diet";
import { cn } from "@/lib/utils";

interface GoalSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetKgLoss: number) => void;
  diet: DietInfo;
  isLoading?: boolean;
}

const GoalSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  diet,
  isLoading 
}: GoalSelectionModalProps) => {
  const { profile } = useAuth();
  const [targetKgLoss, setTargetKgLoss] = useState(5);

  // Calculate BMR using Mifflin-St Jeor equation
  const calculateBMR = () => {
    if (!profile?.weight_kg || !profile?.height_cm || !profile?.birth_date || !profile?.gender) {
      return null;
    }

    const weight = Number(profile.weight_kg);
    const height = Number(profile.height_cm);
    const birthDate = new Date(profile.birth_date);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    // Mifflin-St Jeor Equation
    if (profile.gender === 'masculino') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  };

  // Activity level multipliers
  const activityMultipliers: Record<string, number> = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    ativo: 1.725,
    muito_ativo: 1.9,
  };

  const calculations = useMemo(() => {
    const bmr = calculateBMR();
    if (!bmr) return null;

    const activityLevel = profile?.activity_level || 'sedentario';
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    // Calculate daily deficit needed
    // 1 kg of fat = 7700 kcal
    // For 21 days: targetKgLoss * 7700 / 21 = daily deficit
    const dailyDeficit = (targetKgLoss * 7700) / 21;
    const targetCalories = Math.max(tdee - dailyDeficit, 1200); // Minimum 1200 kcal

    const isAggressive = dailyDeficit > 1100; // More than 1kg/week
    const isExtreme = dailyDeficit > 1500;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyDeficit: Math.round(dailyDeficit),
      targetCalories: Math.round(targetCalories),
      weeklyLoss: (targetKgLoss / 3).toFixed(1),
      isAggressive,
      isExtreme,
      currentWeight: Number(profile?.weight_kg) || 0,
      targetWeight: (Number(profile?.weight_kg) || 0) - targetKgLoss,
    };
  }, [profile, targetKgLoss]);

  const handleConfirm = () => {
    onConfirm(targetKgLoss);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-auto rounded-t-3xl glass-card"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-md rounded-t-3xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{diet.emoji}</span>
                <h2 className="text-lg font-display font-bold">
                  Defina Sua Meta
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 pb-8">
              {/* Goal Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Objetivo em 21 dias
                  </h3>
                  <span className="text-2xl font-bold text-coral">
                    -{targetKgLoss} kg
                  </span>
                </div>

                <Slider
                  value={[targetKgLoss]}
                  onValueChange={(value) => setTargetKgLoss(value[0])}
                  min={1}
                  max={15}
                  step={1}
                  className="py-4"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 kg (suave)</span>
                  <span>15 kg (intenso)</span>
                </div>
              </div>

              {/* Calculations */}
              {calculations && (
                <div className="space-y-4">
                  {/* Weight projection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-xl p-4 text-center">
                      <Scale className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Peso Atual</p>
                      <p className="text-xl font-bold text-foreground">
                        {calculations.currentWeight} kg
                      </p>
                    </div>
                    <div className="bg-mint/20 rounded-xl p-4 text-center">
                      <Target className="w-5 h-5 text-mint mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Peso Meta</p>
                      <p className="text-xl font-bold text-mint">
                        {calculations.targetWeight} kg
                      </p>
                    </div>
                  </div>

                  {/* Calorie info */}
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Seu Gasto Diário (TDEE)</span>
                      <span className="font-medium">{calculations.tdee} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Déficit Necessário</span>
                      <span className="font-medium text-coral">-{calculations.dailyDeficit} kcal/dia</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-3">
                      <span className="text-sm font-medium">Calorias do Plano</span>
                      <span className="font-bold text-lg">{calculations.targetCalories} kcal/dia</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Perda Semanal
                      </span>
                      <span className="font-medium">{calculations.weeklyLoss} kg/semana</span>
                    </div>
                  </div>

                  {/* Warnings */}
                  {calculations.isAggressive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "rounded-xl p-4 flex items-start gap-3",
                        calculations.isExtreme 
                          ? "bg-destructive/20 border border-destructive/30" 
                          : "bg-gold/20 border border-gold/30"
                      )}
                    >
                      <AlertTriangle className={cn(
                        "w-5 h-5 flex-shrink-0 mt-0.5",
                        calculations.isExtreme ? "text-destructive" : "text-gold"
                      )} />
                      <div>
                        <p className={cn(
                          "font-medium text-sm",
                          calculations.isExtreme ? "text-destructive" : "text-gold"
                        )}>
                          {calculations.isExtreme ? "Meta Muito Agressiva" : "Meta Agressiva"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {calculations.isExtreme 
                            ? "Esta meta requer acompanhamento médico. Considere uma meta mais moderada para resultados sustentáveis."
                            : "Esta meta exige disciplina rigorosa. Siga o plano à risca para resultados."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Missing profile data warning */}
              {!calculations && (
                <div className="bg-gold/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gold">Perfil Incompleto</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete seu perfil (peso, altura, idade, sexo) para cálculos personalizados.
                    </p>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <Button
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full gradient-coral text-primary-foreground font-semibold py-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Flame className="w-4 h-4 mr-2" />
                    Iniciar Plano de 21 Dias
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Você poderá ajustar sua meta a qualquer momento
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalSelectionModal;
