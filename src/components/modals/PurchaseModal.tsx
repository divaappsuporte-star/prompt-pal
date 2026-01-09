import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Sparkles } from "lucide-react";
import { DietInfo, DietType } from "@/types/diet";
import { motion } from "framer-motion";

// Links de checkout para cada dieta
// TODO: Substituir pelos links reais de pagamento
const CHECKOUT_LINKS: Record<DietType, string> = {
  carnivore: 'https://pay.hotmart.com/carnivore',
  keto: 'https://pay.hotmart.com/keto',
  lowcarb: 'https://pay.hotmart.com/lowcarb',
  metabolic: 'https://pay.hotmart.com/metabolic',
  detox: 'https://pay.hotmart.com/detox',
  fasting: 'https://pay.hotmart.com/fasting',
};

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  diet: DietInfo | null;
  dietKey: DietType | null;
}

const PurchaseModal = ({ isOpen, onClose, diet, dietKey }: PurchaseModalProps) => {
  if (!diet || !dietKey) return null;

  const handlePurchase = () => {
    const checkoutUrl = CHECKOUT_LINKS[dietKey];
    window.open(checkoutUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            Desbloquear {diet.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            Acesse todas as receitas e o plano de 21 dias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Diet Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">{diet.name}</h3>
                <p className="text-sm text-muted-foreground">{diet.description}</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {diet.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <Button
            onClick={handlePurchase}
            className="w-full h-14 text-lg font-display gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Desbloquear Agora
            <ExternalLink className="w-4 h-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Você será redirecionado para a página de pagamento seguro
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
