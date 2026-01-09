import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface SalesHeroProps {
  onCtaClick: () => void;
}

const SalesHero = ({ onCtaClick }: SalesHeroProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-coral/5 via-transparent to-transparent" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-coral/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: "-100%",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6"
        >
          O Protocolo Alimentar Inteligente de 21 Dias{" "}
          <span className="text-coral">Que Se Adapta ao Seu Corpo</span>{" "}
          (e Não o Contrário)
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
        >
          Perca de <span className="text-coral font-bold">1 a até 15 quilos</span> em 21 dias com um sistema digital baseado em ciência, que começa pela mente, cria seu plano alimentar personalizado e acompanha cada etapa do seu processo — mesmo que você já tenha tentado de tudo.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-coral hover:bg-coral/90 text-white font-display text-lg px-8 py-6 rounded-full shadow-lg shadow-coral/25 group"
          >
            <Zap className="w-5 h-5 mr-2" />
            COMEÇAR AGORA POR R$47
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Acesso vitalício • Sem mensalidade
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-coral rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SalesHero;
