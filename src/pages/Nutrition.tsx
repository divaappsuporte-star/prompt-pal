import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Filter, Flame, Droplets, Wheat, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MealCard from "@/components/nutrition/MealCard";
import MedicalFilters from "@/components/nutrition/MedicalFilters";
import MacroSummary from "@/components/nutrition/MacroSummary";

export interface MedicalCondition {
  id: string;
  label: string;
  active: boolean;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  tags: string[];
  restrictions?: string[];
}

const dietPlans = {
  carnivora: {
    name: "Dieta Carnívora",
    description: "Baseada em carnes, gorduras e proteínas animais",
    isSpecialPage: true,
    route: "/dieta-carnivora",
    meals: [] as Meal[],
  },
  ancestral: {
    name: "Dieta Ancestral",
    description: "Baseada em alimentos naturais e não processados",
    meals: [
      {
        id: "a1",
        name: "Ovos com Abacate",
        time: "07:00",
        calories: 420,
        protein: 18,
        carbs: 8,
        fat: 36,
        image: "🥑",
        tags: ["café da manhã", "low-carb"],
      },
      {
        id: "a2",
        name: "Salmão Grelhado com Legumes",
        time: "12:30",
        calories: 520,
        protein: 42,
        carbs: 12,
        fat: 32,
        image: "🐟",
        tags: ["almoço", "omega-3"],
      },
      {
        id: "a3",
        name: "Frango com Batata Doce",
        time: "19:00",
        calories: 480,
        protein: 38,
        carbs: 35,
        fat: 18,
        image: "🍗",
        tags: ["jantar", "proteína"],
      },
    ] as Meal[],
  },
  cetogenica: {
    name: "Dieta Cetogênica",
    description: "Alta gordura, baixo carboidrato para cetose",
    meals: [
      {
        id: "c1",
        name: "Bulletproof Coffee",
        time: "06:30",
        calories: 320,
        protein: 2,
        carbs: 0,
        fat: 35,
        image: "☕",
        tags: ["café da manhã", "keto"],
        restrictions: ["diabetes"],
      },
      {
        id: "c2",
        name: "Bife com Manteiga e Espinafre",
        time: "13:00",
        calories: 680,
        protein: 48,
        carbs: 4,
        fat: 52,
        image: "🥩",
        tags: ["almoço", "high-fat"],
        restrictions: ["hipertensao"],
      },
      {
        id: "c3",
        name: "Omelete de Queijo com Bacon",
        time: "19:30",
        calories: 520,
        protein: 32,
        carbs: 2,
        fat: 42,
        image: "🍳",
        tags: ["jantar", "proteína"],
      },
    ] as Meal[],
  },
  lowcarb: {
    name: "Low Carb",
    description: "Nutrição, Hormônios e Reprogramação Metabólica",
    isSpecialPage: true,
    route: "/dieta-lowcarb",
    meals: [] as Meal[],
  },
  mediterranea: {
    name: "Mediterrânea",
    description: "Rica em azeite, peixes e vegetais",
    meals: [
      {
        id: "m1",
        name: "Pão Integral com Azeite e Tomate",
        time: "08:00",
        calories: 320,
        protein: 8,
        carbs: 42,
        fat: 14,
        image: "🍅",
        tags: ["café da manhã", "fibras"],
      },
      {
        id: "m2",
        name: "Grão de Bico com Legumes",
        time: "12:30",
        calories: 380,
        protein: 16,
        carbs: 48,
        fat: 12,
        image: "🫘",
        tags: ["almoço", "vegano"],
      },
      {
        id: "m3",
        name: "Sardinha com Salada Grega",
        time: "19:00",
        calories: 420,
        protein: 32,
        carbs: 15,
        fat: 26,
        image: "🫒",
        tags: ["jantar", "omega-3"],
      },
    ] as Meal[],
  },
};

const Nutrition = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("carnivora");
  const [showFilters, setShowFilters] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([
    { id: "diabetes", label: "Diabetes", active: false },
    { id: "gastrite", label: "Gastrite", active: false },
    { id: "hipertensao", label: "Hipertensão", active: false },
    { id: "intolerancia_lactose", label: "Intolerância à Lactose", active: false },
    { id: "celiaquia", label: "Celíaco", active: false },
  ]);

  const currentPlan = dietPlans[activeTab as keyof typeof dietPlans];
  const activeConditions = medicalConditions.filter((c) => c.active).map((c) => c.id);

  const filteredMeals = currentPlan.meals.filter((meal) => {
    if (activeConditions.length === 0) return true;
    if (!meal.restrictions) return true;
    return !meal.restrictions.some((r) => activeConditions.includes(r));
  });

  const totalMacros = filteredMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const toggleCondition = (id: string) => {
    setMedicalConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </motion.button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Nutrição
              </h1>
              <p className="text-sm text-muted-foreground">
                Plano alimentar dia 7
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-colors ${
              showFilters || activeConditions.length > 0
                ? "bg-coral/20 text-coral"
                : "bg-card text-muted-foreground"
            }`}
          >
            <Filter size={20} />
            {activeConditions.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                {activeConditions.length}
              </span>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Medical Filters */}
      <AnimatePresence>
        {showFilters && (
          <MedicalFilters
            conditions={medicalConditions}
            onToggle={toggleCondition}
          />
        )}
      </AnimatePresence>

      {/* Warning for active filters */}
      <AnimatePresence>
        {activeConditions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mb-4"
          >
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gold/10 border border-gold/30">
              <AlertTriangle size={18} className="text-gold" />
              <p className="text-sm text-gold">
                Dieta adaptada para suas condições
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Macro Summary */}
      <MacroSummary macros={totalMacros} />

      {/* Diet Tabs */}
      <div className="px-6 py-4">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            const plan = dietPlans[value as keyof typeof dietPlans];
            if (plan && 'isSpecialPage' in plan && plan.isSpecialPage) {
              navigate(plan.route);
            } else {
              setActiveTab(value);
            }
          }} 
          className="w-full"
        >
          <TabsList className="w-full bg-card/50 p-1 rounded-xl grid grid-cols-5 gap-1">
            <TabsTrigger
              value="carnivora"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-xs font-medium"
            >
              Carnívora
            </TabsTrigger>
            <TabsTrigger
              value="ancestral"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-xs font-medium"
            >
              Ancestral
            </TabsTrigger>
            <TabsTrigger
              value="cetogenica"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-xs font-medium"
            >
              Keto
            </TabsTrigger>
            <TabsTrigger
              value="lowcarb"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-xs font-medium"
            >
              Low Carb
            </TabsTrigger>
            <TabsTrigger
              value="mediterranea"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-xs font-medium"
            >
              Mediterrânea
            </TabsTrigger>
          </TabsList>

          {/* Special page card for Carnivora */}
          {activeTab === "carnivora" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div 
                onClick={() => navigate("/dieta-carnivora")}
                className="glass-card rounded-2xl p-6 border border-coral/30 cursor-pointer hover:border-coral/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-coral/20 flex items-center justify-center">
                    <span className="text-3xl">🥩</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Dieta Carnívora
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      20 capítulos + 30 receitas completas
                    </p>
                    <p className="text-xs text-coral mt-1">
                      Toque para acessar o conteúdo completo →
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Special page card for Low Carb */}
          {activeTab === "lowcarb" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div 
                onClick={() => navigate("/dieta-lowcarb")}
                className="glass-card rounded-2xl p-6 border border-green-500/30 cursor-pointer hover:border-green-500/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <span className="text-3xl">🥗</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-lg font-bold text-foreground">
                      Dieta Low Carb
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      20 capítulos + 30 receitas completas
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      Toque para acessar o conteúdo completo →
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab !== "carnivora" && activeTab !== "lowcarb" && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-6"
            >
              <div className="mb-4">
                <h2 className="font-display text-lg font-bold text-foreground">
                  {currentPlan.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentPlan.description}
                </p>
              </div>

              <div className="space-y-4">
                {filteredMeals.map((meal, index) => (
                  <MealCard key={meal.id} meal={meal} delay={index * 0.1} />
                ))}
              </div>

              {filteredMeals.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    Nenhuma refeição disponível com os filtros selecionados.
                  </p>
                  <button
                    onClick={() =>
                      setMedicalConditions((prev) =>
                        prev.map((c) => ({ ...c, active: false }))
                      )
                    }
                    className="mt-4 text-coral underline"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Nutrition;
