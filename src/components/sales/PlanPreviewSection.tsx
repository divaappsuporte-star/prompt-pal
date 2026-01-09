import { motion } from "framer-motion";
import { Calendar, Coffee, Sun, Moon, Droplets, Check, Activity } from "lucide-react";
import MockupPhone from "./MockupPhone";

const PlanPreviewSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-4 py-2 rounded-full mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-bold">SEU DIA A DIA</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Veja Como Funciona Seu Hub Diário
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada dia você tem acesso a refeições personalizadas, controle de hidratação e acompanhamento do que está acontecendo no seu corpo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <MockupPhone className="max-w-[280px]">
              <div className="p-4 space-y-3">
                {/* Progress header */}
                <div className="text-center mb-4">
                  <p className="text-xs text-muted-foreground">Progresso</p>
                  <p className="font-display font-bold text-lg">Dia 5 de 21</p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="w-[24%] h-full bg-coral rounded-full" />
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-2">
                  {/* Café */}
                  <div className="bg-card/80 rounded-xl p-3 border border-gold/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center">
                        <Coffee className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-xs font-bold text-gold">CAFÉ</span>
                      <Check className="w-4 h-4 text-mint ml-auto" />
                    </div>
                    <p className="text-xs text-muted-foreground">Ovos com bacon e abacate</p>
                  </div>

                  {/* Almoço */}
                  <div className="bg-card/80 rounded-xl p-3 border border-coral/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-coral/20 flex items-center justify-center">
                        <Sun className="w-3 h-3 text-coral" />
                      </div>
                      <span className="text-xs font-bold text-coral">ALMOÇO</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Bife com salada verde</p>
                  </div>

                  {/* Jantar */}
                  <div className="bg-card/80 rounded-xl p-3 border border-mint/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-mint/20 flex items-center justify-center">
                        <Moon className="w-3 h-3 text-mint" />
                      </div>
                      <span className="text-xs font-bold text-mint">JANTAR</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Salmão grelhado com legumes</p>
                  </div>
                </div>

                {/* Water tracking */}
                <div className="bg-card/80 rounded-xl p-3 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium">Hidratação</span>
                    <span className="text-xs text-muted-foreground ml-auto">1.5L / 2.5L</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-[60%] h-full bg-blue-400 rounded-full" />
                  </div>
                </div>
              </div>
            </MockupPhone>
          </motion.div>

          {/* Body Status mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-4">
              Acompanhe Seu Corpo em Tempo Real
            </h3>

            {/* Body status card mockup */}
            <div className="bg-card/50 border border-border/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-mint" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Status do Corpo</h4>
                  <p className="text-xs text-muted-foreground">3 processos ativos</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-background/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🔥</span>
                    <span className="text-sm font-medium">Queima de Gordura</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Seu corpo está usando gordura como energia principal após o café da manhã low carb.
                  </p>
                </div>

                <div className="bg-background/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🧠</span>
                    <span className="text-sm font-medium">Clareza Mental</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Níveis estáveis de glicose mantêm foco e concentração elevados.
                  </p>
                </div>

                <div className="bg-background/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">💪</span>
                    <span className="text-sm font-medium">Saciedade Prolongada</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Proteínas e gorduras boas mantêm você satisfeito por mais tempo.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlanPreviewSection;
