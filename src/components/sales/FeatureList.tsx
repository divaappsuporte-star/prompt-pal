import { motion } from "framer-motion";
import { Zap, Check } from "lucide-react";

const features = [
  "Por que dietas genéricas falham, mesmo quando você segue tudo certo.",
  "Como reprogramar sua mente para emagrecer, antes mesmo de mudar a alimentação.",
  "O método para perder gordura sem viver com fome ou culpa.",
  "Quando comer carne e gordura natural acelera mais o emagrecimento do que cortar calorias.",
  "O que acontece com seu corpo do dia 1 ao dia 21 — e como usar isso a seu favor.",
  "Como o Nutri21 gera milhares de combinações alimentares para encaixar na sua meta.",
  "Por que jejum intermitente e detox funcionam melhor quando são guiados.",
  "Como testar diferentes estratégias alimentares sem bagunçar seu metabolismo.",
];

const FeatureList = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-coral/10 text-coral px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold">O QUE VOCÊ VAI DESCOBRIR</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 bg-card/50 border border-border/50 rounded-xl p-4"
            >
              <div className="w-6 h-6 rounded-full bg-coral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-coral" />
              </div>
              <p className="text-foreground">{feature}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureList;
