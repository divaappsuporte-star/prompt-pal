import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Target, 
  CalendarDays, 
  ChevronRight,
  Utensils,
  CheckCircle2,
  Circle,
  Sparkles
} from "lucide-react";
import { usePersonalPlan } from "@/hooks/usePersonalPlan";
import { DIET_INFO } from "@/types/diet";
import BottomNavigation from "@/components/BottomNavigation";
import { Progress } from "@/components/ui/progress";

const MyPlan = () => {
  const navigate = useNavigate();
  const { personalPlan, isLoading, hasPlan, integratedModules, primaryModule } = usePersonalPlan();

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
  const progress = (personalPlan.current_day / 21) * 100;
  
  // Mock meals for the day (will be replaced with real data from diet_meal_plans)
  const todayMeals = [
    { id: 'breakfast', name: 'Café da Manhã', time: '07:00', completed: false },
    { id: 'lunch', name: 'Almoço', time: '12:00', completed: false },
    { id: 'dinner', name: 'Jantar', time: '19:00', completed: false },
  ];

  // Mock missions
  const dailyMissions = [
    { id: 'water', name: 'Beber 2.5L de água', completed: false },
    { id: 'meals', name: 'Completar todas as refeições', completed: false },
    { id: 'sleep', name: 'Dormir 8 horas', completed: false },
  ];

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
              <span className="font-medium text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
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
          </h2>
          
          <div className="space-y-3">
            {todayMeals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
              >
                {meal.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{meal.name}</p>
                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </motion.div>

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
          
          <div className="glass-card rounded-xl p-4 space-y-3">
            {dailyMissions.map((mission, index) => (
              <div
                key={mission.id}
                className="flex items-center gap-3"
              >
                {mission.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className={mission.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                  {mission.name}
                </span>
              </div>
            ))}
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
        showTraining={true}
      />
    </div>
  );
};

export default MyPlan;
