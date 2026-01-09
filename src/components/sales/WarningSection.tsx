import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const WarningSection = () => {
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <div className="relative bg-gradient-to-br from-coral/10 to-coral/5 border-2 border-coral/30 rounded-2xl p-6 md:p-8">
          {/* Alert icon */}
          <div className="absolute -top-4 left-6 bg-coral rounded-full p-2">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>

          <div className="mt-2">
            <h2 className="font-display text-xl md:text-2xl font-bold text-coral mb-4">
              LEIA ISSO COM ATENÇÃO SE VOCÊ JÁ TENTOU EMAGRECER
            </h2>

            <p className="text-muted-foreground mb-4">
              A maioria das pessoas acha que falha porque não tem disciplina.
            </p>

            <p className="text-foreground font-medium mb-4">
              Mas a verdade é mais simples (e mais cruel):
            </p>

            <div className="bg-background/50 rounded-xl p-4 mb-4">
              <p className="text-lg md:text-xl font-bold text-foreground">
                👉 Elas seguem protocolos que não foram feitos para o corpo delas.
              </p>
            </div>

            <p className="text-coral font-display font-bold text-lg">
              O Nutri21 nasceu para corrigir isso.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WarningSection;
