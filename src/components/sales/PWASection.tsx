import { motion } from "framer-motion";
import { Smartphone, Monitor, Download } from "lucide-react";

const PWASection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-bold">FUNCIONA COMO APP</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Instala Direto no Seu Celular
          </h2>
          <p className="text-muted-foreground">
            Não precisa App Store ou Google Play
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Android */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-mint/10 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-mint" />
            </div>
            <h3 className="font-display font-bold mb-2">Android</h3>
            <p className="text-sm text-muted-foreground">
              Adicione à tela inicial em segundos
            </p>
          </div>

          {/* iPhone */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-coral" />
            </div>
            <h3 className="font-display font-bold mb-2">iPhone</h3>
            <p className="text-sm text-muted-foreground">
              Safari → Compartilhar → Adicionar à Tela
            </p>
          </div>

          {/* Desktop */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-gold" />
            </div>
            <h3 className="font-display font-bold mb-2">Computador</h3>
            <p className="text-sm text-muted-foreground">
              Acesse pelo navegador, sem instalar nada
            </p>
          </div>
        </motion.div>

        {/* Install prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-card/50 border border-border/50 rounded-full px-4 py-2">
            <Download className="w-4 h-4 text-coral" />
            <span className="text-sm text-muted-foreground">
              Após a compra, você recebe instruções de instalação
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PWASection;
