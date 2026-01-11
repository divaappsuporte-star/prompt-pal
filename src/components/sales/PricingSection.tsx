import { motion } from "framer-motion";
import { Zap, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onCtaClick: () => void;
}

const comparisons = [
  { item: "Nutricionista", price: "R$300", note: "por consulta" },
  { item: "Protocolos metabólicos", price: "R$1.500", note: "ou mais" },
  { item: "Acompanhamento personalizado", price: "R$5.000+", note: "por ano" },
];

const included = [
  "Sistema de plano alimentar personalizado",
  "10 capítulos de reprogramação mental",
  "Jejum intermitente guiado (grátis)",
  "50+ receitas detox (grátis)",
  "Acompanhamento em tempo real",
  "Status do corpo atualizado",
  "Acesso vitalício",
  "Sem mensalidade",
];

const PricingSection = ({ onCtaClick }: PricingSectionProps) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent via-coral/5 to-transparent">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Quanto Isso Valeria Fora do Digital?
          </h2>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card/50 border border-border/50 rounded-2xl p-6 mb-8"
        >
          <div className="space-y-4">
            {comparisons.map((comp, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="text-muted-foreground">{comp.item}</span>
                </div>
                <div className="text-right">
                  <span className="text-foreground font-bold line-through opacity-50">{comp.price}</span>
                  <span className="text-xs text-muted-foreground ml-2">{comp.note}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-coral/20 to-coral/5 border-2 border-coral/30 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-coral/20 blur-3xl" />

          <div className="relative z-10">
            <p className="text-coral font-bold mb-4">ACESSO HOJE</p>

            <div className="mb-6">
              <span className="text-muted-foreground line-through text-lg">De R$297</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl md:text-6xl font-display font-bold text-coral">R$37</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">pagamento único – acesso vitalício</p>
            </div>

            {/* Included items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 text-left max-w-lg mx-auto">
              {included.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-mint flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-coral hover:bg-coral/90 text-white font-display text-lg px-10 py-7 rounded-full shadow-lg shadow-coral/25 group w-full md:w-auto"
            >
              <Zap className="w-5 h-5 mr-2" />
              QUERO COMEÇAR AGORA
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>✓ Sem mensalidade</span>
              <span>✓ Sem pegadinhas</span>
              <span>✓ Acesso imediato</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
