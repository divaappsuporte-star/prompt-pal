import { motion } from "framer-motion";
import { Clock, GlassWater, Gift } from "lucide-react";
import MockupCard from "./MockupCard";

const BonusSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-mint/5 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-2 rounded-full mb-4">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-bold">BÔNUS GRÁTIS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Dois Sistemas Poderosos{" "}
            <span className="text-mint">Liberados Gratuitamente</span>
          </h2>
          <p className="text-muted-foreground">
            Esses dois sistemas já valeriam o investimento sozinhos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jejum Intermitente */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-mint text-background text-xs font-bold px-2 py-1 rounded-full">
                GRÁTIS
              </span>
            </div>

            <MockupCard
              icon={Clock}
              title="Jejum Intermitente"
              subtitle="Protocolo guiado"
              tag="⏱️ TEMPO REAL"
              tagColor="gold"
              color="gold"
              size="md"
            />

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Acompanhamento em tempo real
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Explica o que acontece no corpo
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Reduz medo e ansiedade
              </li>
            </ul>
          </motion.div>

          {/* Detox */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card/50 border border-border/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-mint text-background text-xs font-bold px-2 py-1 rounded-full">
                GRÁTIS
              </span>
            </div>

            <MockupCard
              icon={GlassWater}
              title="Sucos Detox"
              subtitle="50+ receitas prontas"
              tag="🥤 RECEITAS"
              tagColor="mint"
              color="mint"
              size="md"
            />

            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Mais de 50 receitas configuradas
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Protocolos prontos para uso
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-mint">✓</span>
                Integração com plano alimentar
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;
