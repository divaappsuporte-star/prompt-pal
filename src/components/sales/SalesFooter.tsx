import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

interface SalesFooterProps {
  onCtaClick: () => void;
}

const SalesFooter = ({ onCtaClick }: SalesFooterProps) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent to-coral/5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Comece Agora Seu Protocolo de 21 Dias
          </h2>

          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Se você quer parar de testar dietas aleatórias e seguir um protocolo inteligente, o Nutri21 foi criado para você.
          </p>

          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-coral hover:bg-coral/90 text-white font-display text-lg px-10 py-7 rounded-full shadow-lg shadow-coral/25 group"
          >
            <Zap className="w-5 h-5 mr-2" />
            COMEÇAR AGORA POR R$47
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="mt-10 pt-10 border-t border-border/30">
            <p className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
              Nutri21
            </p>
            <p className="text-muted-foreground">
              21 dias. Um sistema. <span className="text-coral">Um novo corpo.</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} Nutri21. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SalesFooter;
