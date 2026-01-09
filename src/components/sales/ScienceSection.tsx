import { motion } from "framer-motion";
import { FlaskConical, Check, Shield } from "lucide-react";

const points = [
  "Protocolos nutricionais científicos",
  "Modelos metabólicos atualizados",
  "O mais recente protocolo americano de alimentação",
  "Prioridade para carnes e gorduras naturais",
  "Controle hormonal e inflamatório",
  "Tudo explicado de forma simples, com exceções claras",
];

const ScienceSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-2 rounded-full mb-4">
            <FlaskConical className="w-4 h-4" />
            <span className="text-sm font-bold">CIÊNCIA, NÃO MODISMO</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Baseado em Evidências Científicas
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card/50 border border-border/50 rounded-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-mint" />
                </div>
                <span className="text-foreground">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-coral/20 via-gold/20 to-mint/20 rounded-2xl p-6 md:p-8 border border-coral/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-coral" />
              <span className="text-coral font-bold text-sm">A PROMESSA</span>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Perca de 1 a até 15 quilos em 21 dias
            </h3>
            <p className="text-muted-foreground">
              conforme sua meta, perfil corporal e estratégia escolhida.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm">
              <span className="text-muted-foreground">Sem milagre.</span>
              <span className="text-muted-foreground">Sem achismo.</span>
              <span className="text-coral font-bold">Com método.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScienceSection;
