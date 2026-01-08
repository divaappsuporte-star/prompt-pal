import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Moon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import BottomNavigation from "@/components/BottomNavigation";

const Complemento = () => {
  const navigate = useNavigate();
  const { todayHydration, todaySleep, addWaterIntake, addSleepTime } = useProgress();
  const [activeTab, setActiveTab] = useState("home");
  const [waterAmount, setWaterAmount] = useState(250);
  const [sleepHours, setSleepHours] = useState(7);

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
    }
  };

  const waterOptions = [250, 500, 750, 1000];
  const sleepOptions = [5, 6, 7, 8, 9, 10];

  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { text: "Ideal", color: "text-mint" };
    if (hours >= 6) return { text: "Razoável", color: "text-gold" };
    return { text: "Insuficiente", color: "text-coral" };
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-14 pb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-2xl font-bold text-foreground">Complemento</h1>
        </div>
      </motion.header>

      <div className="px-4 space-y-6">
        {/* Hydration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 border border-primary/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Hidratação</h2>
              <p className="text-sm text-muted-foreground">Meta: 2L por dia</p>
            </div>
          </div>

          {/* Current Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-primary">
                {(todayHydration / 1000).toFixed(1)}L
              </span>
              <span className="text-sm text-muted-foreground">de 2L</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((todayHydration / 2000) * 100, 100)}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {waterOptions.map((ml) => (
              <Button
                key={ml}
                variant="outline"
                onClick={() => addWaterIntake(ml)}
                className="h-14 flex flex-col items-center justify-center border-primary/30 hover:bg-primary/10 hover:border-primary"
              >
                <span className="text-lg font-bold text-foreground">{ml}</span>
                <span className="text-[10px] text-muted-foreground">ml</span>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Sleep Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 border border-primary/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
              <Moon className="w-6 h-6 text-mint" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Sono</h2>
              <p className="text-sm text-muted-foreground">Meta: 7-8h por noite</p>
            </div>
          </div>

          {/* Current Sleep */}
          <div className="mb-6 text-center">
            <span className="text-4xl font-bold text-mint">
              {todaySleep > 0 ? `${todaySleep}h` : "--"}
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              {todaySleep > 0 
                ? getSleepQuality(todaySleep).text
                : "Registre seu sono de ontem"
              }
            </p>
          </div>

          {/* Sleep Selector */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => setSleepHours(Math.max(4, sleepHours - 1))}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
            >
              <Minus className="w-5 h-5 text-foreground" />
            </button>
            <div className="text-center">
              <span className="text-5xl font-bold text-foreground">{sleepHours}</span>
              <span className="text-xl text-muted-foreground ml-1">h</span>
              <p className={`text-sm ${getSleepQuality(sleepHours).color}`}>
                {getSleepQuality(sleepHours).text}
              </p>
            </div>
            <button
              onClick={() => setSleepHours(Math.min(12, sleepHours + 1))}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Quick Select */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {sleepOptions.map((hours) => (
              <button
                key={hours}
                onClick={() => setSleepHours(hours)}
                className={`h-10 rounded-lg text-sm font-medium transition-colors
                  ${sleepHours === hours 
                    ? "bg-mint text-background" 
                    : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          <Button
            onClick={() => addSleepTime(sleepHours)}
            className="w-full bg-mint hover:bg-mint/90 text-background"
          >
            Registrar Sono
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 rounded-2xl p-4 border border-muted"
        >
          <h3 className="font-display text-sm font-bold text-foreground mb-2">💡 Dicas</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Beba água ao acordar para ativar o metabolismo</li>
            <li>• Evite telas 1h antes de dormir para melhor qualidade do sono</li>
            <li>• 7-8h de sono otimizam a recuperação muscular</li>
          </ul>
        </motion.div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Complemento;
