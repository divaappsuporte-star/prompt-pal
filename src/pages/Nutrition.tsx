import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Filter, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicalFilters from "@/components/nutrition/MedicalFilters";
import MacroSummary from "@/components/nutrition/MacroSummary";
import BottomNavigation from "@/components/BottomNavigation";
import QuickLogModal from "@/components/modals/QuickLogModal";

export interface MedicalCondition {
  id: string;
  label: string;
  active: boolean;
}

const dietPlans = {
  carnivora: {
    name: "Dieta Carnívora",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🥩",
    route: "/dieta-carnivora",
    color: "coral",
  },
  lowcarb: {
    name: "Dieta Low Carb",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🥗",
    route: "/dieta-lowcarb",
    color: "accent",
  },
  cetogenica: {
    name: "Dieta Cetogênica",
    description: "20 capítulos + 30 receitas completas",
    emoji: "🔥",
    route: "/dieta-cetogenica",
    color: "primary",
  },
  jejum: {
    name: "Jejum Intermitente",
    description: "20 capítulos + 30 receitas completas",
    emoji: "⏰",
    route: "/jejum-intermitente",
    color: "purple",
  },
  detox: {
    name: "Sucos Detox",
    description: "20 capítulos + 50 receitas completas",
    emoji: "🥤",
    route: "/sucos-detox",
    color: "green",
  },
};

const Nutrition = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("nutricao");
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([
    { id: "diabetes", label: "Diabetes", active: false },
    { id: "gastrite", label: "Gastrite", active: false },
    { id: "hipertensao", label: "Hipertensão", active: false },
    { id: "intolerancia_lactose", label: "Intolerância à Lactose", active: false },
    { id: "celiaquia", label: "Celíaco", active: false },
  ]);

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
  const currentPlan = dietPlans[dietActiveTab as keyof typeof dietPlans];
  const activeConditions = medicalConditions.filter((c) => c.active).map((c) => c.id);

  const toggleCondition = (id: string) => {
    setMedicalConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
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
                Escolha seu plano alimentar
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
      <MacroSummary macros={{ calories: 0, protein: 0, carbs: 0, fat: 0 }} />

      {/* Diet Tabs */}
      <div className="px-6 py-4">
        <Tabs 
          value={dietActiveTab} 
          onValueChange={setDietActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full bg-card/50 p-1 rounded-xl grid grid-cols-5 gap-1">
            <TabsTrigger
              value="carnivora"
              className="rounded-lg data-[state=active]:bg-coral data-[state=active]:text-primary-foreground text-[10px] font-medium px-1"
            >
              Carnívora
            </TabsTrigger>
            <TabsTrigger
              value="cetogenica"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-medium px-1"
            >
              Keto
            </TabsTrigger>
            <TabsTrigger
              value="lowcarb"
              className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-[10px] font-medium px-1"
            >
              Low Carb
            </TabsTrigger>
            <TabsTrigger
              value="jejum"
              className="rounded-lg data-[state=active]:bg-[#9b87f5] data-[state=active]:text-primary-foreground text-[10px] font-medium px-1"
            >
              Jejum
            </TabsTrigger>
            <TabsTrigger
              value="detox"
              className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-primary-foreground text-[10px] font-medium px-1"
            >
              Detox
            </TabsTrigger>
          </TabsList>

          {/* Diet Card */}
          <motion.div
            key={dietActiveTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div 
              onClick={() => navigate(currentPlan.route)}
              className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${getColorClasses(currentPlan.color).border}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${getColorClasses(currentPlan.color).bg}`}>
                  <span className="text-3xl">{currentPlan.emoji}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {currentPlan.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {currentPlan.description}
                  </p>
                  <p className={`text-xs mt-1 ${getColorClasses(currentPlan.color).text}`}>
                    Toque para acessar o conteúdo completo →
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Tabs>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
    </div>
  );
};

export default Nutrition;
