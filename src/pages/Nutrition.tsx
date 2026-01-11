import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Filter, AlertTriangle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDietAccess } from "@/hooks/useDietAccess";
import PurchaseModal from "@/components/modals/PurchaseModal";
import { DietType } from "@/types/diet";
import MedicalFilters from "@/components/nutrition/MedicalFilters";
import MacroSummary from "@/components/nutrition/MacroSummary";
import BottomNavigation from "@/components/BottomNavigation";
import QuickLogModal from "@/components/modals/QuickLogModal";

export interface MedicalCondition {
  id: string;
  label: string;
  active: boolean;
}

// Define which diets are NOT recommended for each condition
const dietRestrictions: Record<string, string[]> = {
  diabetes: [], // Todas as dietas low-carb são boas para diabetes
  gastrite: ["carnivora", "jejum"], // Carnívora e jejum podem irritar o estômago
  hipertensao: [], // Dietas low-carb geralmente ajudam
  intolerancia_lactose: [], // Depende das receitas, não da dieta em si
  celiaquia: [], // Todas as dietas listadas são naturalmente sem glúten
};

const dietPlans = {
  carnivora: {
    name: "Dieta Carnívora",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🥩",
    route: "/dieta-carnivora",
    color: "coral",
    restrictions: ["gastrite"], // Não recomendada para gastrite
  },
  lowcarb: {
    name: "Dieta Low Carb",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🥗",
    route: "/dieta-lowcarb",
    color: "accent",
    restrictions: [],
  },
  cetogenica: {
    name: "Dieta Cetogênica",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🔥",
    route: "/dieta-cetogenica",
    color: "primary",
    restrictions: [],
  },
  jejum: {
    name: "Jejum Intermitente",
    description: "20 capítulos + 30 receitas completas",
    emoji: "⏰",
    route: "/jejum-intermitente",
    color: "purple",
    restrictions: ["gastrite", "diabetes"], // Não recomendado para gastrite e diabetes
  },
  detox: {
    name: "Sucos Detox",
    description: "20 capítulos + 50 receitas completas",
    emoji: "🥤",
    route: "/sucos-detox",
    color: "green",
    restrictions: ["diabetes"], // Sucos podem ter alto índice glicêmico
  },
};

const Nutrition = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nutricao");
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { canViewDiet } = useDietAccess();
  
  // Load saved preferences from localStorage
  const [filterAcknowledged, setFilterAcknowledged] = useState(() => {
    return localStorage.getItem("nutrition_filter_acknowledged") === "true";
  });
  const [showFilters, setShowFilters] = useState(() => {
    return localStorage.getItem("nutrition_filter_acknowledged") !== "true";
  });
  
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>(() => {
    const saved = localStorage.getItem("nutrition_medical_conditions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [
          { id: "diabetes", label: "Diabetes", active: false },
          { id: "gastrite", label: "Gastrite", active: false },
          { id: "hipertensao", label: "Hipertensão", active: false },
          { id: "intolerancia_lactose", label: "Intolerância à Lactose", active: false },
          { id: "celiaquia", label: "Celíaco", active: false },
        ];
      }
    }
    return [
      { id: "diabetes", label: "Diabetes", active: false },
      { id: "gastrite", label: "Gastrite", active: false },
      { id: "hipertensao", label: "Hipertensão", active: false },
      { id: "intolerancia_lactose", label: "Intolerância à Lactose", active: false },
      { id: "celiaquia", label: "Celíaco", active: false },
    ];
  });

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

  const [dietActiveTab, setDietActiveTab] = useState("carnivora");
  const activeConditions = medicalConditions.filter((c) => c.active).map((c) => c.id);

  // Filter available diets based on medical conditions
  const availableDiets = Object.entries(dietPlans).filter(([key, diet]) => {
    if (activeConditions.length === 0) return true;
    // Check if any active condition restricts this diet
    return !activeConditions.some(condition => diet.restrictions.includes(condition));
  });

  // Get current plan, fallback to first available if current is restricted
  const currentDietKey = availableDiets.find(([key]) => key === dietActiveTab)?.[0] || availableDiets[0]?.[0] || "carnivora";
  const currentPlan = dietPlans[currentDietKey as keyof typeof dietPlans];

  // Update active tab if current diet becomes restricted
  const effectiveDietTab = availableDiets.some(([key]) => key === dietActiveTab) ? dietActiveTab : currentDietKey;

  const toggleCondition = (id: string) => {
    const updated = medicalConditions.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
    setMedicalConditions(updated);
    localStorage.setItem("nutrition_medical_conditions", JSON.stringify(updated));
    // If any condition is selected, acknowledge the filter
    if (updated.some(c => c.active)) {
      setFilterAcknowledged(true);
      localStorage.setItem("nutrition_filter_acknowledged", "true");
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "coral":
        return {
          border: "border-coral/30 hover:border-coral/50",
          bg: "bg-coral/20",
          text: "text-coral",
        };
      case "accent":
        return {
          border: "border-accent/30 hover:border-accent/50",
          bg: "bg-accent/20",
          text: "text-accent",
        };
      case "primary":
        return {
          border: "border-primary/30 hover:border-primary/50",
          bg: "bg-primary/20",
          text: "text-primary",
        };
      case "purple":
        return {
          border: "border-[#9b87f5]/30 hover:border-[#9b87f5]/50",
          bg: "bg-[#9b87f5]/20",
          text: "text-[#9b87f5]",
        };
      case "green":
        return {
          border: "border-green-500/30 hover:border-green-500/50",
          bg: "bg-green-500/20",
          text: "text-green-500",
        };
      default:
        return {
          border: "border-coral/30 hover:border-coral/50",
          bg: "bg-coral/20",
          text: "text-coral",
        };
    }
  };

  return (
    <div className="min-h-screen pb-24">
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
                Escolha seu plano alimentar
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-3 rounded-xl transition-colors ${
              showFilters || activeConditions.length > 0
                ? "bg-coral/20 text-coral"
                : "bg-card text-muted-foreground"
            }`}
          >
            <Filter size={20} />
            {activeConditions.length > 0 ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center">
                {activeConditions.length}
              </span>
            ) : !filterAcknowledged && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-[8px] font-bold rounded-full flex items-center justify-center"
              >
                !
              </motion.span>
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
            onDismiss={() => {
              setShowFilters(false);
              setFilterAcknowledged(true);
              localStorage.setItem("nutrition_filter_acknowledged", "true");
            }}
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
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/30">
              <AlertTriangle size={18} className="text-accent" />
              <p className="text-sm text-accent">
                Dieta adaptada para suas condições
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Macro Summary */}
      <MacroSummary />

      {/* Diet Tabs */}
      <div className="px-6 py-4">
        <Tabs 
          value={effectiveDietTab} 
          onValueChange={setDietActiveTab} 
          className="w-full"
        >
          <TabsList className={`w-full bg-card/50 p-1 rounded-xl grid gap-1`} style={{ gridTemplateColumns: `repeat(${availableDiets.length}, 1fr)` }}>
            {availableDiets.map(([key, diet]) => {
              const colorClass = key === "carnivora" ? "data-[state=active]:bg-coral" :
                                key === "cetogenica" ? "data-[state=active]:bg-primary" :
                                key === "lowcarb" ? "data-[state=active]:bg-accent" :
                                key === "jejum" ? "data-[state=active]:bg-[#9b87f5]" :
                                "data-[state=active]:bg-green-500";
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`rounded-lg ${colorClass} data-[state=active]:text-primary-foreground text-[10px] font-medium px-1`}
                >
                  {key === "carnivora" ? "Carnívora" :
                   key === "cetogenica" ? "Keto" :
                   key === "lowcarb" ? "Low Carb" :
                   key === "jejum" ? "Jejum" : "Detox"}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {availableDiets.length === 0 && (
            <div className="mt-6 text-center py-8">
              <p className="text-muted-foreground text-sm">
                Nenhuma dieta disponível para suas condições selecionadas.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Ajuste os filtros médicos para ver opções.
              </p>
            </div>
          )}

          {/* Diet Card */}
          {availableDiets.length > 0 && (
            <motion.div
              key={effectiveDietTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {(() => {
                const dietKey = currentDietKey === "cetogenica" ? "keto" : 
                               currentDietKey === "carnivora" ? "carnivore" : 
                               currentDietKey === "jejum" ? "fasting" : 
                               currentDietKey;
                const isLocked = !canViewDiet(dietKey as DietType);
                
                return (
                  <div 
                    onClick={() => isLocked ? setShowPurchaseModal(true) : navigate(currentPlan.route)}
                    className={`glass-card rounded-2xl p-6 cursor-pointer transition-all relative overflow-hidden ${getColorClasses(currentPlan.color).border} ${isLocked ? 'opacity-80 grayscale-[0.5]' : ''}`}
                  >
                    {isLocked && (
                      <div className="absolute top-3 right-3 bg-coral/10 p-1.5 rounded-full">
                        <Lock className="w-4 h-4 text-coral" />
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(currentPlan.color).bg}`}>
                        <span className="text-3xl">{currentPlan.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                          {currentPlan.name}
                          {isLocked && <span className="text-[10px] bg-coral/20 text-coral px-2 py-0.5 rounded-full uppercase tracking-wider">Bloqueado</span>}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {currentPlan.description}
                        </p>
                        <p className={`text-xs mt-1 ${isLocked ? 'text-coral font-medium' : getColorClasses(currentPlan.color).text}`}>
                          {isLocked ? "Toque para desbloquear esta dieta →" : "Toque para acessar o conteúdo completo →"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </Tabs>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
      <PurchaseModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} />
    </div>
  );
};

export default Nutrition;
