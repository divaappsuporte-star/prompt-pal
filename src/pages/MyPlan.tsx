import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Target, 
  CalendarDays, 
  Utensils,
  CheckCircle2,
  Circle,
  Sparkles,
  Droplets,
  Moon as MoonIcon,
  Leaf,
  Clock,
  Lock,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { usePersonalPlan } from "@/hooks/usePersonalPlan";
import { useDailyMeals } from "@/hooks/useDailyMeals";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { DIET_INFO, DietType } from "@/types/diet";
import BottomNavigation from "@/components/BottomNavigation";
import MealExpandCard from "@/components/plan/MealExpandCard";
import { DetoxCard, DETOX_RECIPES } from "@/components/plan/DetoxCard";
import WaterMissionCard from "@/components/plan/WaterMissionCard";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const MyPlan = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { personalPlan, isLoading, hasPlan, integratedModules } = usePersonalPlan();
  const { 
    todayHydration, 
    todaySleep, 
    addWaterIntake,
    markMealCompleted,
    checkMealTypeCompleted 
  } = useProgress();
  
  // Track detox locally (not in progressService yet)
  const [detoxCompleted, setDetoxCompleted] = useState(false);
  const [showTomorrowPreview, setShowTomorrowPreview] = useState(false);

  // Check if detox or fasting is integrated
  const hasDetoxIntegrated = integratedModules.some(m => m.type === 'detox');
  const hasFastingIntegrated = integratedModules.some(m => m.type === 'fasting');
  
  // Get detox recipe based on current day
  const detoxRecipe = DETOX_RECIPES[(personalPlan?.current_day || 1) % DETOX_RECIPES.length];
  
  // Calculate detox time (between meals)
  const getDetoxTime = () => {
    // Suggest mid-morning for detox
    return "10:00";
  };

  // Fetch daily meals based on plan
  const { dailyPlan, isLoading: mealsLoading } = useDailyMeals(
    personalPlan?.diet_type,
    personalPlan?.target_weight_loss,
    personalPlan?.current_day
  );

  // Fetch tomorrow's meals for preview
  const nextDay = personalPlan?.current_day ? Math.min(personalPlan.current_day + 1, 21) : 1;
  const { dailyPlan: tomorrowPlan, isLoading: tomorrowLoading } = useDailyMeals(
    personalPlan?.diet_type,
    personalPlan?.target_weight_loss,
    nextDay
  );

  // Check if it's past midnight to enable today's meal completion
  const canCompleteMeals = () => {
    // Meals can always be completed on the current day
    // The restriction is that tomorrow's preview is view-only
    return true;
  };

  // Redirect if no plan exists
  useEffect(() => {
    if (!isLoading && !hasPlan) {
      navigate("/criar-plano", { replace: true });
    }
  }, [isLoading, hasPlan, navigate]);

  const handleTabChange = (tab: string) => {
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

  // Map DietType to progressService DietType
  const getProgressDiet = (diet: DietType): 'carnivore' | 'lowcarb' | 'keto' | 'fasting' | 'detox' => {
    if (diet === 'metabolic') return 'lowcarb';
    return diet as 'carnivore' | 'lowcarb' | 'keto' | 'fasting' | 'detox';
  };

  const progressDiet = personalPlan ? getProgressDiet(personalPlan.diet_type) : 'lowcarb';

  // All meals are always available - no time restrictions
  // Users can complete any meal at any time during their plan day
  const isMealAvailable = (_mealType: 'breakfast' | 'lunch' | 'dinner') => {
    return true;
  };

  // Never dim meals - they're always accessible
  const isMealWindowPassed = (_mealType: 'breakfast' | 'lunch' | 'dinner') => {
    return false;
  };

  const handleMealComplete = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!personalPlan || !dailyPlan) return;
    
    const meal = dailyPlan[mealType];
    if (!meal) return;

    if (checkMealTypeCompleted(progressDiet, mealType)) {
      toast({
        title: "Refeição já concluída",
        description: "Você já marcou essa refeição hoje.",
        variant: "destructive",
      });
      return;
    }
    
    const result = markMealCompleted(
      progressDiet,
      mealType,
      meal.name,
      meal.calories,
      meal.protein || 0,
      meal.fat || 0,
      meal.carbs || 0,
      { 
        title: 'Refeição concluída', 
        message: dailyPlan?.meal_feedbacks?.[mealType] || 'Continue assim!', 
        bodyProcess: 'Digestão em andamento',
        timeframe: 'Agora',
        icon: '✓'
      }
    );

    if (result.success) {
      toast({
        title: "Refeição concluída! 🎉",
        description: dailyPlan?.meal_feedbacks?.[mealType] || "Continue assim!",
      });
    } else if (result.error) {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDetoxComplete = () => {
    setDetoxCompleted(true);
    toast({
      title: "Suco Detox concluído! 🥬",
      description: "Seu corpo agradece! Os nutrientes já estão trabalhando na desintoxicação.",
    });
  };

  const handleAddWater = (amount: number) => {
    addWaterIntake(amount);
    
    const goalMl = profile?.water_goal_ml || 2500;
    const newAmount = todayHydration + amount;
    if (newAmount >= goalMl && todayHydration < goalMl) {
      toast({
        title: "Meta de hidratação alcançada! 💧",
        description: "Excelente! Manter-se hidratado é fundamental para o sucesso do seu plano.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!personalPlan) {
    return null;
  }

  const dietInfo = DIET_INFO[personalPlan.diet_type];
  const planProgress = (personalPlan.current_day / 21) * 100;
  const waterGoal = profile?.water_goal_ml || 2500;
  
  // Calculate missions completion using progress system
  const breakfastCompleted = checkMealTypeCompleted(progressDiet, 'breakfast');
  const lunchCompleted = checkMealTypeCompleted(progressDiet, 'lunch');
  const dinnerCompleted = checkMealTypeCompleted(progressDiet, 'dinner');
  const completedMealsCount = [breakfastCompleted, lunchCompleted, dinnerCompleted].filter(Boolean).length;
  const allMealsCompleted = completedMealsCount >= 3;
  const waterCompleted = todayHydration >= waterGoal;
  const sleepLogged = todaySleep > 0;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-14 pb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground">
              Meu Plano de 21 Dias
            </h1>
            <p className="text-sm text-muted-foreground">
              {dietInfo.name}
            </p>
          </div>
        </div>
      </motion.header>

      <div className="px-4 space-y-6">
        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5"
          style={{ borderColor: `${dietInfo.color}30`, borderWidth: '1px' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${dietInfo.color}20` }}
            >
              <Target className="w-7 h-7" style={{ color: dietInfo.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Dia {personalPlan.current_day} de 21
                </span>
              </div>
              <p className="font-display font-bold text-lg text-foreground">
                Meta: -{personalPlan.target_weight_loss}kg
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">{Math.round(planProgress)}%</span>
            </div>
            <Progress value={planProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{personalPlan.start_weight}kg</span>
              <span>{personalPlan.target_weight}kg</span>
            </div>
          </div>
        </motion.div>

        {/* Today's Meals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Refeições de Hoje
            {dailyPlan && (
              <span className="text-xs font-normal text-muted-foreground ml-auto">
                {dailyPlan.total_calories} kcal total
              </span>
            )}
          </h2>
          
          <div className="space-y-3">
            {!hasFastingIntegrated ? (
              <div className={!isMealAvailable('breakfast') ? "opacity-40 pointer-events-none" : isMealWindowPassed('breakfast') && !breakfastCompleted ? "opacity-60" : ""}>
                <MealExpandCard
                  type="breakfast"
                  label="Café da Manhã"
                  time="07:00"
                  meal={dailyPlan?.breakfast || null}
                  feedback={dailyPlan?.meal_feedbacks?.breakfast || null}
                  completed={breakfastCompleted}
                  onComplete={() => handleMealComplete('breakfast')}
                  isLoading={mealsLoading}
                />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/20 flex items-center gap-3"
              >
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold text-muted-foreground">Janela de Jejum Ativa</p>
                  <p className="text-xs text-muted-foreground/70">Café da manhã substituído por jejum metabólico.</p>
                </div>
              </motion.div>
            )}
            <div className={!isMealAvailable('lunch') ? "opacity-40 pointer-events-none" : isMealWindowPassed('lunch') && !lunchCompleted ? "opacity-60" : ""}>
              <MealExpandCard
                type="lunch"
                label="Almoço"
                time="12:00"
                meal={dailyPlan?.lunch || null}
                feedback={dailyPlan?.meal_feedbacks?.lunch || null}
                completed={lunchCompleted}
                onComplete={() => handleMealComplete('lunch')}
                isLoading={mealsLoading}
              />
            </div>
            <div className={!isMealAvailable('dinner') ? "opacity-40 pointer-events-none" : isMealWindowPassed('dinner') && !dinnerCompleted ? "opacity-60" : ""}>
              <MealExpandCard
                type="dinner"
                label="Jantar"
                time="19:00"
                meal={dailyPlan?.dinner || null}
                feedback={dailyPlan?.meal_feedbacks?.dinner || null}
                completed={dinnerCompleted}
                onComplete={() => handleMealComplete('dinner')}
                isLoading={mealsLoading}
              />
            </div>
          </div>
        </motion.div>

        {/* Detox Section - Only if integrated */}
        {hasDetoxIntegrated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-mint" />
              Suco Detox do Dia
            </h2>
            
            <DetoxCard
              recipe={detoxRecipe}
              time={getDetoxTime()}
              completed={detoxCompleted}
              onComplete={handleDetoxComplete}
            />
          </motion.div>
        )}

        {/* Tomorrow's Preview Section */}
        {personalPlan.current_day < 21 && tomorrowPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
          >
            <button
              onClick={() => setShowTomorrowPreview(!showTomorrowPreview)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-muted-foreground" />
                Preview do Dia {nextDay}
              </h2>
              {showTomorrowPreview ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {showTomorrowPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-amber-500">
                    Apenas visualização. Libera à meia-noite.
                  </p>
                </div>

                {/* Tomorrow's Breakfast */}
                {!hasFastingIntegrated && tomorrowPlan.breakfast && (
                  <div className="opacity-60 pointer-events-none">
                    <MealExpandCard
                      type="breakfast"
                      label="Café da Manhã"
                      time="07:00"
                      meal={tomorrowPlan.breakfast}
                      feedback={null}
                      completed={false}
                      onComplete={() => {}}
                      isLoading={tomorrowLoading}
                    />
                  </div>
                )}

                {/* Tomorrow's Lunch */}
                {tomorrowPlan.lunch && (
                  <div className="opacity-60 pointer-events-none">
                    <MealExpandCard
                      type="lunch"
                      label="Almoço"
                      time="12:00"
                      meal={tomorrowPlan.lunch}
                      feedback={null}
                      completed={false}
                      onComplete={() => {}}
                      isLoading={tomorrowLoading}
                    />
                  </div>
                )}

                {/* Tomorrow's Dinner */}
                {tomorrowPlan.dinner && (
                  <div className="opacity-60 pointer-events-none">
                    <MealExpandCard
                      type="dinner"
                      label="Jantar"
                      time="19:00"
                      meal={tomorrowPlan.dinner}
                      feedback={null}
                      completed={false}
                      onComplete={() => {}}
                      isLoading={tomorrowLoading}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Daily Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            Missões do Dia
          </h2>
          
          <div className="space-y-3">
            {/* Water Mission - Expandable */}
            <WaterMissionCard
              goalMl={waterGoal}
              currentMl={todayHydration}
              onAddWater={handleAddWater}
            />
            
            {/* Meals Mission */}
            <div className={`rounded-xl p-3 flex items-center gap-3 border ${
              allMealsCompleted ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'
            }`}>
              {allMealsCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <span className={allMealsCompleted ? "text-primary font-medium" : "text-foreground"}>
                  Completar todas as refeições
                </span>
                <p className="text-xs text-muted-foreground">
                  {completedMealsCount}/3 refeições
                </p>
              </div>
            </div>
            
            {/* Sleep Mission */}
            <div className={`rounded-xl p-3 flex items-center gap-3 border ${
              sleepLogged ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-border bg-muted/30'
            }`}>
              {sleepLogged ? (
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              ) : (
                <MoonIcon className="w-5 h-5 text-muted-foreground" />
              )}
              <span className={sleepLogged ? "text-indigo-500 font-medium" : "text-foreground"}>
                Dormir {profile?.sleep_goal_hours || 8} horas
              </span>
            </div>
          </div>
        </motion.div>

        {/* Integrated Modules */}
        {integratedModules.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-lg font-bold text-foreground mb-3">
              Módulos Integrados
            </h2>
            
            <div className="flex gap-2 flex-wrap">
              {integratedModules.map((module) => {
                const moduleInfo = DIET_INFO[module.type];
                return (
                  <div
                    key={module.type}
                    className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5"
                    style={{ 
                      backgroundColor: `${moduleInfo.color}20`,
                      color: moduleInfo.color,
                    }}
                  >
                    {moduleInfo.name}
                    {module.is_primary && (
                      <span className="text-xs opacity-70">(principal)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Body Status Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-5 bg-gradient-to-br from-primary/5 to-transparent"
        >
          <h3 className="font-display font-bold text-foreground mb-2">
            O Que Está Acontecendo no Seu Corpo
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {personalPlan.current_day <= 3 && (
              "Fase de adaptação: Seu corpo está se ajustando ao novo protocolo alimentar. É normal sentir um pouco de fome ou cansaço."
            )}
            {personalPlan.current_day > 3 && personalPlan.current_day <= 10 && (
              "Fase de aceleração: Seu metabolismo está entrando em ritmo. A queima de gordura começa a intensificar."
            )}
            {personalPlan.current_day > 10 && personalPlan.current_day <= 17 && (
              "Fase de transformação: Seu corpo está operando de forma eficiente. Você deve notar mudanças visíveis."
            )}
            {personalPlan.current_day > 17 && (
              "Fase de consolidação: Os resultados estão sendo consolidados. Mantenha o foco para finalizar com sucesso!"
            )}
          </p>
        </motion.div>
      </div>

      <BottomNavigation 
        activeTab="home" 
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default MyPlan;
