import { motion } from "framer-motion";
import { Activity, Droplets, Moon, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

const HealthMonitor = () => {
  const { healthAnalysis } = useProgress();
  const { hydration, sleep, activity } = healthAnalysis;

  const hasAnyData = hydration.level !== "none" || sleep.level !== "none" || activity.level !== "none";

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <AlertTriangle size={16} className="text-coral" />;
      case "warning":
        return <AlertTriangle size={16} className="text-gold" />;
      case "good":
        return <CheckCircle2 size={16} className="text-mint" />;
      default:
        return <Info size={16} className="text-muted-foreground" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "border-coral/30 bg-coral/5";
      case "warning":
        return "border-gold/30 bg-gold/5";
      case "good":
        return "border-mint/30 bg-mint/5";
      default:
        return "border-border/30 bg-muted/5";
    }
  };

  const getTextColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-coral";
      case "warning":
        return "text-gold";
      case "good":
        return "text-mint";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="px-4 py-2"
    >
      <div className="glass-card rounded-2xl p-5 border border-border/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-coral/20 flex items-center justify-center">
            <Activity className="text-coral" size={20} />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Monitor de Saúde</h3>
            <p className="text-xs text-muted-foreground">Análise baseada nos seus dados</p>
          </div>
        </div>

        {!hasAnyData ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Registre água, sono e faça treinos para ver análises personalizadas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Hydration */}
            {hydration.level !== "none" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-xl p-3 border ${getLevelColor(hydration.level)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets size={16} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${getTextColor(hydration.level)}`}>
                        Hidratação: {hydration.level === "good" ? "Boa!" : hydration.level === "warning" ? "Atenção" : "Crítico!"}
                      </span>
                      {getLevelIcon(hydration.level)}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hydration.message}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">
                      {(hydration.current / 1000).toFixed(1)}L de {(hydration.target / 1000)}L
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sleep */}
            {sleep.level !== "none" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-xl p-3 border ${getLevelColor(sleep.level)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-mint/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Moon size={16} className="text-mint" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${getTextColor(sleep.level)}`}>
                        Sono: {sleep.level === "good" ? "Bom!" : sleep.level === "warning" ? "Atenção" : "Crítico!"}
                      </span>
                      {getLevelIcon(sleep.level)}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {sleep.message}
                    </p>
                    <p className="text-xs text-foreground/70 mt-1">
                      {sleep.current}h de {sleep.target}h recomendadas
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity */}
            {activity.level !== "none" && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-xl p-3 border ${getLevelColor(activity.level)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity size={16} className="text-coral" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${getTextColor(activity.level)}`}>
                        Atividade: {activity.level === "good" ? "Excelente!" : activity.level === "warning" ? "Leve" : "Nenhuma"}
                      </span>
                      {getLevelIcon(activity.level)}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activity.message}
                    </p>
                    {activity.caloriesBurned > 0 && (
                      <p className="text-xs text-foreground/70 mt-1">
                        🔥 {activity.caloriesBurned} kcal queimadas hoje
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HealthMonitor;
