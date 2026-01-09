import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus, ArrowDown } from "lucide-react";

interface InstallPWAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstallPWAModal = ({ isOpen, onClose }: InstallPWAModalProps) => {
  const steps = [
    {
      icon: <Share className="w-8 h-8" />,
      title: "Toque em Compartilhar",
      description: "No Safari, toque no ícone de compartilhar na barra inferior",
    },
    {
      icon: <ArrowDown className="w-8 h-8" />,
      title: "Role para baixo",
      description: "Procure a opção 'Adicionar à Tela de Início'",
    },
    {
      icon: <Plus className="w-8 h-8" />,
      title: "Adicione o app",
      description: "Toque em 'Adicionar' no canto superior direito",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">
                Instalar Nutri21
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-coral flex items-center justify-center text-primary-foreground">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-display font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Safari indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 rounded-xl border border-primary/30 bg-primary/10"
            >
              <p className="text-sm text-center text-muted-foreground">
                <span className="text-primary font-medium">Dica:</span> Use o Safari para a melhor experiência de instalação no iPhone
              </p>
            </motion.div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="w-full mt-6 py-4 rounded-xl gradient-coral text-primary-foreground font-semibold"
            >
              Entendi
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPWAModal;
