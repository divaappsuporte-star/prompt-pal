import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DietType, DIET_INFO } from "@/types/diet";

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dietKey: DietType | null;
}

const SalesModal = ({ isOpen, onClose, dietKey }: SalesModalProps) => {
  if (!dietKey) return null;
  const diet = DIET_INFO[dietKey];

  const checkoutLinks: Record<string, string> = {
    keto: "https://pay.kirvano.com/7ed7bef7-1073-40a5-b8f5-44876b60022e",
    metabolic: "#", // Aguardando link específico
    fasting: "#",   // Aguardando link específico
  };

  const checkoutUrl = checkoutLinks[dietKey] || "#";

  const benefits = [
    "Cardápio Personalizado",
    "Acesso Vitalício ao Protocolo",
    "Suporte Exclusivo via App"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header Image/Icon */}
            <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">Protocolo Premium</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                  Desbloquear {diet.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Tenha acesso ao protocolo completo e acelere seus resultados com a metodologia Nutri21.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => window.open(checkoutUrl, "_blank")}
                className="w-full h-14 rounded-2xl text-lg font-bold gap-2 shadow-lg shadow-primary/20"
              >
                Desbloquear Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground mt-4">
                Pagamento seguro via Kirvano • Acesso imediato após aprovação
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SalesModal;
