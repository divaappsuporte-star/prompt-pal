import { motion } from "framer-motion";
import { Beef, Salad, Leaf, Flame, Lock, Unlock } from "lucide-react";
import MockupCard from "./MockupCard";

const diets = [
  { icon: Leaf, title: "Low Carb", subtitle: "Redução inteligente de carboidratos", color: "mint" as const, locked: false },
  { icon: Beef, title: "Carnívora", subtitle: "Proteína e gordura natural", color: "coral" as const, locked: false },
  { icon: Salad, title: "Cetogênica", subtitle: "Estado de cetose otimizado", color: "gold" as const, locked: true },
  { icon: Flame, title: "Metabólica", subtitle: "Aceleração do metabolismo", color: "coral" as const, locked: true },
];

const DietGridSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-4 py-2 rounded-full mb-4">
            <Unlock className="w-4 h-4" />
            <span className="text-sm font-bold">ECOSSISTEMA DE PROTOCOLOS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Escolha Sua Estratégia Alimentar
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dentro do Nutri21, você pode desbloquear novos protocolos quando quiser, testar diferentes dietas e encontrar o que funciona melhor para seu corpo.
          </p>
        </motion.div>

        {/* Diet grid mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card/30 border border-border/50 rounded-3xl p-6 md:p-8"
        >
          <div className="grid grid-cols-2 gap-4">
            {diets.map((diet, index) => (
              <motion.div
                key={diet.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <MockupCard
                  icon={diet.icon}
                  title={diet.title}
                  subtitle={diet.subtitle}
                  color={diet.color}
                  locked={diet.locked}
                />
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Unlock className="w-4 h-4 text-mint" />
              <span>Incluído no plano</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Desbloqueável</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mt-6 text-sm"
        >
          👉 Cada protocolo adicional pode ser liberado por um valor acessível, sem mensalidade e sem compromisso.
        </motion.p>
      </div>
    </section>
  );
};

export default DietGridSection;
