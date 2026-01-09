import { motion } from "framer-motion";
import { Brain, Target, Sparkles } from "lucide-react";
import MockupCard from "./MockupCard";

const TwoPathsSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-gold/5 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-bold">ONDE TUDO COMEÇA</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            O Nutri21 Começa Onde Toda Transformação Real Começa:{" "}
            <span className="text-gold">Na Mente</span>
          </h2>
          <p className="text-muted-foreground">
            Assim que você acessa o sistema, não vê cardápio. Você vê dois caminhos claros:
          </p>
        </motion.div>

        {/* Two paths mockups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Mentalidade Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <span className="text-coral font-bold">1️⃣ MENTALIDADE</span>
              </div>
              
              {/* Mockup card */}
              <div className="mb-4">
                <MockupCard
                  icon={Brain}
                  title="Mentalidade"
                  subtitle="PNL & Reprogramação Mental"
                  tag="COMECE POR AQUI"
                  tagColor="gold"
                  color="gold"
                  size="lg"
                />
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Uma leitura inicial baseada em PNL, psicologia e evidência científica, criada para:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Reprogramar crenças sabotadoras</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Reduzir ansiedade alimentar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Aumentar foco e consistência</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Preparar sua mente para o protocolo</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Meu Plano Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🥗</span>
                <span className="text-coral font-bold">2️⃣ CRIAR MEU PLANO</span>
              </div>
              
              {/* Mockup card */}
              <div className="mb-4">
                <MockupCard
                  icon={Target}
                  title="Meu Plano de 21 Dias"
                  subtitle="Protocolo Personalizado"
                  color="coral"
                  progress={25}
                  size="lg"
                />
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Você informa seus dados e o sistema gera seu plano:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-xs">✓</span>
                  <span>Peso e altura atuais</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-xs">✓</span>
                  <span>Meta de perda em 21 dias</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-xs">✓</span>
                  <span>Estratégia alimentar escolhida</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-coral/20 flex items-center justify-center text-xs">✓</span>
                  <span>Plano personalizado automático</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gold font-display font-bold text-lg"
        >
          👉 Porque emagrecimento duradouro começa na mente, não no prato.
        </motion.p>
      </div>
    </section>
  );
};

export default TwoPathsSection;
